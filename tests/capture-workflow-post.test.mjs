import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

// RSS feed includes the post (title/desc are XML-escaped — match on the slug).
const rss = readFileSync(join(root, 'dist/rss.xml'), 'utf8');
assert.match(rss, /you-dont-have-a-writing-problem-you-have-an-approval-problem/);
assert.match(rss, /You Don’t Have a Writing Problem/);

// Sitemap index + page exist and carry the post.
const sitemapDir = join(root, 'dist');
const sitemapFiles = readdirSync(sitemapDir).filter((n) => n.startsWith('sitemap-') && n.endsWith('.xml'));
assert.ok(sitemapFiles.length >= 1, 'expected a sitemap part file');
let found = false;
for (const f of sitemapFiles) {
  const xml = readFileSync(join(sitemapDir, f), 'utf8');
  if (xml.includes('you-dont-have-a-writing-problem-you-have-an-approval-problem')) found = true;
}
assert.equal(found, true, 'sitemap should contain the post slug');

// The site base URL is the Publish domain.
const astroConfig = readFileSync(join(root, 'astro.config.mjs'), 'utf8');
assert.match(astroConfig, /publish\.kenmazaika\.com/);

console.log('Publish blog: RSS feed + sitemap + site URL verified.');
