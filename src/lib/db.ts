import Dexie from "dexie";

export const db = new Dexie("songbook");

db.version(1).stores({
  pages: "id,title,sortKeys,themes"
});
