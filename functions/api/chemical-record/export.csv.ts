interface Env {
  CHEMICAL_RECORDS: D1Database;
  CHEMICAL_RECORD_EXPORT_KEY?: string;
}

interface ChemicalRecordRow {
  id: number;
  local_id: string;
  submitted_at_local: string;
  received_at: string;
  submitter: string;
  application_date: string;
  client: string;
  notes: string;
  products_json: string;
}

interface ProductEntry {
  name: string;
  quantity: number;
  unit: string;
}

const PRODUCT_COLUMNS = [
  { name: 'Preen', header: 'Preen (lb)' },
  { name: 'Prosecutor Pro', header: 'Prosecutor Pro (fl oz)' },
  { name: '3-Way', header: '3-Way (fl oz)' },
  { name: 'Dimension', header: 'Dimension (lb)' },
];

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.CHEMICAL_RECORDS) {
    return text(500, 'Chemical records database is not configured.');
  }
  if (!env.CHEMICAL_RECORD_EXPORT_KEY || !isAuthorized(request, env.CHEMICAL_RECORD_EXPORT_KEY)) {
    return text(401, 'Unauthorized.');
  }

  await ensureSchema(env.CHEMICAL_RECORDS);

  const url = new URL(request.url);
  const from = url.searchParams.get('from') || '';
  const to = url.searchParams.get('to') || '';
  const where: string[] = [];
  const params: string[] = [];

  if (/^\d{4}-\d{2}-\d{2}$/.test(from)) {
    where.push('application_date >= ?');
    params.push(from);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    where.push('application_date <= ?');
    params.push(to);
  }

  const query = `
    SELECT * FROM chemical_records
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY application_date DESC, id DESC
  `;
  const result = await env.CHEMICAL_RECORDS.prepare(query).bind(...params).all<ChemicalRecordRow>();
  const rows = result.results || [];

  const csvRows = [
    [
      'Application Date',
      'Submitter',
      'Client / Address / Visit',
      ...PRODUCT_COLUMNS.map((column) => column.header),
      'Other Products',
      'Notes',
      'Submitted At Local',
      'Received At',
      'Entry ID',
    ],
  ];

  for (const row of rows) {
    const products = parseProducts(row.products_json);
    const standardAmounts = PRODUCT_COLUMNS.map((column) => formatStandardAmount(products, column.name));
    const otherProducts = products
      .filter((product) => !PRODUCT_COLUMNS.some((column) => column.name === product.name))
      .map((product) => `${product.name}: ${product.quantity} ${product.unit}`.trim())
      .join('; ');

    csvRows.push([
      row.application_date,
      row.submitter,
      row.client,
      ...standardAmounts,
      otherProducts,
      row.notes,
      row.submitted_at_local,
      row.received_at,
      String(row.id),
    ]);
  }

  const csv = csvRows.map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="westside-chemical-records.csv"',
      'Cache-Control': 'no-store',
    },
  });
};

function formatStandardAmount(products: ProductEntry[], name: string): string {
  return products
    .filter((product) => product.name === name)
    .map((product) => String(product.quantity))
    .join('; ');
}

function isAuthorized(request: Request, key: string): boolean {
  const url = new URL(request.url);
  const supplied = url.searchParams.get('key') || request.headers.get('X-Export-Key') || '';
  return supplied === key;
}

function parseProducts(json: string): ProductEntry[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function csvCell(value: string): string {
  // Prevent spreadsheet programs from interpreting user-controlled cells as
  // formulas when the CSV is opened. A leading apostrophe displays the value
  // literally in Excel/Sheets while preserving the underlying record text.
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  const escaped = safe.replace(/"/g, '""');
  return /[",\r\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

let schemaReady: Promise<void> | null = null;
function ensureSchema(db: D1Database): Promise<void> {
  schemaReady ??= db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS chemical_records (id INTEGER PRIMARY KEY AUTOINCREMENT, local_id TEXT NOT NULL UNIQUE, submitted_at_local TEXT NOT NULL, received_at TEXT NOT NULL, submitter TEXT NOT NULL, application_date TEXT NOT NULL, client TEXT NOT NULL, notes TEXT NOT NULL DEFAULT \'\', products_json TEXT NOT NULL)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_chemical_records_application_date ON chemical_records(application_date)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_chemical_records_submitter ON chemical_records(submitter)'),
  ]).then(() => undefined);
  return schemaReady;
}

function text(status: number, body: string): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
