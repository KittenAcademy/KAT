import { getURL } from "../cloudFront/cloudFront";
import { pickFileFromArray } from "./findFileHelpers";
import { FindGifByTags, RandomGif } from "../database";
import { IGif } from "../types";

export default async (
  stringToFind: string
): Promise<(IGif & { path: string }) | null> => {
  let file: IGif | null = null;
  if (stringToFind) {
    const files = await FindGifByTags(stringToFind.toLowerCase().split(" "));
    if (files.length < 1) return null;
    file = pickFileFromArray(files);
  } else {
    file = await RandomGif();
  }
  if (!file) return null;
  return {
    ...file,
    path: getURL(file.id.toString()) + ".gif"
  };
};
