import {mkdirSync, existsSync} from 'node:fs';
import {dirname, resolve, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const require = createRequire(import.meta.url);
const cliPackage = require.resolve('@remotion/cli/package.json');
const cli = join(dirname(cliPackage), require(cliPackage).bin.remotion);
const out = resolve(root, 'out');
mkdirSync(out, {recursive: true});
const silent = join(out, 'Replica-QC-pure-remotion-silent.mp4');
const output = join(out, 'Replica-QC-pure-remotion.mp4');
const windowsChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = process.env.BROWSER_EXECUTABLE || (process.platform === 'win32' && existsSync(windowsChrome) ? windowsChrome : null);
function run(file, args) {
  const r = spawnSync(file, args, {cwd: root, stdio: 'inherit', windowsHide: true, shell: false});
  if (r.error) throw r.error;
  if (r.status !== 0) throw new Error(`${file} exited with ${r.status}`);
}
// Launch the installed CLI with Node: no cmd/npx quoting dependency, even for paths with spaces.
run(process.execPath, [cli, 'render', 'src/index.ts', 'Replica', silent, '--codec=h264', '--crf=18', '--pixel-format=yuv420p', '--muted', '--concurrency=4', ...(browser ? ['--browser-executable', browser] : [])]);
// Keep the complete original audio tail. Do not use -shortest or re-encode the audio.
run(process.env.FFMPEG || 'ffmpeg', ['-y','-i',silent,'-i',join(root,'public/reference-audio.m4a'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','copy','-movflags','+faststart',output]);
run(process.execPath, [join(root, 'scripts/verify-output.mjs')]);
console.log(`Rendered and verified: ${output}`);
