import sqlite3 from "sqlite3";

export function openDatabase(filename: string): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    const database = new sqlite3.Database(filename, (openError) => {
      if (openError) {
        reject(openError);
        return;
      }

      // Keep the existing schema so previously saved collections still work.
      database.run(
        `CREATE TABLE IF NOT EXISTS collections (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          url_picture TEXT NOT NULL
        )`,
        (schemaError) => {
          if (schemaError) {
            database.close(() => reject(schemaError));
          } else {
            resolve(database);
          }
        },
      );
    });
  });
}

export function closeDatabase(database: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    database.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}
