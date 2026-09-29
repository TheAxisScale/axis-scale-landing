import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const scriptDir = dirname(fileURLToPath(import.meta.url));
const dir = `${scriptDir}/../public/media/`;

mkdirSync(dir, { recursive: true });

const frames = {
  hero: 'Dashboard',
  register: 'Risk Register',
  assessment: '7-step Assessment',
  workplan: 'Workplan',
  echo: 'Echo',
};

for (const [name, label] of Object.entries(frames)) {
  const html = `<!doctype html><meta charset=utf8><style>
    html,body{margin:0;width:1200px;height:750px}
    body{background:#131211;display:flex;align-items:center;justify-content:center;
    font-family:system-ui;color:#8A857E}
    .p{border:1px solid #262421;border-radius:3px;background:#080807;width:88%;height:82%;
    display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:700}
    .p b{color:#E91E8C;margin-left:10px}</style>
    <div class=p>${label}<b>&#9632;</b></div>`;
  const tmp = `${dir}${name}.html`;
  const jpg = `${dir}${name}.jpg`;
  writeFileSync(tmp, html);
  try {
    execSync(`"${CHROME}" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,750 --default-background-color=131211ff --screenshot="${jpg}" "file://${tmp}"`, { stdio: 'pipe' });
  } catch (e) {
    // Chrome may fail but still create the screenshot
  }
  rmSync(tmp);
}

console.log('posters generated');
