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

// Dossiers à ignorer globalement (recherche récursive)
const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  ".svelte-kit",
  "project-dumps",
  "project-chunks",
  "build"
]);

// Fichiers à ignorer globalement
const IGNORE_FILES = new Set([
  "project-full.txt",
  "project-clean.txt",
  "project-structure.txt",
  "allSongs.ts" // explicitement exclu comme demandé
]);

// Extensions à scanner pour le dump "impact chemins"
const SCAN_EXTENSIONS = new Set([".svelte", ".ts", ".js", ".html", ".css", ".json", ".md"]);

// Motifs (strings ou regex) qui indiquent qu'un fichier est potentiellement impacté par les chemins/base
const IMPACT_PATTERNS = [
  "/page/",
  "index/thematique",
  "index/alphabetique",
  "service-worker.js",
  "BASE_PATH",
  "/Chansonnier",
  "from '$app/paths'",
  'from "$app/paths"',
  "import { base }",
  "base +",
  "goto(",
  "href=",
  "href={",
  "href=\"/",
  "href='/'",
  "register('/service-worker.js')",
  "register(base +",
  "register(base + '/service-worker.js')"
].map(p => (p.startsWith("/") || p.includes("$app") || p.includes("BASE_PATH") || p.includes("Chansonnier")) ? p : p);

// ===============================
// UTIL: lecture non-binaire sûre
// ===============================
function safeReadFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (e) {
    return null;
  }
}

// ===============================
// Walk NON RÉCURSIF (déjà fourni)
// ===============================
function walk(dir) {
  const fileList = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(root, fullPath);
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch (e) {
      continue;
    }

    // On ignore les sous-dossiers (non récursif)
    if (stat.isDirectory()) continue;

    if (!IGNORE_FILES.has(file)) {
      fileList.push(relPath);
    }
  }

  return fileList;
}

// ===============================
// DUMP GLOBAL DES .TS (récursif, exclut allSongs.ts)
// ===============================
function dumpAllTS() {
  const tsFiles = [];

  function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (IGNORE_DIRS.has(entry.name)) continue;

      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".ts") && entry.name !== "allSongs.ts") {
        tsFiles.push(path.relative(root, fullPath));
      }
    }
  }

  scan(root);

  let output = "";

  for (const file of tsFiles) {
    const fullPath = path.join(root, file);
    const content = safeReadFile(fullPath);
    if (content === null) continue;

    output += `===== FILE: ${file} =====\n`;
    output += content + "\n\n";
  }

  fs.writeFileSync(path.join(outDir, "dump-ts.txt"), output, "utf8");
  console.log("✔ dump-ts.txt généré");
}

// ===============================
// DUMPS EXISTANTS (NON RÉCURSIF pour les cibles listées)
// ===============================
for (const [outputName, folders] of Object.entries(TARGETS)) {
  let output = "";

  for (const folder of folders) {
    const abs = path.join(root, folder);
    if (!fs.existsSync(abs)) continue;

    const files = walk(abs).sort();

    for (const file of files) {
      const fullPath = path.join(root, file);
      const content = safeReadFile(fullPath);
      if (content === null) continue;

      output += `===== FILE: ${file} =====\n`;
      output += content + "\n\n";
    }
  }

  fs.writeFileSync(path.join(outDir, outputName), output, "utf8");
  console.log(`✔ ${outputName} généré`);
}

// ===============================
// NOUVEAU: dump des fichiers potentiellement impactés par les chemins/base
// Recherche récursive, mais filtre par extension et motifs
// ===============================
function dumpPathImpacted() {
  const impacted = [];

  function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const name = entry.name;
      const fullPath = path.join(dir, name);
      const relPath = path.relative(root, fullPath);

      if (IGNORE_DIRS.has(name)) continue;
      if (entry.isDirectory()) {
        scan(fullPath);
        continue;
      }

      // ignore files explicitly
      if (IGNORE_FILES.has(name)) continue;

      const ext = path.extname(name).toLowerCase();
      if (!SCAN_EXTENSIONS.has(ext)) continue;

      const content = safeReadFile(fullPath);
      if (content === null) continue;

      // skip allSongs.ts explicitly even if extension matches
      if (name === "allSongs.ts") continue;

      // check patterns (case-insensitive for content)
      const lower = content.toLowerCase();
      let matched = false;
      for (const pat of IMPACT_PATTERNS) {
        if (typeof pat === "string") {
          if (lower.includes(pat.toLowerCase())) {
            matched = true;
            break;
          }
        }
      }

      // also check for literal occurrences in filenames/paths
      if (!matched) {
        const pathLower = relPath.toLowerCase();
        if (pathLower.includes("index/thematique") || pathLower.includes("index/alphabetique") || pathLower.includes("/page/")) {
          matched = true;
        }
      }

      if (matched) {
        impacted.push({ file: relPath, snippet: extractSnippet(content, IMPACT_PATTERNS) });
      }
    }
  }

  scan(root);

  // build output
  let out = "";
  for (const item of impacted.sort((a, b) => a.file.localeCompare(b.file))) {
    out += `===== FILE: ${item.file} =====\n`;
    out += item.snippet + "\n\n";
  }

  fs.writeFileSync(path.join(outDir, "dump-path-impacted.txt"), out, "utf8");
  console.log("✔ dump-path-impacted.txt généré (" + impacted.length + " fichiers)");
}

// helper: extract a small snippet around the first matching pattern
function extractSnippet(content, patterns) {
  const lower = content.toLowerCase();
  for (const pat of patterns) {
    const p = pat.toLowerCase();
    const idx = lower.indexOf(p);
    if (idx !== -1) {
      const start = Math.max(0, idx - 120);
      const end = Math.min(content.length, idx + p.length + 120);
      return content.slice(start, end).replace(/\r\n/g, "\n");
    }
  }
  // fallback: return first 400 chars
  return content.slice(0, 400).replace(/\r\n/g, "\n");
}

// ===============================
// Exécute le dump "impact chemins" (sans allSongs.ts)
// ===============================
dumpPathImpacted();

// ===============================
// LANCE LE DUMP DES .TS
// ===============================
dumpAllTS();

console.log("✔ Tous les dumps structurés ont été générés !");
