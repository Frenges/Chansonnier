// src/lib/db.ts
import Dexie from "dexie";
import { base } from "$app/paths";

export const db = new Dexie("songbook");
db.version(1).stores({
  pages: "id,title,sortKeys,themes,body,html"
});

// Charge pages.json depuis le cache ou le réseau
async function fetchPagesJson() {
  const url = `${base}/data/pages.json`;
  const res = await fetch(url);
  return res.json();
}

// Remplit Dexie si nécessaire
export async function ensureDexieIsPopulated() {
  const count = await db.pages.count();

  // Si Dexie contient déjà des données → ne rien faire
  if (count > 0) {
    console.log("Dexie: déjà rempli, aucune action nécessaire");
    return;
  }

  console.log("Dexie: vide → remplissage automatique…");

  // Charge toutes les chansons depuis pages.json
  const json = await fetchPagesJson();

  // Insère toutes les chansons dans Dexie
  await db.pages.bulkPut(json.pages);

  console.log("Dexie: toutes les chansons ont été importées");
}

// Fonction utilisée par +layout.ts pour charger les pages
export async function loadPages() {
  // S'assure que Dexie contient tout
  await ensureDexieIsPopulated();

  // Retourne les pages depuis Dexie
  return db.pages.toArray();
}
