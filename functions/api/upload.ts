/**
 * POST /api/upload/ — Resume upload endpoint
 *
 * Receives the file as a raw binary body (not multipart FormData) with
 * metadata in headers. This bypasses the Pages Functions multipart parsing
 * issue where files arrive as empty strings.
 *
 * Headers:
 *   Content-Type: application/pdf (or msword, docx)
 *   X-Filename: resume.pdf
 *   X-Turnstile-Token: <token>
 */

interface Env {
  RESUMES: R2Bucket;
  TURNSTILE_SECRET: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES: Record<string, string> = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};
const MAGIC_BYTES: Record<string, number[]> = {
  'application/pdf': [0x25, 0x50, 0x44, 0x46],
  'application/msword': [0xd0, 0xcf, 0x11, 0xe0],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [0x50, 0x4b, 0x03, 0x04],
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const token = request.headers.get('X-Turnstile-Token');
  if (!token) {
    return json(400, { success: false, message: 'Missing verification token.' });
  }

  const tsRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET,
      response: token,
      remoteip: request.headers.get('CF-Connecting-IP') || '',
    }),
  });
  const tsResult = (await tsRes.json()) as { success: boolean };
  if (!tsResult.success) {
    return json(403, { success: false, message: 'Verification failed.' });
  }

  const contentType = request.headers.get('Content-Type') || '';
  const filename = request.headers.get('X-Filename') || 'resume';
  const body = await request.arrayBuffer();

  if (!body || body.byteLength === 0) {
    return json(400, { success: false, message: 'No file provided.' });
  }
  if (body.byteLength > MAX_FILE_SIZE) {
    return json(400, { success: false, message: `File too large (${(body.byteLength / 1024 / 1024).toFixed(1)} MB). Max 5 MB.` });
  }

  const ext = ALLOWED_TYPES[contentType];
  if (!ext) {
    return json(400, { success: false, message: `Invalid file type: ${contentType}. PDF, DOC, or DOCX only.` });
  }

  const bytes = new Uint8Array(body.slice(0, 4));
  const expected = MAGIC_BYTES[contentType];
  if (expected && !expected.every((b, i) => bytes[i] === b)) {
    return json(400, { success: false, message: 'File content does not match its type.' });
  }

  const id = crypto.randomUUID();
  const key = `${id}${ext}`;

  await env.RESUMES.put(key, body, {
    httpMetadata: { contentType, contentDisposition: `attachment; filename="${filename}"` },
    customMetadata: {
      originalName: filename,
      uploadedAt: new Date().toISOString(),
    },
  });

  const origin = new URL(request.url).origin;
  return json(200, { success: true, url: `${origin}/api/resume?id=${key}` });
};

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
