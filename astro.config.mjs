// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { HIDDEN_SLUGS } from './src/consts';
import fs from 'node:fs';
import path from 'node:path';

const oneLightTheme = JSON.parse(
  fs.readFileSync(path.resolve('./src/styles/one-light-custom.json'), 'utf-8')
);

// Build a slug -> lastmod map from blog frontmatter so the sitemap can carry
// accurate per-page <lastmod> (updatedDate when present, else pubDate).
function buildLastmodMap() {
  const dir = path.resolve('./src/content/blog');
  const map = {};
  for (const file of fs.readdirSync(dir)) {
    if (!/\.(md|mdx)$/.test(file)) continue;
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) continue;
    const slug = file.replace(/\.(md|mdx)$/, '');
    const dateMatch = fm[1].match(/^(?:updatedDate|pubDate):\s*['"]?([^'"\n]+)/m);
    if (dateMatch) {
      const parsed = new Date(dateMatch[1]);
      if (!Number.isNaN(parsed.valueOf())) map[slug] = parsed;
    }
  }
  return map;
}

const lastmodBySlug = buildLastmodMap();

// https://astro.build/config
export default defineConfig({
	site: 'https://content.kenmazaika.com',
	integrations: [
		mdx(),
		sitemap({
			filter: (page) => !HIDDEN_SLUGS.some((slug) => page.includes(`/blog/${slug}/`)),
			serialize: (item) => {
				const match = item.url.match(/\/blog\/([^/]+)\/$/);
				if (match) {
					const lastmod = lastmodBySlug[match[1]];
					if (lastmod) item.lastmod = lastmod;
				}
				return item;
			},
		}),
	],
	markdown: {
		shikiConfig: {
			theme: oneLightTheme,
		},
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
