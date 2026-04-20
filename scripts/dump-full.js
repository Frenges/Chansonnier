// scripts/dump-full.js
import fs from "fs";
import path from "path";

const root = process.cwd();
const outputFile = path.join(root, "project-full.txt");

// Dossiers à ignorer
const IGNORE = ["node_modules", ".git", "build"];

// Fonction récursive pour parcourir les dossiers
function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(root, fullPath);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!IGNORE.some((ignored) => relPath.startsWith(ignored))) {
        walk(fullPath, fileList);
      }
    } else {
      fileList.push(relPath);
    }
  }

  return fileList;
}

// Récupération de tous les fichiers
const allFiles = walk(root).sort();

// Construction du contenu final
let output = "";

for (const file of allFiles) {
  const fullPath = path.join(root, file);
  const content = fs.readFileSync(fullPath, "utf8");

  output += `===== FILE: ${file} =====\n`;
  output += content + "\n\n";
}

// Écriture du fichier final
fs.writeFileSync(outputFile, output, "utf8");

console.log("✔ project-full.txt généré !");
