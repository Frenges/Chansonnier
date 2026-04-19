// src/lib/db.ts
import Dexie from "dexie";
import { base } from "$app/paths";

export const db = new Dexie("songbook");
db.version(1).stores({
  pages: "id,title,sortKeys,themes,body,html"
});

// Fonction pour charger les pages depuis pages.json
export async function loadPages() {
  const url = `${base}/data/pages.json`;

  // DEBUG : pour comprendre ce qui se passe sur GitHub
  console.log("=== DEBUG FETCH URL ===", url);

  const res = await fetch(url);

  // DEBUG : on lit le texte brut AVANT JSON.parse
  const text = await res.text();
  console.log("=== DEBUG RAW RESPONSE (first 200 chars) ===");
  console.log(text.slice(0, 200));

  // Si ce n'est pas du JSON, on le saura immédiatement
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    console.error("=== JSON PARSE ERROR ===", e);
    throw e;
  }

  return json.pages;
}
