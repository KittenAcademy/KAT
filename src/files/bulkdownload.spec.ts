import { getURL } from "../cloudFront/cloudFront";
import { addEntry, getEntry } from "./bulkdownload";

describe("bulkdownload", () => {
  test("should store csv", () => {
    const data = [
      ["id1", "filename_1.gif"],
      ["id2", "filename_2.webp"],
      ["id3", "filename_3.gif"],
      ["id3", "filename_3.gif"],
      []
    ];
    const key = addEntry(data);

    expect(getEntry(key)).toEqual([
      {
        filename: "filename_1.gif",
        url: getURL("id1", "gif")
      },
      {
        filename: "filename_2.webp",
        url: getURL("id2", "webp")
      },
      {
        filename: "filename_3.gif",
        url: getURL("id3", "gif")
      }
    ]);
  });
});
