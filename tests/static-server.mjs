/**
 * Foreground static server for the Playwright suite.
 *
 * `astro preview` in Astro 7 daemonizes itself, so Playwright's `webServer`
 * sees the launcher exit immediately and aborts the run. This serves `dist/`
 * in the foreground and mirrors the two Cloudflare Pages behaviours the tests
 * depend on: `trailingSlash: 'always'` directory resolution, and the
 * `dist/404.html` fallback.
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve('dist');
const PORT = Number(process.env.PORT ?? process.argv[2] ?? 4331);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
};

function resolveFile(pathname) {
  // normalize() collapses any "../" before the path is joined to ROOT.
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const target = join(ROOT, clean);
  if (!target.startsWith(ROOT)) return null;

  if (existsSync(target) && statSync(target).isFile()) return target;
  const indexed = join(target, 'index.html');
  if (existsSync(indexed)) return indexed;
  return null;
}

createServer((req, res) => {
  const pathname = new URL(req.url, `http://localhost:${PORT}`).pathname;
  const file = resolveFile(pathname);

  if (!file) {
    const notFound = join(ROOT, '404.html');
    res.writeHead(404, { 'Content-Type': MIME['.html'] });
    if (existsSync(notFound)) return createReadStream(notFound).pipe(res);
    return res.end('Not found');
  }

  res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(`Static preview of dist/ on http://localhost:${PORT}`);
});
