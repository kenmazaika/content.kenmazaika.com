import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Optional search-engine title (defaults to title). Lets the visible
			// H1 stay narrative while the <title> targets a search query.
			seoTitle: z.string().optional(),
			// Suppress indexing entirely (used for hidden test pages).
			noindex: z.boolean().optional(),
			// Related posts shown in the article footer (title + path).
			related: z
				.array(
					z.object({
						title: z.string(),
						url: z.string(),
					}),
				)
				.optional(),
			socialTitle: z.string().optional(),
			ogCategory: z.string().optional(),
			// Optional FAQ (question/answer pairs). When present, rendered as
			// FAQPage JSON-LD structured data for rich results + AEO.
			faq: z
				.array(
					z.object({
						question: z.string(),
						answer: z.string(),
					}),
				)
				.optional(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			hideDefaultNewsletter: z.boolean().optional(),
			// Hidden posts exist at their direct URL but are excluded from the
			// index, RSS feed, and sitemap (used for staged launches).
			hidden: z.boolean().optional(),
		}),
});

export const collections = { blog };
