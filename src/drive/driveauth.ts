//https://console.developers.google.com/apis/credentials/consent?project=beaming-team-148423
import { OAuth2Client } from "google-auth-library";
import { GetGifCache } from "../database";
import setting, { settingsGoogle } from "../settings";

const getAuth = async (): Promise<OAuth2Client> => {
  const cache = GetCache();
  if (cache) {
    return cache;
  }
  const settingValue = setting("ClientSecret") as unknown as settingsGoogle;
  const result = await authorize(settingValue);
  return result;
};
export default getAuth;

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 */
const authorize = (credentials: settingsGoogle) => {
  return new Promise<OAuth2Client>((resolve, reject) => {
    const oAuth2Client = new OAuth2Client(
      credentials.installed.client_id,
      credentials.installed.client_secret,
      credentials.installed.redirect_uris[0]
    );

    // Check if we have previously stored a token.
    GetGifCache("drivetoken", function (err, token) {
      if (err || Object.keys(token).length === 0) {
        console.log("err when reading token", err, "drivetoken");
        reject();
      } else {
        oAuth2Client.credentials = token;
        resolve(oAuth2Client);
        AddCache(oAuth2Client);
      }
    });
  });
};

interface cacheInterface {
  expires: number;
  value?: OAuth2Client;
}

const Cache: cacheInterface = {
  expires: 0
};

function GetCache() {
  if (Cache.expires > new Date().getTime()) {
    return Cache.value;
  } else {
    // console.log("no token in cache")
    return null;
  }
}

function AddCache(value: OAuth2Client) {
  // console.log("adding token to cache", value)
  Cache.value = value;
}
