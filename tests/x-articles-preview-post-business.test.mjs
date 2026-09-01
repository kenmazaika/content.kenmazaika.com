import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

const slug = 'x-articles-are-a-preview-post-business';
const index = readFileSync(join(root, 'dist/index.html'), 'utf8');
assert.match(index, new RegExp(`/blog/${slug}/`));

const post = readFileSync(join(root, `dist/blog/${slug}/index.html`), 'utf8');
assert.match(post, /X Articles Are a Preview Post Business/);
assert.match(post, /preview post/);
assert.match(post, /1920/);
assert.match(post, /0\.015/);
assert.match(post, /48 hours/);
assert.match(post, /class="prose"/);
assert.match(post, /newsletter-signup/);

console.log('Publish blog: x-articles preview-post post + layout verified.');
