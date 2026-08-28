import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

const expectedAction = 'https://buttondown.com/api/emails/embed-subscribe/mazaika';
const pages = [
  join(root, 'dist/index.html'),
  join(root, 'dist/blog/you-dont-have-a-writing-problem-you-have-an-approval-problem/index.html'),
];

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  assert.match(html, new RegExp(`<form[^>]+action="${expectedAction}"`), `${page} should include the Buttondown form`);
  assert.match(html, /<input[^>]+type="email"[^>]+name="email"/, `${page} should collect a valid email field`);
  assert.match(html, /<input[^>]+type="hidden"[^>]+name="embed"[^>]+value="1"/, `${page} should use Buttondown's embedded flow`);
}

console.log('Newsletter signup is present on the homepage and article pages.');
