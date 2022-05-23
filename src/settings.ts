import _privatesettings from "./privatesettings.json";

const privatesettings: settings = _privatesettings;

export default function (settingName: keyof settings) {
  let retval = process.env[settingName];
  if (!retval) {
    try {
      retval = privatesettings[settingName] as any;
    } catch (err) {
      console.log(err);
    }
  }
  if (retval) {
    try {
      retval = JSON.parse(retval);
    } catch (err) {
      // No need to deal with error, just trying to parse in case
    }
    return retval;
  }

  return null;
}

export interface settings {
  ClientSecret: settingsGoogle;
  dbconnection?: string;
  dbinstance: string;
  dbpass: string;
  dbuser: string;
  DiscordToken: string;
  S3_BUCKET: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  GooleAPIKey: string;
  CommandAllowlist: {
    bulkrenamegifs: string[];
    bulkfindgifs: string[];
    deletegif: string[];
    renamegif: string[];
  };
}
export interface settingsGoogle {
  installed: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    redirect_uris: string[];
  };
}
