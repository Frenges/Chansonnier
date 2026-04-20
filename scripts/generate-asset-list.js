import fs from "fs";
import path from "path";

const root = process.cwd();
const immutableDir = path.join(root, "build/_app/immutable");
const outputFile = path.join(root, "build/asset-list.json");

function walk(dir, base = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = path.join(base, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(walk(full, rel));
    } else {
      files.push(`/_app/immutable/${rel.replace(/\\/g, "/")}`);
    }
  }

  return files;
}

const assets = walk(immutableDir);

fs.writeFileSync(outputFile, JSON.stringify({ assets }, null, 2));

console.log("✔ asset-list.json généré !");
