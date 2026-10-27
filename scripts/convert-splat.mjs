// Transcodes the raw 3DGS capture (.ply, ~20 MB) into a compact .spz for the
// web. First-order SH keeps some view-dependent sheen at ~1/13th the size.
// Raw captures live in splats/ (gitignored, outside public/ so never deployed).
//
//   npm run splat                       → splats/person.ply → public/splats/person.spz
//   npm run splat -- in.ply out.spz [maxSh]
import fs from "node:fs";
import path from "node:path";
import { transcodeSpz } from "@sparkjsdev/spark";

const input = process.argv[2] ?? "splats/person.ply";
const output =
  process.argv[3] ?? path.join("public/splats", path.basename(input).replace(/\.ply$/i, ".spz"));
const maxSh = Number(process.argv[4] ?? 1);

const fileBytes = new Uint8Array(fs.readFileSync(input));
const { fileBytes: spz } = await transcodeSpz({
  inputs: [{ fileBytes, pathOrUrl: path.basename(input) }],
  maxSh,
});
fs.writeFileSync(output, spz);

const mb = (n) => (n / 1024 / 1024).toFixed(2);
console.log(`${input} (${mb(fileBytes.length)} MB) → ${output} (${mb(spz.length)} MB, SH${maxSh})`);
process.exit(0);
