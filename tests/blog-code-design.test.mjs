import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

const index = readFileSync(join(root, 'dist/index.html'), 'utf8');
assert.match(index, /How ideas get made/);
assert.match(index, /class="publication-header"/);
assert.match(index, /class="lead-story"/);
assert.match(index, /class="publication-note"/);
assert.match(index, /Content<span class="wordmark-stop">\.<\/span>/);

const archive = readFileSync(join(root, 'dist/blog/index.html'), 'utf8');
assert.match(archive, /You Don’t Have a Writing Problem/);
assert.match(archive, /you-dont-have-a-writing-problem-you-have-an-approval-problem/);
assert.match(archive, /editorial-index/);

const about = readFileSync(join(root, 'dist/about/index.html'), 'utf8');
assert.match(about, /where I study how ideas travel/);
assert.match(about, /class="about-grid"/);

console.log('Content publication: homepage, archive, article system, and about page verified.');
