// scripts/dump-clean.js
import fs from "fs";
import path from "path";

const root = process.cwd();
const outputFile = path.join(root, "project-clean.txt");

// Dossiers à ignorer
const IGNORE_DIRS = [
  "node_modules",
  "build",
  ".git",
  "project-chunks"
];

// Fichiers à ignorer
const IGNORE_FILES = [
  "project-full.txt",
  "project-clean.txt"
];

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(root, fullPath);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.some((ignored) => relPath.startsWith(ignored))) {
        walk(fullPath, fileList);
      }
    } else {
      if (!IGNORE_FILES.includes(file)) {
        fileList.push(relPath);
      }
    }
  }

  return fileList;
}

const allFiles = walk(root).sort();

let output = "";

for (const file of allFiles) {
  const fullPath = path.join(root, file);
  const content = fs.readFileSync(fullPath, "utf8");

  output += `===== FILE: ${file} =====\n`;
  output += content + "\n\n";
}

fs.writeFileSync(outputFile, output, "utf8");

console.log("✔ project-clean.txt généré !");
