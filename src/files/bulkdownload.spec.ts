import { getURL } from "../cloudFront/cloudFront";
import { addEntry, getEntry } from "./bulkdownload";

describe("bulkdownload", () => {
  test("should store csv", () => {
    const data = [
      ["id1", "filename_1.gif"],
      ["id2", "filename_2.gif"],
      ["id2", "filename_2.gif"],
      []
    ];
    const key = addEntry(data);

    expect(getEntry(key)).toEqual([
      {
        filename: "filename_1.gif",
        url: getURL("id1") + ".gif"
      },
      {
        filename: "filename_2.gif",
        url: getURL("id2") + ".gif"
      }
    ]);
  });
});
