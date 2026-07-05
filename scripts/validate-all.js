import { execSync } from "child_process";

try {
  execSync("node scripts/validate-asset-map.js", { stdio: "inherit" });
  execSync("node scripts/validate-assets.js build/asset-list.json", { stdio: "inherit" });
  console.log("✔ Validation complète OK");
} catch {
  console.error("❌ Validation échouée");
  process.exit(1);
}
