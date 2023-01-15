import { createHash } from "crypto";
import { getURL } from "../cloudFront/cloudFront";
const maxCacheCount = 20;
const cache: { key: string; data: IGifRow[] }[] = [];
function hash(csv: string[][]): string {
  const md5sum = createHash("md5");
  md5sum.update(JSON.stringify(csv));
  return md5sum.digest("hex");
}

function addCache(key: string, data: IGifRow[]): void {
  cache.push({ key, data });
  if (cache.length > maxCacheCount) cache.shift();
}

function uniqBy<T, R>(arr: T[], key: (elem: T) => R): T[] {
  const seen = new Set();
  return arr.filter((item) => {
    const k = key(item);
    return seen.has(k) ? false : seen.add(k);
  });
}

export function addEntry(csv: string[][]): string {
  const filtered = uniqBy(
    csv.filter((row) => row.length === 2),
    (row) => row[1]
  );
  const key = hash(filtered);
  addCache(
    key,
    filtered.map((row) => ({
      url: getURL(row[0]) + ".gif",
      filename: row[1]
    }))
  );
  return key;
}

export function getEntry(key: string): IGifRow[] {
  const match = cache.filter((row) => row.key === key);
  if (!match.length) throw "not found";
  return match[0].data;
}

export interface IGifRow {
  url: string;
  filename: string;
}
