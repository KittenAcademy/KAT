import { getURL } from "../cloudFront/cloudFront";
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

export const GetGifURL = (gifid: string) => getURL(gifid + ".gif");

export const updateNewGifs = async (nextPage?: nextPageToken) => {
  const recentlyChangedFiles = await listRecentlyChangedFiles(nextPage);
  if (!recentlyChangedFiles || !recentlyChangedFiles.files) return;

  nextPage = recentlyChangedFiles.nextPageToken;
  for (let i = 0; i < recentlyChangedFiles.files.length; i++) {
    const recentlyChangedFile = recentlyChangedFiles.files[i] as any;
    if (await FindGifByChecksum(recentlyChangedFile.md5Checksum)) continue;
    let gif: any;
    if (
      (gif = await FindGif({
        id: recentlyChangedFile.id
      }))
    ) {
      if (!gif.checksum) {
        await UpdateGifChecksum(
          recentlyChangedFile.id,
          recentlyChangedFile.md5Checksum
        );
      }
      fileUploaded(
        `${recentlyChangedFile.id}.gif`,
        async function (isUploaded: boolean) {
          if (!isUploaded && recentlyChangedFile.id) {
            await uploadGif(recentlyChangedFile.id);
          }
        }
      );
      // TODO check if gif in DB matches what is parsed from the gifDal
    } else if (recentlyChangedFile.id) {
      await uploadGif(recentlyChangedFile.id);
      await AddGif({
        id: recentlyChangedFile.id,
        name: recentlyChangedFile.name,
        tags: recentlyChangedFile.tags,
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

const uploadGif = async (fileid: string) => {
  const filename = fileid + ".gif";
  const auth = await driveauth();
  return new Promise((resolve, reject) => {
    fileUploaded(filename, function (isUploaded: boolean) {
      if (isUploaded) {
        resolve(null);
      } else {
        const metatag = "image/jpeg";
        void drivestream(
          fileid,
          auth,
          uploadFromStream(filename, metatag, resolve)
        );
      }
    });
  });
};
