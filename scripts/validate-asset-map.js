import fs from "fs";
import path from "path";

const root = process.cwd();
const mapPath = path.join(root, "build/asset-map.json");
const buildDir = path.join(root, "build");

if (!fs.existsSync(mapPath)) {
  console.error("❌ asset-map.json introuvable :", mapPath);
  process.exit(1);
}

const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));

let missing = [];

for (const [route, assets] of Object.entries(map)) {
  for (const asset of assets) {
    const filePath = path.join(buildDir, asset.replace(/^\//, ""));
    if (!fs.existsSync(filePath)) {
      missing.push({ route, asset, filePath });
    }
  }
}

if (missing.length > 0) {
  console.error("❌ Assets manquants :", missing.slice(0, 20));
  process.exit(2);
}

console.log("✔ Tous les assets de la MAP existent.");
