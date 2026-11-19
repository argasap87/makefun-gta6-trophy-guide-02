// TROPHY RADIO — the hand-in program for the gta6-trophy-guide-02 entry.
// Node 22, standard library only. It copies this repository's app/ and
// screenshots/ into the output directory and writes dossier.json there, the
// summary the judge reads (screenshots, first-load files and bytes, source),
// built with the vendored make.fun library. vendor/makefun-frontend.ts is the
// kit's copy and must stay untouched: the scorer rebuilds the dossier with its
// own copy and requires the two to match byte for byte.
//
// Run it outside the grader's container with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Inside the grader, MAKEFUN_OUTPUT_DIR is unset and /output is used.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's caps: only text_max_bytes shapes the bytes. The other limits
// refuse an entry the scorer would refuse anyway (more than 4 screenshots or
// one over 256 KiB; more than 993 files and directories in app/, or app/
// over 48 MiB — app/ shares /output's own 1000-entry cap with screenshots/
// and dossier.json, so leave it room).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
