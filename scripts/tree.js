import fs from "node:fs";
import path from "node:path";

function tree(dir, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // Trier : dossiers d'abord, fichiers ensuite
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;

    const isLast = entry === entries[entries.length - 1];
    const connector = isLast ? "└── " : "├── ";

    console.log(prefix + connector + entry.name);

    if (entry.isDirectory()) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      tree(path.join(dir, entry.name), newPrefix);
    }
  }
}

console.log("Arborescence du projet :\n");
tree(process.cwd());
