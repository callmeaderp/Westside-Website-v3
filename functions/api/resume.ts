/**
 * GET /api/resume?id=<uuid>.<ext> — Serves a resume from R2
 *
 * Example: /api/resume?id=a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf
 */

interface Env {
  RESUMES: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id') || '';

  // Basic sanity check: UUID + extension
  if (!/^[0-9a-f-]{36}\.(pdf|doc|docx)$/.test(id)) {
    return new Response('Not found', { status: 404 });
  }

  const object = await env.RESUMES.get(id);
  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  const headers = new Headers();
  headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
  if (object.httpMetadata?.contentDisposition) {
    headers.set('Content-Disposition', object.httpMetadata.contentDisposition);
  }
  headers.set('Cache-Control', 'private, max-age=3600');

  return new Response(object.body, { headers });
};
