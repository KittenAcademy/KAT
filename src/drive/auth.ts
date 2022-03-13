//https://console.developers.google.com/apis/credentials/consent?project=beaming-team-148423
import googleAuth from "google-auth-library";
import { ParsedQs } from "qs";
import { SetCache } from "../database";
import setting, { settingsGoogle } from "../settings";

const SCOPES = [
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.photos.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
];

// let TOKEN_PATH =  path.join(__dirname,"..", "cache", "drivetoken.json"); //TOKEN_DIR + "drivetoken.json";

//TODO: Cache the auth token

function GetOauth2Client(callback: {
  (oauth2Clientret: { success: any; message: any }): void;
  (oauth2Clientret: any): void;
  (arg0: { success: boolean; message: any }): void;
}) {
  const credentials = setting("ClientSecret") as unknown as settingsGoogle;
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris[0];
  const auth = new (googleAuth as any)();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  callback({ success: true, message: oauth2Client });
}

export const GetAuthURL = function (callback: {
  (response: any): void;
  (arg0: { success: any; message: any }): void;
}) {
  GetOauth2Client(function (oauth2Clientret: { success: any; message: any }) {
    if (!oauth2Clientret.success) {
      callback(oauth2Clientret);
      return;
    }
    const oauth2Client = oauth2Clientret.message;
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    callback({ success: true, message: authUrl });
  });
};

export const UseCode = function (
  code: string | string[] | ParsedQs | ParsedQs[] | undefined,
  callback: {
    (response: any): void;
    (arg0: { success: boolean; message: any }): void;
  }
) {
  GetOauth2Client(function (oauth2Clientret: { success: any; message: any }) {
    if (!oauth2Clientret.success) {
      callback(oauth2Clientret);
      return;
    }
    const oauth2Client = oauth2Clientret.message;
    oauth2Client.getToken(code, function (err: any, token: any) {
      if (err) {
        callback({ success: false, message: err });
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token, callback);
    });
  });
};

function storeToken(
  token: any,
  callback: (arg0: { success: boolean; message: any }) => void
) {
  // try {
  //   fs.mkdirSync(TOKEN_DIR);
  // }
  // catch (err) {
  //   if (err.code != "EEXIST") {
  //	 callback({success: false, message: err});
  //	 return;
  //   }
  // }
  SetCache("drivetoken", token, function (result) {
    callback({ success: true, message: result });
  });
}
