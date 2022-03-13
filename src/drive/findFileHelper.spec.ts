import { FindGifByTagsInterface } from "../database";
import { pickSomethingAtRandom } from "./findFileHelpers";

describe("pickSomethingAtRandom", () => {
  test("test", () => {
    // arrange
    const expected: FindGifByTagsInterface = {
      id: 1,
      name: "test",
      score: 1,
    };
    const filesArray: FindGifByTagsInterface[] = [expected];

    // act
    const actual = pickSomethingAtRandom(filesArray);

    // assert
    expect(actual).toEqual(expected);
  });
});
