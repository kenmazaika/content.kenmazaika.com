import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'pipe' });

const index = readFileSync(join(root, 'dist/index.html'), 'utf8');
assert.match(index, /\/blog\/you-dont-have-a-writing-problem-you-have-an-approval-problem\//);

const post = readFileSync(join(root, 'dist/blog/you-dont-have-a-writing-problem-you-have-an-approval-problem/index.html'), 'utf8');
assert.match(post, /You Don’t Have a Writing Problem\. You Have an Approval Problem\./);
assert.match(post, /The bottleneck moved to review/);
assert.match(post, /The Voice Guide/);
assert.match(post, /The Human Sign-off Gate/);
assert.match(post, /class="prose"/);
assert.match(post, /newsletter-signup/);

console.log('Publish blog: approval-problem post + layout verified.');
