import Dexie from "dexie";

export const db = new Dexie("chansonnier");
db.version(1).stores({
  pages: "id,title,sortKeys,themes"
});

export async function loadPages() {
  // Charger pages.json
  const res = await fetch("/data/pages.json");
  const { version, pages } = await res.json();

  // Version locale
  const localVersion = localStorage.getItem("pages_version");

  // Si version différente → vider + recharger
  if (localVersion !== String(version)) {
    console.log("🔄 Mise à jour de Dexie (nouvelle version détectée)");

    await db.pages.clear();
    await db.pages.bulkAdd(pages);

    localStorage.setItem("pages_version", String(version));
  } else {
    console.log("✔ Dexie déjà à jour");
  }

  return db.pages.toArray();
}
