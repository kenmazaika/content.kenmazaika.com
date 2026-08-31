import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

const slug = 'your-view-count-just-became-an-impression-count';
const index = readFileSync(join(root, 'dist/index.html'), 'utf8');
assert.match(index, new RegExp(`/blog/${slug}/`));

const post = readFileSync(join(root, `dist/blog/${slug}/index.html`), 'utf8');
assert.match(post, /View Count Just Became an Impression Count/);
assert.match(post, /Engaged Watch Hours/);
assert.match(post, /Analytics &gt; Advanced Mode/);
assert.match(post, /packaging diagnostic/);
assert.match(post, /class="prose"/);
assert.match(post, /newsletter-signup/);

console.log('Publish blog: view-count/impression post + layout verified.');
