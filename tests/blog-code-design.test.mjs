import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

// Homepage carries the content-blog hero and links to the archive.
const index = readFileSync(join(root, 'dist/index.html'), 'utf8');
assert.match(index, /Scaling content production without losing your voice\./);
assert.match(index, /class="hero"/);
assert.match(index, /href="\/blog"/);

// Archive lists the post (title is HTML-escaped for the apostrophe).
const archive = readFileSync(join(root, 'dist/blog/index.html'), 'utf8');
assert.match(archive, /You Don&#39;t Have a Writing Problem/);
assert.match(archive, /you-dont-have-a-writing-problem-you-have-an-approval-problem/);
assert.match(archive, /post-list/);

// About page reflects the content-blog positioning.
const about = readFileSync(join(root, 'dist/about/index.html'), 'utf8');
assert.match(about, /consistent, opinionated content/);

console.log('Content blog: homepage, archive, and about pages verified.');
