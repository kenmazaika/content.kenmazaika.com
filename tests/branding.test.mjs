import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
async function exists(file) { try { await stat(path.join(root, file)); return true; } catch { return false; } }
function pngDimensions(buffer) { assert.equal(buffer.toString('ascii', 1, 4), 'PNG'); return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }; }

test('Publish has a complete publication identity', async () => {
  const favicon = await readFile(path.join(root, 'public/favicon.svg'), 'utf8');
  const header = await readFile(path.join(root, 'src/components/Header.astro'), 'utf8');
  const constants = await readFile(path.join(root, 'src/consts.ts'), 'utf8');
  const config = await readFile(path.join(root, 'astro.config.mjs'), 'utf8');
  const og = await readFile(path.join(root, 'scripts/generate-og.mjs'), 'utf8');
  assert.match(favicon, /aria-label="P"/);
  assert.match(favicon, /#172238/);
  assert.match(header, /Publish<span class="wordmark-stop">\.<\/span>/);
  assert.match(constants, /SITE_TITLE = 'Publish'/);
  assert.match(config, /site: 'https:\/\/publish\.kenmazaika\.com'/);
  assert.match(og, /publish\.kenmazaika\.com/);
  assert.match(og, /Publish/);
  assert.doesNotMatch(og, /engineering\.kenmazaika\.com|Engineering Leadership/);
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

test('article pages expose social metadata and reading-first structure', async () => {
  const baseHead = await readFile(path.join(root, 'src/components/BaseHead.astro'), 'utf8');
  const blogPost = await readFile(path.join(root, 'src/layouts/BlogPost.astro'), 'utf8');
  assert.match(blogPost, /class="article-body"/);
  assert.doesNotMatch(blogPost, /article-rail|table-of-contents/);
  assert.match(blogPost, /class="related-posts"/);
  assert.match(blogPost, /`\/og\/\$\{slug\}\.png`/);
  assert.match(baseHead, /og:image:width/);
  assert.match(baseHead, /twitter:image/);
});

test('quiet journal CSS centers readable prose without drop caps or heading rules', async () => {
  const css = await readFile(path.join(root, 'src/styles/global.css'), 'utf8');
  assert.match(css, /--paper:\s*#f7f8fa/i);
  assert.match(css, /--reading:\s*700px/);
  assert.match(css, /\.article-body\s*\{[^}]*max-width:\s*var\(--reading\)[^}]*margin:[^;]*auto/s);
  assert.doesNotMatch(css, /first-letter/);
  assert.doesNotMatch(css, /\.prose h2\s*\{[^}]*border-top/s);
  assert.doesNotMatch(css, /\.publication-bar\s*\{/);
});

test('code blocks keep Shiki colors readable and cannot widen the mobile page', async () => {
  const css = await readFile(path.join(root, 'src/styles/global.css'), 'utf8');
  const latestPost = await readFile(path.join(root, 'dist/blog/you-dont-need-to-write-a-voice-guide-you-need-to-mine-one/index.html'), 'utf8');
  assert.match(latestPost, /class="astro-code one-light-custom"/);
  assert.match(css, /\.code-block-wrapper\s*\{[^}]*max-width:\s*100%[^}]*min-width:\s*0[^}]*overflow:\s*hidden/s);
  assert.match(css, /\.prose pre,\.code-block-wrapper pre\s*\{[^}]*width:\s*100%[^}]*max-width:\s*100%[^}]*overflow-x:\s*auto/s);
  assert.match(css, /background:\s*var\(--paper-light\)!important;color:\s*var\(--ink\)!important/);
  assert.doesNotMatch(css, /\.prose pre \{[^}]*background: var\(--night\)/s);
});
