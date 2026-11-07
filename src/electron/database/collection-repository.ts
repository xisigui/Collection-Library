import type sqlite3 from "sqlite3";
import type { Collection, CollectionsApi } from "../../shared/collections.js";

export function createCollectionRepository(database: sqlite3.Database): CollectionsApi {
  return {
    list() {
      return new Promise((resolve, reject) => {
        database.all<Collection>(
          "SELECT id, title, description, url_picture AS imageUrl FROM collections ORDER BY id",
          (error, rows) => {
            if (error) reject(error);
            else resolve(rows);
          },
        );
      });
    },

    create(input) {
      return new Promise((resolve, reject) => {
        database.run(
          "INSERT INTO collections (title, description, url_picture) VALUES (?, ?, ?)",
          [input.title, input.description, input.imageUrl],
          function (error) {
            if (error) reject(error);
            else resolve({ id: this.lastID, ...input });
          },
        );
      });
    },

    update(id, input) {
      return new Promise((resolve, reject) => {
        database.run(
          "UPDATE collections SET title = ?, description = ?, url_picture = ? WHERE id = ?",
          [input.title, input.description, input.imageUrl, id],
          function (error) {
            if (error) reject(error);
            else if (this.changes === 0) reject(new Error("Collection not found."));
            else resolve({ id, ...input });
          },
        );
      });
    },

    delete(id) {
      return new Promise((resolve, reject) => {
        database.run("DELETE FROM collections WHERE id = ?", [id], function (error) {
          if (error) reject(error);
          else if (this.changes === 0) reject(new Error("Collection not found."));
          else resolve();
        });
      });
    },
  };
}
