// Fails if en.json and bn.json don't have exactly the same keys.
import { readFileSync } from "node:fs";

const flat = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) =>
    typeof v === "object" ? flat(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
const load = (l) => new Set(flat(JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url)))));
const en = load("en");
const bn = load("bn");
const missingBn = [...en].filter((k) => !bn.has(k));
const missingEn = [...bn].filter((k) => !en.has(k));
if (missingBn.length || missingEn.length) {
  console.error("Missing in bn:", missingBn, "\nMissing in en:", missingEn);
  process.exit(1);
}
console.log(`messages OK (${en.size} keys in each locale)`);
