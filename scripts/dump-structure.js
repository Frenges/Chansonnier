// scripts/dump-structure.js
import fs from "fs";
import path from "path";

const root = process.cwd();
const outputFile = path.join(root, "project-structure.txt");

// Dossiers à ignorer (modifiable)
const IGNORE = ["node_modules", ".git"];

// Fonction récursive
function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(root, fullPath);
    const stat = fs.statSync(fullPath);

    // Ignore certains dossiers
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

// Exécution
const allFiles = walk(root).sort();

// Écriture du fichier
fs.writeFileSync(
  outputFile,
  allFiles.join("\n"),
  "utf8"
);

console.log("✔ project-structure.txt généré !");
