import { listRecentlyChangedFiles, nextPageToken } from "../drive/dal";
import {
  FindGif,
  FindGifByChecksum,
  AddGif,
  UpdateGifChecksum
} from "../database";
import { fileUploaded, uploadFromStream } from "../s3/s3";
import drivestream from "../drive/returnstream";
import driveauth from "../drive/driveauth";
import setting from "../settings";
import { valid_exts } from "../ext";
import { IGif } from "../types";

export const updateNewGifs = async (nextPage?: nextPageToken) => {
  const recentlyChangedFiles = await listRecentlyChangedFiles(nextPage);
  if (!recentlyChangedFiles || !recentlyChangedFiles.files) return;
  nextPage = recentlyChangedFiles.nextPageToken;
  for (let i = 0; i < recentlyChangedFiles.files.length; i++) {
    const recentlyChangedFile = recentlyChangedFiles.files[i];
    if (recentlyChangedFile.size! > setting("MaxGifSize")) continue;

    if (
      !recentlyChangedFile.id ||
      !recentlyChangedFile.name ||
      !recentlyChangedFile.md5Checksum ||
      !recentlyChangedFile.ext ||
      !recentlyChangedFile.tags ||
      !recentlyChangedFile.mimeType
    ) {
      continue;
    }
    if (!valid_exts.includes(recentlyChangedFile.ext)) continue;
    if (recentlyChangedFile.mimeType != `image/${recentlyChangedFile.ext}`) {
      console.warn(
        `File ${recentlyChangedFile.name} is not a ${recentlyChangedFile.ext} file: mimeType is ${recentlyChangedFile.mimeType}`
      );
      continue;
    }
    let gif: IGif | undefined;
    if (
      (gif = await FindGif({
        id: recentlyChangedFile.id!
      }))
    ) {
      if (!gif.checksum) {
        await UpdateGifChecksum(
          recentlyChangedFile.id!,
          recentlyChangedFile.md5Checksum!
        );
      }
      fileUploaded(
        `${recentlyChangedFile.id}.${recentlyChangedFile.ext}`,
        async function (isUploaded: boolean) {
          if (
            !isUploaded &&
            recentlyChangedFile.id &&
            recentlyChangedFile.ext
          ) {
            await uploadGif(recentlyChangedFile.id, recentlyChangedFile.ext);
          }
        }
      );
      // TODO check if gif in DB matches what is parsed from the gifDal
    } else {
      await uploadGif(recentlyChangedFile.id, recentlyChangedFile.ext);
      await AddGif({
        id: recentlyChangedFile.id,
        name: recentlyChangedFile.name,
        tags: recentlyChangedFile.tags,
        ext: recentlyChangedFile.ext,
        checksum: recentlyChangedFile.md5Checksum
      });
    }
  }
  if (nextPage) {
    await updateNewGifs(nextPage);
  }
};

export const pollForGifsInDrive = () => {
  if (!process.argv.includes("--nowatchdrive")) {
    setInterval(updateNewGifs, 86400000); // daily
    void updateNewGifs();
  }
};

const uploadGif = async (fileid: string, ext: string) => {
  const filename = fileid + "." + ext;
  const auth = await driveauth();
  return new Promise((resolve, reject) => {
    fileUploaded(filename, function (isUploaded: boolean) {
      if (isUploaded) {
        resolve(null);
      } else {
        const metatag = "image/" + ext;
        void drivestream(
          fileid,
          auth,
          uploadFromStream(filename, metatag, resolve)
        );
      }
    });
  });
};
