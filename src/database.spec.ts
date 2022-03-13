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
