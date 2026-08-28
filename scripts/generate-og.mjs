import { readFile, readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'src/content/blog');
const outputDir = path.join(root, 'public/og');
const fontDir = path.join(root, 'node_modules/@fontsource');

const colors = {
  background: '#FAF8F5',
  text: '#1A1814',
  muted: '#6B6760',
  border: '#E8E3DB',
  faint: '#D8D1C7',
  accent: '#C2410C',
};

function parseFrontmatter(source) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) throw new Error('Missing frontmatter');
  const data = {};
  for (const line of match[1].split('\n')) {
    const field = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (!field) continue;
    let value = field[2].trim();
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }
    data[field[1]] = value;
  }
  return data;
}

function element(type, props = {}, ...children) {
  const style = type === 'div' ? { display: 'flex', ...(props.style || {}) } : props.style;
  return { type, props: { ...props, ...(style ? { style } : {}), children: children.flat() } };
}

function motif(active = 0) {
  const points = [[48, 52], [176, 52], [176, 132], [48, 132]];
  const segments = [[0, 1], [1, 2], [2, 3], [3, 0]];
  const lines = segments.map(([from, to], index) =>
    `<line x1="${points[from][0]}" y1="${points[from][1]}" x2="${points[to][0]}" y2="${points[to][1]}" stroke="${index === active ? colors.accent : colors.faint}" stroke-width="3"/>`
  ).join('');
  const nodes = points.map(([cx, cy], index) => index === active
    ? `<circle cx="${cx}" cy="${cy}" r="12" fill="${colors.accent}"/><circle cx="${cx}" cy="${cy}" r="4" fill="${colors.background}"/>`
    : `<circle cx="${cx}" cy="${cy}" r="10" fill="${colors.background}" stroke="${colors.muted}" stroke-width="2"/>`
  ).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="224" height="184" viewBox="0 0 224 184">
    <rect x="1" y="1" width="222" height="182" rx="18" fill="none" stroke="${colors.border}" stroke-width="2"/>
    ${lines}${nodes}
    <circle cx="112" cy="97" r="13" fill="${colors.text}"/><circle cx="112" cy="97" r="4" fill="${colors.background}"/>
    <path d="M106 46l10 6-10 6M182 88l-6 10-6-10M118 126l-10 6 10 6M42 96l6-10 6 10" fill="none" stroke="${colors.faint}" stroke-width="3"/>
  </svg>`;
  return element('img', {
    src: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
    width: 224,
    height: 184,
  });
}

function cardTree({ title, category, active }) {
  const size = title.length <= 48 ? 70 : title.length <= 60 ? 63 : 57;
  return element('div', {
    style: {
      width: '1200px', height: '630px', display: 'flex', position: 'relative',
      backgroundColor: colors.background, color: colors.text, borderLeft: `14px solid ${colors.accent}`,
      fontFamily: 'Inter',
    },
  },
    element('div', { style: { position: 'absolute', left: '62px', top: '76px', width: '1048px', height: '2px', backgroundColor: colors.border } }),
    element('div', { style: { position: 'absolute', left: '62px', top: '75px', width: '100px', height: '4px', backgroundColor: colors.accent } }),
    element('div', { style: {
      position: 'absolute', left: '62px', top: '101px', color: colors.accent,
      fontSize: '18px', fontWeight: 600, letterSpacing: '1.6px', textTransform: 'uppercase',
    } }, category),
    element('div', { style: {
      position: 'absolute', right: '76px', top: '101px', color: colors.accent,
      fontFamily: 'Newsreader', fontSize: '34px', fontWeight: 700,
    } }, 'K'),
    element('div', { style: {
      position: 'absolute', left: '62px', top: '158px', width: '760px', height: '300px',
      fontFamily: 'Newsreader', fontSize: `${size}px`, lineHeight: 1.08, fontWeight: 600,
      letterSpacing: '-1.1px', display: 'flex', alignItems: 'flex-start',
    } }, title),
    element('div', { style: { position: 'absolute', left: '62px', top: '455px', width: '58px', height: '5px', backgroundColor: colors.accent } }),
    element('div', { style: { position: 'absolute', right: '76px', top: '187px', width: '224px', height: '184px', display: 'flex' } }, motif(active)),
    element('div', { style: { position: 'absolute', left: '62px', top: '531px', width: '1048px', height: '2px', backgroundColor: colors.border } }),
    element('div', { style: {
      position: 'absolute', left: '62px', top: '555px', fontSize: '20px', fontWeight: 600,
      letterSpacing: '1.2px',
    } }, 'KEN MAZAIKA'),
    element('div', { style: {
      position: 'absolute', right: '76px', top: '556px', fontSize: '19px', fontWeight: 400,
      color: colors.muted,
    } }, 'engineering.kenmazaika.com'),
  );
}

function hashActive(value) {
  return [...value].reduce((sum, char) => sum + char.codePointAt(0), 0) % 4;
}

async function renderCard(data, filename, fonts) {
  const title = data.socialTitle || data.title;
  const category = data.ogCategory || 'FIELD NOTE · ENGINEERING LEADERSHIP';
  const tree = cardTree({ title, category, active: hashActive(filename) });
  const svg = await satori(tree, {
    width: 1200,
    height: 630,
    fonts,
  });
  await sharp(Buffer.from(svg)).png().toFile(path.join(outputDir, filename));
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const [newsreader600, newsreader700, inter400, inter600] = await Promise.all([
    readFile(path.join(fontDir, 'newsreader/files/newsreader-latin-600-normal.woff')),
    readFile(path.join(fontDir, 'newsreader/files/newsreader-latin-700-normal.woff')),
    readFile(path.join(fontDir, 'inter/files/inter-latin-400-normal.woff')),
    readFile(path.join(fontDir, 'inter/files/inter-latin-600-normal.woff')),
  ]);
  const fonts = [
    { name: 'Newsreader', data: newsreader600, weight: 600, style: 'normal' },
    { name: 'Newsreader', data: newsreader700, weight: 700, style: 'normal' },
    { name: 'Inter', data: inter400, weight: 400, style: 'normal' },
    { name: 'Inter', data: inter600, weight: 600, style: 'normal' },
  ];

  const entries = (await readdir(contentDir)).filter((name) => /\.(md|mdx)$/.test(name));
  await renderCard({
    title: 'Engineering Leadership in the Agent Era',
    ogCategory: 'KEN MAZAIKA · FIELD NOTES & SYSTEMS',
  }, 'default.png', fonts);

  for (const entry of entries) {
    const source = await readFile(path.join(contentDir, entry), 'utf8');
    const data = parseFrontmatter(source);
    if (!data.title) throw new Error(`${entry} is missing a title`);
    const filename = entry.replace(/\.(md|mdx)$/, '.png');
    await renderCard(data, filename, fonts);
    console.log(`Generated public/og/${filename}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
