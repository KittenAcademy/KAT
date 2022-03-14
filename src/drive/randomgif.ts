import { init, RandomGif } from "../database";
import { getURL } from "../cloudFront/cloudFront";
const UpcomingFiles = new Array();

const GetFiles = async (cantloop?: boolean) => {
  if (!cantloop) cantloop = false;
  const file = await RandomGif();
  const filePath = getURL(file.id + ".gif");
  if (UpcomingFiles.length < 3 && !cantloop) {
    void GetFiles(true);
  } else {
    UpcomingFiles.splice(0, 1);
  }
  UpcomingFiles.push({
    filePath: filePath,
    tags: file.tags,
    name: file.name
  });
};

function RunLoop() {
  setTimeout(async function () {
    try {
      await GetFiles();
    } finally {
      RunLoop();
    }
  }, 10000);
}
void init.then(RunLoop);

export default function () {
  return UpcomingFiles;
}
