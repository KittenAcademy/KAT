import { pickFileFromArray } from "./findFileHelpers";

describe("pickFileFromArray", () => {
  test("test", () => {
    // arrange
    const expected = {
      id: "1",
      name: "test",
      score: 1,
      tags: [],
      ext: "gif"
    };
    const filesArray = [expected];

    // act
    const actual = pickFileFromArray(filesArray);

    // assert
    expect(actual).toEqual(expected);
  });
});
