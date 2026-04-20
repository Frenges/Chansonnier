// scripts/generate-allSongs.js

import fs from "fs";
import path from "path";

const root = process.cwd();

// Emplacement du JSON source
const jsonPath = path.join(root, "static", "data", "pages.json");

// Emplacement du fichier généré
const outDir = path.join(root, "src", "lib", "data");
const outFile = path.join(outDir, "allSongs.ts");

// Lecture du JSON
const raw = fs.readFileSync(jsonPath, "utf8");
const data = JSON.parse(raw);

// Création du dossier si nécessaire
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Génération du fichier TS
const content =
  `// AUTO-GENERATED FILE — DO NOT EDIT\n` +
  `// Generated from static/data/pages.json\n\n` +
  `export const allSongs = ${JSON.stringify(data.pages, null, 2)} as const;\n`;

fs.writeFileSync(outFile, content, "utf8");

console.log("✔ allSongs.ts généré avec succès !");
