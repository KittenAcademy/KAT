import { getURL } from "../cloudFront/cloudFront";
import { pickFileFromArray } from "./findFileHelpers";
import { FindGifByTags, FindGifByTagsInterface, RandomGif } from "../database";

export default async (stringToFind: string) => {
  let file: foundFileInterface | null = null;
  if (stringToFind) {
    let files = await FindGifByTags(stringToFind.toLowerCase().split(" "));
    if (files.length < 1) return null;
    file = pickFileFromArray(files);
  } else {
    file = await RandomGif();
  }
  if (!file) return null;
  file.path = getURL(file.id.toString()) + ".gif";
  return file;
};

export interface foundFileInterface extends FindGifByTagsInterface {
  path?: string;
}
