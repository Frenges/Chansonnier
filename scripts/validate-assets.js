import fs from "fs";

const file = process.argv[2] || "build/asset-list.json";
const base = process.env.VALIDATE_BASE || "http://localhost:5173";

if (!fs.existsSync(file)) {
  console.error("asset-list not found:", file);
  process.exit(2);
}
const json = JSON.parse(fs.readFileSync(file, "utf8"));
const assets = json.assets || [];

async function head(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch (e) {
    return false;
  }
}

(async () => {
  const failures = [];
  for (const a of assets) {
    const url = a.startsWith("/") ? `${base}${a}` : `${base}/${a}`;
    const ok = await head(url);
    process.stdout.write(ok ? "." : "F");
    if (!ok) failures.push({ asset: a, url });
  }
  console.log();
  if (failures.length) {
    console.error("Missing assets (first 20):", failures.slice(0,20));
    process.exit(3);
  }
  console.log("All assets validated");
})();
