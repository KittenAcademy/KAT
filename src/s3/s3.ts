import AWS from "aws-sdk";
import setting from "../settings";
import stream from "stream";
import URL from "url";

const accessKey = setting("AWS_ACCESS_KEY_ID");
const secretAccessKey = setting("AWS_SECRET_ACCESS_KEY");
const S3_BUCKET = setting("S3_BUCKET") as string;

let s3: AWS.S3;
const setup = () => {
  if (!accessKey) return;
  if (!secretAccessKey) return;
  s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    credentials: new AWS.Credentials(accessKey, secretAccessKey)
  });
};

setup();
export const fileUploaded = function (
  key: any,
  callback: (arg0: boolean) => void
) {
  const KEY = key;
  const params: AWS.S3.HeadObjectRequest = { Bucket: S3_BUCKET, Key: KEY };
  s3.headObject(params, function (err, data) {
    //4332406
    if (err) {
      switch (err.code) {
        case "NotFound":
          callback(false);
          return;
        default:
          throw err;
      }
    }
    if (data.ContentLength && data.ContentLength < 1000) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

export const deleteFile = function (key: string): Promise<boolean> {
  const params = { Bucket: S3_BUCKET, Key: key };
  return new Promise((res, rej) => {
    s3.deleteObject(params, function (err, data) {
      if (err) {
        switch (err.code) {
          case "NotFound":
            res(false);
            return;
          default:
            throw err;
        }
      } else {
        res(true);
      }
    });
  });
};

export const getURL = function (key: any) {
  const KEY = key;
  const params = { Bucket: S3_BUCKET, Key: KEY };
  const url = URL.parse(s3.getSignedUrl("getObject", params));
  url.search = null;
  return URL.format(url);
};

export const uploadFromStream = function (
  key: any,
  type: any,
  callback: (arg0: Error, arg1: AWS.S3.ManagedUpload.SendData) => void
) {
  const KEY = key;
  const pass = new stream.PassThrough();

  const params = {
    Bucket: S3_BUCKET,
    Key: KEY,
    Body: pass,
    ContentType: type,
    StorageClass: "REDUCED_REDUNDANCY",
    CacheControl: "max-age=31536000"
  };
  s3.upload(params, function (err: Error, data: AWS.S3.ManagedUpload.SendData) {
    callback(err, data);
  });

  return pass;
};
