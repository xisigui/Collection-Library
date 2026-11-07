import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { openDatabase, closeDatabase } from "../dist-electron/electron/database/database.js";
import { createCollectionRepository } from "../dist-electron/electron/database/collection-repository.js";
import { parseCollectionId, parseCollectionInput } from "../dist-electron/electron/ipc/collection-validation.js";

const sample = { title: "A collection", description: "Saved description", imageUrl: "https://example.com/image.png" };

test("CRUD returns consistent collection objects and persists to disk", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "collection-library-test-"));
  const filename = path.join(directory, "data.db");
  let database;
  try {
    database = await openDatabase(filename);
    const repository = createCollectionRepository(database);
    assert.deepEqual(await repository.list(), []);
    const created = await repository.create(sample);
    assert.ok(created.id > 0);
    assert.deepEqual(await repository.list(), [created]);

    // SQL-looking content must remain ordinary data.
    const input = { ...sample, title: "It's mine'); DROP TABLE collections; --", imageUrl: "" };
    const updated = await repository.update(created.id, input);
    assert.deepEqual(updated, { id: created.id, ...input });
    await closeDatabase(database);
    database = undefined;

    database = await openDatabase(filename);
    const reopened = createCollectionRepository(database);
    assert.deepEqual(await reopened.list(), [updated]);
    await reopened.delete(created.id);
    assert.deepEqual(await reopened.list(), []);
    await assert.rejects(reopened.update(created.id, sample), /not found/);
    await assert.rejects(reopened.delete(created.id), /not found/);
  } finally {
    if (database) await closeDatabase(database);
    assert.equal(path.dirname(directory), path.resolve(tmpdir()));
    await rm(directory, { recursive: true, force: true });
  }
});

test("existing url_picture rows remain readable without migration", async () => {
  const database = await openDatabase(":memory:");
  try {
    await new Promise((resolve, reject) => {
      database.run(
        "INSERT INTO collections (id, title, description, url_picture) VALUES (?, ?, ?, ?)",
        [42, sample.title, sample.description, sample.imageUrl],
        (error) => error ? reject(error) : resolve(),
      );
    });
    assert.deepEqual(await createCollectionRepository(database).list(), [{ id: 42, ...sample }]);
  } finally {
    await closeDatabase(database);
  }
});

test("database setup and query failures reject instead of leaving requests pending", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "collection-library-test-"));
  try {
    await assert.rejects(openDatabase(path.join(directory, "missing", "data.db")), /SQLITE_CANTOPEN/);
    const corrupt = path.join(directory, "corrupt.db");
    await writeFile(corrupt, "This is not a SQLite database.");
    await assert.rejects(openDatabase(corrupt), /SQLITE_NOTADB/);
    const database = await openDatabase(":memory:");
    await closeDatabase(database);
    await assert.rejects(createCollectionRepository(database).list(), /SQLITE_MISUSE/);
  } finally {
    assert.equal(path.dirname(directory), path.resolve(tmpdir()));
    await rm(directory, { recursive: true, force: true });
  }
});

test("IPC validation rejects malformed payloads and normalizes valid text", () => {
  for (const id of [null, undefined, "1", 0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => parseCollectionId(id), /Invalid collection ID/);
  }
  assert.equal(parseCollectionId(42), 42);
  for (const input of [null, [], {}, sample.title, { ...sample, title: 123 }, { ...sample, title: "  " }, { ...sample, description: null }]) {
    assert.throws(() => parseCollectionInput(input));
  }
  assert.deepEqual(parseCollectionInput({ ...sample, title: "  A collection  ", extra: true }), sample);
});
