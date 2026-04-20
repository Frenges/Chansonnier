// scripts/split-file.js
import fs from "fs";
import path from "path";

const root = process.cwd();
const inputFile = path.join(root, "project-full.txt");
const outDir = path.join(root, "project-chunks");

// Taille max par chunk (200 Ko)
const CHUNK_SIZE = 200 * 1024;

// Crée le dossier si nécessaire
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

// Lit le fichier complet
const data = fs.readFileSync(inputFile, "utf8");

// Découpe en morceaux
let index = 1;
for (let i = 0; i < data.length; i += CHUNK_SIZE) {
  const chunk = data.slice(i, i + CHUNK_SIZE);
  const filename = path.join(
    outDir,
    `chunk-${String(index).padStart(3, "0")}.txt`
  );
  fs.writeFileSync(filename, chunk, "utf8");
  index++;
}

console.log("✔ Découpage terminé !");
console.log(`✔ ${index - 1} fichiers générés dans project-chunks/`);
