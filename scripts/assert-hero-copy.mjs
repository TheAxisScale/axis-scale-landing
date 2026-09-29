import { readFileSync } from 'node:fs';
const s = readFileSync(new URL('../src/components/Hero.astro', import.meta.url), 'utf8');
const lines = [
  'Not working on SOC 2 yet?',
  "That's fine. The prospects in your pipeline will surely wait.",
  'They won\'t. SOC 2 takes months and the question always arrives mid-deal. Start now: 30 minutes to scope, a real audit date on the calendar, a clear roadmap. When they ask, you have an answer instead of an apology.',
];
// Accept either straight or curly apostrophe in "That's"
const norm = s.replace(/'/g, "'");
const missing = lines.filter((l) => !norm.includes(l.replace(/'/g, "'")));
if (missing.length) { console.error('Hero copy changed / missing:', missing); process.exit(1); }
console.log('Hero copy OK');
