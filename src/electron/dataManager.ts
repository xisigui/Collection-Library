import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)"
  );
});

export const getAllItems = (
  callback: (err: Error | null, rows: any[]) => void
) => {
  db.all("SELECT * FROM items", [], callback);
};

export const addItem = (
  name: string,
  callback: (err: Error | null) => void
) => {
  db.run("INSERT INTO items (name) VALUES (?)", [name], function (err) {
    callback(err);
  });
};

export const updateItem = (
  id: number,
  name: string,
  callback: (err: Error | null) => void
) => {
  db.run("UPDATE items SET name = ? WHERE id = ?", [name, id], function (err) {
    callback(err);
  });
};

export const deleteItem = (
  id: number,
  callback: (err: Error | null) => void
) => {
  db.run("DELETE FROM items WHERE id = ?", [id], function (err) {
    callback(err);
  });
};
