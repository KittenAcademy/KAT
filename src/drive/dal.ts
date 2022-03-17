import { drive_v3, google } from "googleapis";
import driveauth from "./driveauth";
export type nextPageToken = string | null | undefined;

export const getTagsFromFileName = (fileName: string) => {
  let retval = fileName
    .replace(/\.[^/.]+$/, "")
    .split("_")
    .map((item) => item.trim().toLowerCase());
  retval = retval.filter(function (elem, pos) {
    return retval.indexOf(elem) == pos;
  });
  return retval;
};

export const listRecentlyChangedFiles = async (pageToken: nextPageToken) => {
  const fetchPageResult = await fetchPage(pageToken, {
    orderBy: "modifiedTime desc",
    q: "mimeType = 'image/gif' and '0BwoBPbVKwbI9TUdFSG0yRjh5UTQ' in parents",
    pageSize: 5
  });
  if (!fetchPageResult.files) return;
  fetchPageResult.files = filesToTags(fetchPageResult.files);
  return fetchPageResult as listRecentlyChangedFilesReturn;
};

interface listRecentlyChangedFilesReturn {
  nextPageToken: nextPageToken;
  files: filesToTagsInterface[];
}
interface filesToTagsInterface extends drive_v3.Schema$File {
  tags?: string[];
}
const filesToTags = (files: filesToTagsInterface[]) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.name) continue;
    file.name = file.name.toLowerCase();
    file.tags = getTagsFromFileName(file.name);
  }
  return files;
};

export const listAllFiles = async () => {
  const files = [] as drive_v3.Schema$FileList[];
  let nextPageToken = null;
  let page = 1;
  do {
    const fetchPageResult = await fetchPage(undefined, {
      q: "mimeType = 'image/gif' and '0BwoBPbVKwbI9TUdFSG0yRjh5UTQ' in parents"
    });
    if (!fetchPageResult.files) return;
    nextPageToken = fetchPageResult.nextPageToken;
    files.push.apply(files, filesToTags(fetchPageResult.files));
    files.push.apply(files, fetchPageResult.files);
    page = page + 1;
  } while (
    // while (nextPageToken);
    nextPageToken &&
    page < 3
  );
  return files;
};

const fetchPage = async (
  pageToken?: nextPageToken,
  query?: any
): Promise<drive_v3.Schema$FileList> => {
  const auth = (await driveauth()) as any;
  const drive = google.drive({
    version: "v3",
    auth: auth
  });
  return new Promise<drive_v3.Schema$FileList>((resolve) => {
    query.fields = "nextPageToken, files(id, name)";
    query.spaces = "drive";
    query.pageToken = pageToken;
    // console.log("getting ", query, " from Google drive")
    drive.files
      .list(query)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.log("error when trying to get page from google");
        console.log(err);
        console.log("Retrying in two seconds");
        setTimeout(() => {
          void fetchPage(pageToken, query);
        }, 2000);
      });
  });
};
