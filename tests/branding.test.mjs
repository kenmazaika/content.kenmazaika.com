import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
async function exists(file) { try { await stat(path.join(root, file)); return true; } catch { return false; } }
function pngDimensions(buffer) { assert.equal(buffer.toString('ascii', 1, 4), 'PNG'); return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }; }

test('Content has its own publication identity', async () => {
  const favicon = await readFile(path.join(root, 'public/favicon.svg'), 'utf8');
  const header = await readFile(path.join(root, 'src/components/Header.astro'), 'utf8');
  const constants = await readFile(path.join(root, 'src/consts.ts'), 'utf8');
  assert.match(favicon, /aria-label="C"/);
  assert.match(favicon, /#172238/);
  assert.match(header, /class="wordmark"/);
  assert.match(header, /Content<span class="wordmark-stop">\.<\/span>/);
  assert.doesNotMatch(header, /site-mark-glyph">K/);
  assert.match(constants, /SITE_TITLE = 'Content'/);
  assert.equal(await exists('public/favicon.ico'), true);
  assert.equal(await exists('public/apple-touch-icon.png'), true);
});

test('every article and the site default have generated 1200x630 Open Graph cards', async () => {
  const sourceFiles = (await readdir(path.join(root, 'src/content/blog'))).filter((name) => /\.(md|mdx)$/.test(name));
  const expected = ['default.png', ...sourceFiles.map((name) => name.replace(/\.(md|mdx)$/, '.png'))];
  for (const filename of expected) {
    const image = await readFile(path.join(root, 'public/og', filename));
    assert.deepEqual(pngDimensions(image), { width: 1200, height: 630 }, filename);
  }
  const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  assert.match(packageJson.scripts.build, /generate:og/);
});

test('article pages expose social metadata and editorial structure', async () => {
  const baseHead = await readFile(path.join(root, 'src/components/BaseHead.astro'), 'utf8');
  const blogPost = await readFile(path.join(root, 'src/layouts/BlogPost.astro'), 'utf8');
  assert.match(blogPost, /class="article-body-grid"/);
  assert.match(blogPost, /class="table-of-contents"/);
  assert.match(blogPost, /class="related-posts"/);
  assert.match(blogPost, /`\/og\/\$\{slug\}\.png`/);
  assert.match(baseHead, /og:image:width/);
  assert.match(baseHead, /twitter:image/);
});
