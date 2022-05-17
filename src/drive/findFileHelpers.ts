import { IScoredGif } from "../types";

export const pickFileFromArray = (filesArray: IScoredGif[]) => {
  const scoreToMatch = filesArray[0].score - 1.0;
  const filesMatchingScore = filesArray.filter(
    (file) => file.score > scoreToMatch
  );
  const randomSelection = pickSomethingAtRandom(filesMatchingScore);
  return randomSelection;
};

const pickSomethingAtRandom = <T>(filesArray: T[]) => {
  if (filesArray.length === 1) return filesArray[0];
  const indexToUse = Math.floor(Math.random() * filesArray.length);
  return filesArray[indexToUse];
};
