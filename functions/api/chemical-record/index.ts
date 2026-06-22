interface Env {
  CHEMICAL_RECORDS: D1Database;
}

interface ProductEntry {
  name: string;
  quantity: number;
  unit: string;
}

interface ChemicalRecordPayload {
  localId: string;
  submittedAtLocal: string;
  submitter: string;
  applicationDate: string;
  client: string;
  notes?: string;
  products: ProductEntry[];
}

const SUBMITTERS = new Set(['Joshua', 'Nick', 'Mike', 'Brad']);
const MAX_TEXT_LENGTH = 500;
const MAX_PRODUCTS = 12;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.CHEMICAL_RECORDS) {
    return json(500, { success: false, message: 'Chemical records database is not configured.' });
  }

  let payload: ChemicalRecordPayload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { success: false, message: 'Invalid request body.' });
  }

  const validation = validatePayload(payload);
  if (!validation.ok) {
    return json(400, { success: false, message: validation.message });
  }

  await ensureSchema(env.CHEMICAL_RECORDS);

  const now = new Date().toISOString();
  const localId = clean(payload.localId);
  const existing = await env.CHEMICAL_RECORDS
    .prepare('SELECT id FROM chemical_records WHERE local_id = ?')
    .bind(localId)
    .first<{ id: number }>();

  if (existing) {
    return json(200, { success: true, duplicate: true, id: existing.id });
  }

  const result = await env.CHEMICAL_RECORDS
    .prepare(`
      INSERT INTO chemical_records (
        local_id,
        submitted_at_local,
        received_at,
        submitter,
        application_date,
        client,
        notes,
        products_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `)
    .bind(
      localId,
      clean(payload.submittedAtLocal),
      now,
      clean(payload.submitter),
      clean(payload.applicationDate),
      clean(payload.client),
      clean(payload.notes || ''),
      JSON.stringify(normalizeProducts(payload.products)),
    )
    .first<{ id: number }>();

  return json(200, { success: true, id: result?.id ?? null });
};

function validatePayload(payload: ChemicalRecordPayload): { ok: true } | { ok: false; message: string } {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, message: 'Missing record payload.' };
  }
  if (!clean(payload.localId)) {
    return { ok: false, message: 'Missing local entry id.' };
  }
  if (!SUBMITTERS.has(clean(payload.submitter))) {
    return { ok: false, message: 'Choose Joshua, Nick, Mike, or Brad as submitter.' };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(clean(payload.applicationDate))) {
    return { ok: false, message: 'Application date is required.' };
  }
  if (!clean(payload.client)) {
    return { ok: false, message: 'Client, address, or visit is required.' };
  }
  if (clean(payload.client).length > MAX_TEXT_LENGTH || clean(payload.notes || '').length > MAX_TEXT_LENGTH) {
    return { ok: false, message: 'Client and notes fields must be shorter.' };
  }
  if (!Array.isArray(payload.products) || payload.products.length === 0) {
    return { ok: false, message: 'At least one product amount is required.' };
  }
  if (payload.products.length > MAX_PRODUCTS) {
    return { ok: false, message: 'Too many products on one entry.' };
  }
  for (const product of payload.products) {
    if (!clean(product.name) || clean(product.name).length > 120) {
      return { ok: false, message: 'Each product needs a valid name.' };
    }
    if (!Number.isFinite(Number(product.quantity)) || Number(product.quantity) <= 0) {
      return { ok: false, message: 'Each product quantity must be greater than zero.' };
    }
    if (clean(product.unit).length > 40) {
      return { ok: false, message: 'Product unit is too long.' };
    }
  }
  return { ok: true };
}

function normalizeProducts(products: ProductEntry[]): ProductEntry[] {
  return products.map((product) => ({
    name: clean(product.name),
    quantity: Number(product.quantity),
    unit: clean(product.unit || 'unspecified'),
  }));
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

function clean(value: unknown): string {
  return String(value ?? '').trim();
}

function json(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });
}
