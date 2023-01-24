import { parse as csvParse } from "csv-parse/sync";
import { stringify as csvStringify } from "csv-stringify/sync";
import { MessageAttachment } from "discord.js";
import fetch from "node-fetch";
import { Readable } from "stream";

interface GifRename {
  id: string;
  oldName: string;
  newName: string;
}

export const parseBulkRenameAttachment = async (
  messageAttachment: MessageAttachment
) => {
  const rows = await parseCsvToRows(messageAttachment);
  const renames = rows.map(parseRow);
  const findDuplicate = (a: string[]) =>
    [...a].sort().find((elem, i, arr) => arr[i + 1] === elem);
  const oldNames = renames.map((rename: GifRename) => rename.oldName);
  const newNames = renames.map((rename: GifRename) => rename.newName);
  let duplicate;
  if ((duplicate = findDuplicate(oldNames))) {
    throw `Duplicate old name for a gif: \`${duplicate}\``;
  }
  if ((duplicate = findDuplicate(newNames))) {
    throw `Duplicate new name for a gif: \`${duplicate}\``;
  }
  if ((duplicate = findDuplicate([...oldNames, ...newNames]))) {
    throw `A new name and an old name match: \`${duplicate}\``;
  }
  return renames;
};

export const parseCsvToRows = async (
  messageAttachment: MessageAttachment
): Promise<string[][]> => {
  if (messageAttachment.size > 100 * 1024) throw "File too big";
  const response = await fetch(messageAttachment.url);
  if (!response.ok) throw "Failed to load attachment";
  const text = await response.text();
  return csvParse(text, { relaxColumnCount: true });
};

const parseRow = (row: string[], index: number): GifRename => {
  const errString = `Could not parse ${index}: ${row}. Every row should have 3 columns: id, oldname.gif, newname.gif`;
  if (row.length != 3) throw errString;
  if (row[0].length == 0 || row[1].length == 0) throw errString;
  if (!row[2].endsWith(".gif")) throw errString;
  return {
    id: row[0],
    oldName: row[1],
    newName: row[2]
  };
};

export const generateGifsCsvAttachment = (gifs: any[]): MessageAttachment =>
  arrayToCsvAttachment(gifs.map((gif) => [gif.id, gif.name]));

export const generateRenameGifsCsvAttachment = (
  gifRenames: GifRename[]
): MessageAttachment =>
  arrayToCsvAttachment(
    gifRenames.map((gif) => [gif.id, gif.oldName, gif.newName])
  );

const arrayToCsvAttachment = (array: string[][]) => {
  const text = csvStringify(array);
  const stream = new Readable();
  stream.push(text);
  stream.push(null);
  return new MessageAttachment(stream, `gifs_${Date.now()}.csv`);
};
