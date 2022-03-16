import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let database: any;
let dbServer: any;

beforeAll(async () => {
  dbServer = await MongoMemoryServer.create({ instance: { dbName: "kat" } });
  const uri = dbServer.getUri() + "kat";
  jest.doMock("./privatesettings", () => ({
    __esModule: true,
    default: { dbconnection: uri }
  }));
  database = await import("./database");
  await database.init;
  // Verify database is empty.
  await expect(async () => await database.RandomGif()).rejects.toMatch(
    "Not Found"
  );
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await dbServer.stop();
  await mongoose.connection.close();
});

test("should add and find gif", async () => {
  const gif = { id: "id1", name: "my_file.gif", tags: ["my", "file"] };
  await database.AddGif(gif);
  const result = await database.FindGif({ id: "id1" });
  expect(result.toJSON()).toMatchObject(gif);
});

test("should delete gif", async () => {
  const gif = { id: "id1", name: "my_file.gif", tags: ["my", "file"] };
  await database.AddGif(gif);

  const result = await database.DeleteGif("id1");
  expect(result).toBeTruthy();
  expect(await database.FindGif({ id: "id1" })).toBeFalsy();
});

test("should rename gif by name", async () => {
  const gif = { id: "id1", name: "my_file.gif", tags: ["my", "file"] };
  const gifWithWeirdId = {
    id: "my_file.gif",
    name: "test.gif",
    tags: ["test"]
  };
  await database.AddGif(gif);
  await database.AddGif(gifWithWeirdId);

  const result = await database.RenameGif(
    "my_file.gif",
    "the_new_awesome_file.gif"
  );

  expect(result.toJSON()).toMatchObject({
    id: "id1",
    name: "the_new_awesome_file.gif",
    tags: ["the", "new", "awesome", "file"]
  });
  expect(await database.FindGif({ id: "id1" })).toEqual(result);

  const unchangedResult = await database.FindGif({ id: "my_file.gif" });
  expect(unchangedResult.toJSON()).toMatchObject(gifWithWeirdId);
});

test("should rename gif by id", async () => {
  const gif = { id: "id1", name: "my_file.gif", tags: ["my", "file"] };
  await database.AddGif(gif);

  const result = await database.RenameGif("id1", "the_new_awesome_file.gif");

  expect(result.toJSON()).toMatchObject({
    id: "id1",
    name: "the_new_awesome_file.gif",
    tags: ["the", "new", "awesome", "file"]
  });
  expect(await database.FindGif({ id: "id1" })).toEqual(result);
});

test("should find all gifs for tag", async () => {
  const matchingGifs = [
    { id: "id1", name: "my_file.gif", tags: ["my", "file"] },
    { id: "id2", name: "other_file.gif", tags: ["other", "file"] },
    { id: "id3", name: "file_too.gif", tags: ["file", "too"] }
  ];
  const nonMatchingGifs = [
    { id: "id4", name: "not_a_filet.gif", tags: ["not", "a", "filet"] },
    { id: "id5", name: "vile_of_nile.gif", tags: ["vile", "of", "nile"] }
  ];
  await Promise.all([...matchingGifs, ...nonMatchingGifs].map(database.AddGif));

  const result: [any] = await database.FindGifsByTag("file");

  expect(new Set(result.map((gif) => gif.toObject()))).toEqual(
    new Set(matchingGifs.map(expect.objectContaining))
  );
});

test("should find gifs by name regex", async () => {
  const matchingGifs = [
    { id: "id1", name: "file_acd.gif", tags: [] },
    { id: "id2", name: "file_abcd.gif", tags: [] },
    { id: "id3", name: "file_abbcd.gif", tags: [] }
  ];
  const nonMatchingGifs = [
    { id: "id4", name: "file_abccd.gif", tags: [] },
    { id: "id5", name: "file_abc.gif", tags: [] }
  ];
  await Promise.all([...matchingGifs, ...nonMatchingGifs].map(database.AddGif));

  const result = await database.FindGifsByNameRegex("_ab*cd");

  expect(new Set(result.map((gif: any) => gif.toObject()))).toEqual(
    new Set(matchingGifs.map(expect.objectContaining))
  );
});

test("should bulk rename gifs", async () => {
  const gifs = [
    { id: "id1", name: "one_file.gif", tags: ["one", "file"] },
    { id: "id2", name: "other_file.gif", tags: ["other", "file"] },
    {
      id: "id3",
      name: "dont_rename_this.gif",
      tags: ["dont", "rename", "this"]
    }
  ];
  await Promise.all(gifs.map(database.AddGif));
  const renames = [
    { id: "id1", oldName: "one_file.gif", newName: "new_meme.gif" },
    { id: "id2", oldName: "other_file.gif", newName: "cool_video.gif" }
  ];

  const result = await database.BulkRenameGifs(renames);

  expect(result).toEqual(2);
  expect((await database.FindGif({ id: "id1" })).toJSON()).toMatchObject({
    id: "id1",
    name: "new_meme.gif",
    tags: ["new", "meme"]
  });
  expect((await database.FindGif({ id: "id2" })).toJSON()).toMatchObject({
    id: "id2",
    name: "cool_video.gif",
    tags: ["cool", "video"]
  });
  expect((await database.FindGif({ id: "id3" })).toJSON()).toMatchObject(
    gifs[2]
  );
});

test("should not rename gifs if a new name already exists", async () => {
  const gifs = [
    { id: "id1", name: "one_file.gif", tags: ["one", "file"] },
    { id: "id2", name: "other_file.gif", tags: ["other", "file"] },
    { id: "id3", name: "old_file.gif", tags: ["old", "file"] }
  ];
  await Promise.all(gifs.map(database.AddGif));
  const renames = [
    { id: "id1", oldName: "one_file.gif", newName: "new_file.gif" },
    { id: "id2", oldName: "other_file.gif", newName: "old_file.gif" }
  ];

  await expect(database.BulkRenameGifs(renames)).rejects.toMatch(
    "1 gif(s) with specified new names already exist"
  );
});

test("should not rename gifs if one of the gifs is not found", async () => {
  const gifs = [
    { id: "id1", name: "one_file.gif", tags: ["one", "file"] },
    { id: "id2", name: "other_file.gif", tags: ["other", "file"] }
  ];
  await Promise.all(gifs.map(database.AddGif));
  const renames = [
    { id: "id1", oldName: "one_file.gif", newName: "new_file.gif" },
    { id: "id2", oldName: "missing_file.gif", newName: "not_missing_file.gif" }
  ];

  await expect(database.BulkRenameGifs(renames)).rejects.toMatch(
    "1 gif(s) were not found"
  );
});
