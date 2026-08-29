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
assert.doesNotMatch(index, /class="publication-note"/);
assert.match(index, /Publish<span class="wordmark-stop">\.<\/span>/);

const archive = readFileSync(join(root, 'dist/blog/index.html'), 'utf8');
assert.match(archive, /You Don’t Have a Writing Problem/);
assert.match(archive, /you-dont-have-a-writing-problem-you-have-an-approval-problem/);
assert.match(archive, /editorial-index/);
assert.match(archive, /<span class="index-date"><time datetime="[^"]+">[^<]+<\/time><\/span><a href="\/blog\//);
assert.doesNotMatch(archive, /class="index-read"/);
assert.doesNotMatch(archive, /<p class="story-label">/);

const about = readFileSync(join(root, 'dist/about/index.html'), 'utf8');
assert.match(about, /where I study how ideas travel/);
assert.match(about, /class="about-grid"/);

console.log('Publish publication: homepage, archive, article system, and about page verified.');
