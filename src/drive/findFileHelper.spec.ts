import { pickFileFromArray } from "./findFileHelpers";

describe("pickFileFromArray", () => {
  test("test", () => {
    // arrange
    const expected = {
      id: "1",
      name: "test",
      score: 1,
      tags: []
    };
    const filesArray = [expected];

    // act
    const actual = pickFileFromArray(filesArray);

    // assert
    expect(actual).toEqual(expected);
  });
});
