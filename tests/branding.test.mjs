import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');

async function exists(file) {
  try {
    await stat(path.join(root, file));
    return true;
  } catch {
    return false;
  }
}

test('the production site uses the single-K identity in favicon and header assets', async () => {
  const favicon = await readFile(path.join(root, 'public/favicon.svg'), 'utf8');
  const header = await readFile(path.join(root, 'src/components/Header.astro'), 'utf8');

  assert.match(favicon, /aria-label="K"/);
  assert.doesNotMatch(favicon, /M50\.4 78\.5/);
  assert.match(header, /class="site-mark"/);
  assert.match(header, />K</);
  assert.equal(await exists('public/favicon.ico'), true);
  assert.equal(await exists('public/apple-touch-icon.png'), true);
});

test('the single-K favicon is optically centered inside its frame', async () => {
  const { data, info } = await sharp(path.join(root, 'public/apple-touch-icon.png'))
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const xs = [];
  const ys = [];

  // Restrict the scan to the center so the rust frame is excluded.
  for (let y = 25; y <= 155; y += 1) {
    for (let x = 25; x <= 155; x += 1) {
      const offset = (y * info.width + x) * info.channels;
      const [red, green, blue] = data.subarray(offset, offset + 3);
      if (red > 120 && green < 100 && blue < 80) {
        xs.push(x);
        ys.push(y);
      }
    }
  }

  assert.ok(xs.length > 0, 'expected to find the rust K');
  const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
  const centerY = (Math.min(...ys) + Math.max(...ys)) / 2;
  assert.ok(centerX >= 89 && centerX <= 90.5, `K horizontal center was ${centerX}`);
  assert.ok(centerY >= 89 && centerY <= 91.5, `K vertical center was ${centerY}`);
});

function pngDimensions(buffer) {
  assert.equal(buffer.toString('ascii', 1, 4), 'PNG');
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

test('every article and the site default have generated 1200x630 Open Graph cards', async () => {
  const sourceFiles = (await readdir(path.join(root, 'src/content/blog')))
    .filter((name) => /\.(md|mdx)$/.test(name));
  const expected = ['default.png', ...sourceFiles.map((name) => name.replace(/\.(md|mdx)$/, '.png'))];

  for (const filename of expected) {
    const image = await readFile(path.join(root, 'public/og', filename));
    assert.deepEqual(pngDimensions(image), { width: 1200, height: 630 }, filename);
  }

  const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  assert.match(packageJson.scripts.build, /generate:og/);
  assert.equal(await exists('scripts/generate-og.mjs'), true);
});

test('article pages expose generated OG cards and complete social metadata', async () => {
  const baseHead = await readFile(path.join(root, 'src/components/BaseHead.astro'), 'utf8');
  const blogPost = await readFile(path.join(root, 'src/layouts/BlogPost.astro'), 'utf8');
  const route = await readFile(path.join(root, 'src/pages/blog/[...slug].astro'), 'utf8');
  const schema = await readFile(path.join(root, 'src/content.config.ts'), 'utf8');

  assert.match(schema, /socialTitle:\s*z\.string\(\)\.optional\(\)/);
  assert.match(schema, /ogCategory:\s*z\.string\(\)\.optional\(\)/);
  assert.match(route, /slug=\{post\.id\}/);
  assert.match(blogPost, /`\/og\/\$\{slug\}\.png`/);
  assert.match(blogPost, /type="article"/);
  assert.match(baseHead, /og:image:width/);
  assert.match(baseHead, /og:image:height/);
  assert.match(baseHead, /og:image:alt/);
  assert.match(baseHead, /twitter:title/);
  assert.match(baseHead, /twitter:description/);
  assert.match(baseHead, /twitter:image/);
  assert.match(baseHead, /apple-touch-icon/);
});
