import fs from "fs";
import path from "path";

const root = process.cwd();
const immutableDir = path.join(root, "build/_app/immutable");
const outputFile = path.join(root, "build/asset-list.json");

// 1) Vérifier que le dossier existe
if (!fs.existsSync(immutableDir)) {
  console.warn("⚠️  Dossier build/_app/immutable introuvable. Avez-vous exécuté `npm run build` ?");
  fs.writeFileSync(outputFile, JSON.stringify({ assets: [] }, null, 2));
  process.exit(0);
}

// 2) Fonction de scan
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

// 3) Génération de la liste
const assets = walk(immutableDir);

// 4) Écriture du fichier final
fs.writeFileSync(outputFile, JSON.stringify({ assets }, null, 2));

console.log("✔ asset-list.json généré !");
