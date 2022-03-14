jest.mock("node-fetch", () => ({
  __esModule: true,
  default: (url: string) => fakeFetch(url)
}));
const { Response } = jest.requireActual("node-fetch");

import { MessageAttachment } from "discord.js";
import { Stream } from "stream";
import {
  parseBulkRenameAttachment,
  generateGifsCsvAttachment,
  generateRenameGifsCsvAttachment
} from "./csv";

beforeEach(() => {
  responsesByUrl.clear();
});
describe("parseBulkRenameAttachment", () => {
  it("should parse attachment", async () => {
    const attachment = prepareAttachment("a,b.gif,c.gif\nd,e.gif,f.gif");
    expect(await parseBulkRenameAttachment(attachment)).toEqual([
      {
        id: "a",
        oldName: "b.gif",
        newName: "c.gif"
      },
      {
        id: "d",
        oldName: "e.gif",
        newName: "f.gif"
      }
    ]);
  });

  it("should validate columns", async () => {
    const attachment = prepareAttachment("a,b.gif,c.gif\nd,e.gif");
    await expect(parseBulkRenameAttachment(attachment)).rejects.toMatch(
      "Every row should have 3"
    );
  });

  it("should ensure unique old names", async () => {
    const attachment = prepareAttachment("a,b.gif,c.gif\nd,b.gif, f.gif");
    await expect(parseBulkRenameAttachment(attachment)).rejects.toMatch(
      "Duplicate old name for a gif: `b.gif`"
    );
  });

  it("should ensure unique new names", async () => {
    const attachment = prepareAttachment(
      "a,b.gif,c.gif\nd,e.gif,c.gif\nf,g.gif,h.gif"
    );
    await expect(parseBulkRenameAttachment(attachment)).rejects.toMatch(
      "Duplicate new name for a gif: `c.gif`"
    );
  });

  it("should ensure no new name matches another old name", async () => {
    const attachment = prepareAttachment("a,b.gif,c.gif\nd,e.gif,b.gif");
    await expect(parseBulkRenameAttachment(attachment)).rejects.toMatch(
      "new name and an old name match"
    );
  });
});

test("should generate gifs csv", async () => {
  const gifs = [
    {
      id: "id1",
      name: "first.gif",
      tags: ["first"]
    },
    {
      id: "id2",
      name: "other_file.gif",
      tags: ["other", "file"]
    }
  ];
  const result = generateGifsCsvAttachment(gifs);
  const contents = await streamToString(result.attachment as Stream);
  expect(contents).toEqual(`id1,first.gif
id2,other_file.gif
`);
});

test("should generate rename csv", async () => {
  const gifs = [
    {
      id: "id1",
      oldName: "first.gif",
      newName: "new_first.gif"
    },
    {
      id: "id2",
      oldName: "other.gif",
      newName: "new_other.gif"
    }
  ];
  const result = generateRenameGifsCsvAttachment(gifs);
  const contents = await streamToString(result.attachment as Stream);
  expect(contents).toEqual(`id1,first.gif,new_first.gif
id2,other.gif,new_other.gif
`);
});

const responsesByUrl = new Map();
const fakeFetch = (url: string) => responsesByUrl.get(url);
let urlId = 0;
const prepareAttachment = (
  contents: string,
  size?: number
): MessageAttachment => {
  size = size || contents.length;
  const url = "https://localhost/" + urlId++;
  responsesByUrl.set(url, new Response(contents));
  return {
    size,
    url
  } as MessageAttachment;
};
const streamToString = (stream: Stream) =>
  new Promise((res, rej) =>
    stream.on("data", (data: any) => res(data.toString()))
  );
