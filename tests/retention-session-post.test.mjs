import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

const slug = 'you-dont-have-a-retention-problem-you-have-a-session-problem';
const index = readFileSync(join(root, 'dist/index.html'), 'utf8');
assert.match(index, new RegExp(`/blog/${slug}/`));

const post = readFileSync(join(root, `dist/blog/${slug}/index.html`), 'utf8');
assert.match(post, /Retention Problem/);
assert.match(post, /Session Problem/);
assert.match(post, /session contribution/);
assert.match(post, /build series/);
assert.match(post, /class="prose"/);
assert.match(post, /newsletter-signup/);

console.log('Publish blog: retention/session post + layout verified.');
