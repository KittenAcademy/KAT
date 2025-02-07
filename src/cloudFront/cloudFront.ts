import setting from "../settings";
export const getURL = function (key: string, ext: string) {
  return `https://${setting("CloudFrontId")}.cloudfront.net/` + key + "." + ext;
};
