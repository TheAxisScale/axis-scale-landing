import { readFileSync } from 'node:fs';
const s = readFileSync(new URL('../src/components/ProductLoop.astro', import.meta.url), 'utf8');
const need = ['muted', 'autoplay', 'loop', 'playsinline', 'preload="none"', 'video/webm', 'video/mp4', 'aria-label'];
const missing = need.filter((t) => !s.includes(t));
if (missing.length) { console.error('ProductLoop missing:', missing); process.exit(1); }
console.log('ProductLoop OK');
