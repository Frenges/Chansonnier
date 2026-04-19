// src/lib/db.ts
import Dexie from "dexie";
import { base } from "$app/paths";

export const db = new Dexie("songbook");
db.version(1).stores({
  pages: "id,title,sortKeys,themes,body,html"
});

export async function loadPages() {
  const url = `${base}/data/pages.json`;
  const res = await fetch(url);
  const json = await res.json();
  return json.pages;
}
