import { google } from "googleapis";
import fs from "fs";

const dir = "./cache";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

export default async function (fileId: any, auth: any, dest?: any) {
  const drive = google.drive({
    version: "v3",
    auth: auth
  });
  return new Promise<void>(async (resolve, reject) => {
    let progress = 0;
    const res = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );
    res.data
      // @ts-ignore
      .on("end", () => {
        console.log("Done downloading file.", fileId);
        resolve();
      })
      .on("error", (err) => {
        console.error("Error downloading file.", fileId);
        reject(err);
      })
      .on("data", (d) => {
        progress += d.length;
        if (process.stdout.isTTY) {
          // @ts-ignore
          process.stdout.clearLine();
          // @ts-ignore
          process.stdout.cursorTo(0);
          process.stdout.write(`Downloaded ${progress} bytes`);
        }
      })
      .pipe(dest);
  });
}
