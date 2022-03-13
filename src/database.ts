// HELP: https://www.npmjs.com/package/mongoose

import mongoose from "mongoose";
import setting from "./settings";
import { getTagsFromFileName } from "./drive/dal";
import { ParsedQs } from "qs";
let dbuser = setting("dbuser");
let dbpass = setting("dbpass");
let dbinstance = setting("dbinstance");
if (!dbpass || !dbuser || !dbinstance) {
  throw "DB SETTINGS NOT CONFIGURED";
}
let connectString = `mongodb+srv://${dbuser}:${dbpass}@kat.pdpvx.mongodb.net/${dbinstance}?retryWrites=true&w=majority`;
mongoose.connect(connectString);

const GifsModel = mongoose.model(
  "gifs",
  new mongoose.Schema({
    id: String,
    name: String,
    tags: [String]
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

export const SearchForGif = (name: string | RegExp) => {
  return GifsModel.aggregate([
    { $match: { name: new RegExp(name, "i") } },
    { $sample: { size: 1 } }
  ]).exec();
};

export const RandomGif = () => {
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

export const FindGifsByTag = async (tag: string) => {
  // @ts-ignore
  const query = GifsModel.where({
    tags: tag
  });
  return query.find();
};
export interface FindGifByTagsInterface {
  id: number;
  name: string;
  score: number;
}
export const FindGifByTags = async (tagsArray: string[]) => {
  console.log("looking for", tagsArray);
  // @ts-ignore
  var retval = await GifsModel.aggregate()
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
      score: { $meta: "searchScore" }
    })
    .limit(10);
  return retval as FindGifByTagsInterface[];
};

export const FindGif = async (file: { id: any }) => {
  // @ts-ignore
  const query = GifsModel.where({
    id: file.id
  });
  return query.findOne();
};

export const AddGif = async (file: { id: any; name: any; tags: any }) => {
  let gif = new GifsModel();
  gif.id = file.id;
  // @ts-ignore
  gif.name = file.name;
  // @ts-ignore
  gif.tags = file.tags;
  return gif.save();
};

export const RenameGif = async (oldName: any, newName: any) => {
  const newTags = getTagsFromFileName(newName);
  const query = (
    condition: mongoose.FilterQuery<mongoose.Document<any>> | undefined
  ) =>
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
  return (
    (await query({ name: oldName })) || ((await query({ id: oldName })) as any)
  );
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
