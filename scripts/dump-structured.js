// scripts/dump-structured.js
import fs from "fs";
import path from "path";

const root = process.cwd();
const outDir = path.join(root, "project-dumps");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

// Dossiers à dumper (NON RÉCURSIF)
const TARGETS = {
  "dump-root.txt": ["."],
  "dump-src.txt": ["src"],
  "dump-routes.txt": ["src/routes"],
  "dump-lib.txt": ["src/lib"],
  "dump-content.txt": ["src/content"],
  "dump-static.txt": ["static"],
  "dump-scripts.txt": ["scripts"]
};

// Dossiers à ignorer globalement
const IGNORE_DIRS = [
  "node_modules",
  ".git",
  ".svelte-kit",
  "project-dumps",
  "project-chunks",
  "build"
];

// Fichiers à ignorer
const IGNORE_FILES = [
  "project-full.txt",
  "project-clean.txt",
  "project-structure.txt"
];

// 🔥 Nouvelle version : walk NON RÉCURSIF
function walk(dir) {
  const fileList = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(root, fullPath);
    const stat = fs.statSync(fullPath);

    // On ignore les sous-dossiers
    if (stat.isDirectory()) continue;

    if (!IGNORE_FILES.includes(file)) {
      fileList.push(relPath);
    }
  }

  return fileList;
}

// ===============================
// 🔥 AJOUT : DUMP GLOBAL DES .TS
// ===============================
function dumpAllTS() {
  const tsFiles = [];

  function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (IGNORE_DIRS.includes(entry.name)) continue;

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".ts")) {
        tsFiles.push(path.relative(root, fullPath));
      }
    }
  }

  scan(root);

  let output = "";

  for (const file of tsFiles) {
    const fullPath = path.join(root, file);
    const content = fs.readFileSync(fullPath, "utf8");

    output += `===== FILE: ${file} =====\n`;
    output += content + "\n\n";
  }

  fs.writeFileSync(path.join(outDir, "dump-ts.txt"), output, "utf8");
  console.log("✔ dump-ts.txt généré");
}

// ===============================
// DUMPS EXISTANTS
// ===============================
for (const [outputName, folders] of Object.entries(TARGETS)) {
  let output = "";

  for (const folder of folders) {
    const abs = path.join(root, folder);
    if (!fs.existsSync(abs)) continue;

    const files = walk(abs).sort();

    for (const file of files) {
      const fullPath = path.join(root, file);
      const content = fs.readFileSync(fullPath, "utf8");

      output += `===== FILE: ${file} =====\n`;
      output += content + "\n\n";
    }
  }

  fs.writeFileSync(path.join(outDir, outputName), output, "utf8");
  console.log(`✔ ${outputName} généré`);
}

// ===============================
// LANCE LE DUMP DES .TS
// ===============================
dumpAllTS();

console.log("✔ Tous les dumps structurés ont été générés !");
