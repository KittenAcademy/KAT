// HELP: https://www.npmjs.com/package/mongoose

import mongoose, { Schema } from "mongoose";
import setting from "./settings";
import { getTagsFromFileName } from "./drive/dal";
import { ParsedQs } from "qs";
import { IGif, IScoredGif } from "./types";
const dbuser = setting("dbuser");
const dbpass = setting("dbpass");
const dbinstance = setting("dbinstance");
const dbconnection = setting("dbconnection");
if ((!dbpass || !dbuser || !dbinstance) && !dbconnection) {
  throw "DB SETTINGS NOT CONFIGURED";
}
const connectString =
  dbconnection ||
  `mongodb+srv://${dbuser}:${dbpass}@kat.pdpvx.mongodb.net/${dbinstance}?retryWrites=true&w=majority`;
export const init = mongoose.connect(connectString);

const GifsModel = mongoose.model(
  "gifs",
  new mongoose.Schema<IGif>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    tags: { type: [String], required: true },
    checksum: { type: String }
  })
);

const GifCacheModel = mongoose.model(
  "gifcache",
  new mongoose.Schema({
    dateAdded: Date,
    key: String,
    value: mongoose.Schema.Types.Mixed
  })
);

export const RandomGif = (): Promise<IGif> => {
  return new Promise((resolve, reject) => {
    GifsModel.aggregate([{ $sample: { size: 1 } }]).exec((err, result) => {
      if (err) {
        reject(err);
      } else {
        const file = result[0];
        if (!file) {
          reject("Not Found");
        } else {
          resolve({
            name: file.name,
            id: file.id
          });
        }
      }
    });
  }) as any;
};

export const FindGifsByTag = async (tag: string): Promise<IGif[]> => {
  // @ts-ignore
  const query = GifsModel.where({
    tags: tag
  });
  return query.find();
};

export const FindGifByTags = async (
  tagsArray: string[]
): Promise<IScoredGif[]> => {
  console.log("looking for", tagsArray);
  // Find all gifs with an exact match for every tag.
  const exactMatches: IGif[] = await GifsModel.find({
    tags: { $all: tagsArray }
  }).lean();
  if (exactMatches.length) {
    return exactMatches.map((gif) => ({
      ...gif,
      score: 1
    }));
  }

  return await GifsModel.aggregate<IScoredGif>()
    .search({
      index: "kat-gifs",
      text: {
        query: tagsArray.join(" "),
        path: {
          wildcard: "*"
        }
      }
    })
    .project({
      id: 1,
      name: 1,
      tags: 1,
      score: { $meta: "searchScore" }
    })
    .limit(10);
};

export const FindGif = async (file: { id: string }): Promise<IGif> => {
  // @ts-ignore
  const query = GifsModel.where({
    id: file.id
  });
  return query.findOne();
};

export const FindGifsByNameRegex = async (regex: string): Promise<IGif[]> => {
  // @ts-ignore
  const query = GifsModel.where({
    name: {
      $regex: regex
    }
  });
  return query.find();
};

export const AddGif = async (file: IGif) => {
  const gif = new GifsModel();
  gif.id = file.id;
  gif.name = file.name;
  gif.tags = file.tags;
  gif.checksum = file.checksum;
  return gif.save();
};

export const RenameGif = async (
  oldName: string,
  newName: string
): Promise<IGif> => {
  const newTags = getTagsFromFileName(newName);
  const query = (condition: mongoose.FilterQuery<IGif>): Promise<IGif> =>
    GifsModel.findOneAndUpdate(
      condition,
      {
        $set: {
          name: newName,
          tags: newTags
        }
      },
      {
        useFindAndModify: false,
        new: true
      }
    );
  // Prioritize gifs with a matching name over gifs with a matching id, in case a file name is a duplicate of some id.
  return (await query({ name: oldName })) || (await query({ id: oldName }));
};

export const FindGifByChecksum = async (checksum: string): Promise<IGif> => {
  if (!checksum) throw "Checksum missing!";
  return await GifsModel.where({
    checksum
  }).findOne();
};

export const UpdateGifChecksum = async (
  id: string,
  checksum: string
): Promise<IGif> => {
  if (!checksum) throw "Checksum missing!";
  // @ts-ignore
  return await GifsModel.findOneAndUpdate(
    { id: id },
    {
      $set: {
        checksum: checksum
      }
    },
    {
      useFindAndModify: false,
      new: true
    }
  );
};

export const BulkRenameGifs = async (
  files: { id: string; oldName: string; newName: string }[]
): Promise<number> => {
  // Best effort validation without locking the table.
  const currentFiles = new Set(
    (await GifsModel.find({ id: { $in: files.map((file) => file.id) } })).map(
      (file: any) => JSON.stringify({ id: file.id, name: file.name })
    )
  );
  const missingFiles = files.filter(
    (file) =>
      !currentFiles.has(JSON.stringify({ id: file.id, name: file.oldName }))
  );
  if (missingFiles.length) {
    throw `${missingFiles.length} gif(s) were not found: \`${missingFiles
      .slice(0, 5)
      .map((f) => f.oldName)}\`${
      missingFiles.length > 5 ? " and some more" : ""
    }`;
  }
  const existingFilesWithNewName = await GifsModel.find({
    name: { $in: files.map((file) => file.newName) }
  });
  if (existingFilesWithNewName.length) {
    throw `${
      existingFilesWithNewName.length
    } gif(s) with specified new names already exist: \`${existingFilesWithNewName
      .slice(0, 5)
      .map((f: any) => f.name)}\`${
      existingFilesWithNewName.length > 5 ? " and some more" : ""
    }`;
  }

  // Bulk update gifs.
  const result = await GifsModel.bulkWrite(
    files.map((file) => ({
      updateOne: {
        filter: { id: file.id, name: file.oldName },
        update: {
          $set: { name: file.newName, tags: getTagsFromFileName(file.newName) }
        }
      }
    }))
  );
  return result.matchedCount as number;
};

export const DeleteGif = async function (id: string): Promise<boolean> {
  try {
    await GifsModel.deleteOne({ id: id }).exec();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const GetGifCache = function (
  cacheKey: string,
  callback: {
    (err: any, token: any): void;
    (arg0: string, arg1: string | null): void;
  }
) {
  // @ts-ignore
  let query = GifCacheModel.where({
    key: cacheKey
  });
  query.findOne(function (err: any, found: { value: any }) {
    if (err) {
      callback(err, "");
      return;
    }
    if (found) {
      callback("", found.value);
      return;
    } else {
      callback(`cache value: "${cacheKey}" not found`, null);
      return;
    }
  });
};

export const SetCache = function (
  key: string,
  value: any,
  callback: {
    (result: any): void;
    (arg0: { err?: mongoose.NativeError; result?: string }): void;
  }
) {
  let gifCache = new GifCacheModel();
  // @ts-ignore
  gifCache.key = key;
  // @ts-ignore
  gifCache.value = value;
  // @ts-ignore
  gifCache.dateAdded = new Date();
  gifCache.save(function (err) {
    if (err) {
      callback({
        err: err
      });
      return;
    }
    callback({
      result: key + " added"
    });
    return;
  });
};

export const DeleteCache = function (
  key: string,
  callback: (arg0: { err?: any; result?: string }) => void
) {
  GifCacheModel.findOneAndRemove(
    {
      key: key
    },
    // @ts-ignore
    function (err: any) {
      if (err) {
        callback({
          err: err
        });
        return;
      }
      callback({
        result: key + " removed from cache"
      });
      return;
    }
  );
};
