import { RandomGif } from "../database";
import { getURL } from "../cloudFront/cloudFront";
const UpcomingFiles = new Array();

const GetFiles = async (cantloop?: boolean) => {
  if (!cantloop) cantloop = false;
  const file = await RandomGif();
  let filePath = getURL(file.id + ".gif");
  if (UpcomingFiles.length < 3 && !cantloop) {
    GetFiles(true);
  } else {
    UpcomingFiles.splice(0, 1);
  }
  UpcomingFiles.push({
    filePath: filePath,
    tags: file.tags,
    name: file.name,
  });
};

function RunLoop() {
  setTimeout(function () {
    GetFiles();
    RunLoop();
  }, 10000);
}
RunLoop();

export default function () {
  return UpcomingFiles;
}
