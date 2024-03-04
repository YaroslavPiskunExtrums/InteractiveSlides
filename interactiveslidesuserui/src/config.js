const config = {
  google: {
    API_KEY: "",
    CLIENT_ID: "",
    SECRET: "",
  },
  facebook: {
    APP_ID: "",
  },
  api: {
    API_URL:  window.location.hostname.indexOf("app.slidex.ai") !== -1  ? `${window.location.origin}/addin` : "http://localhost:5000",
  }
}

export default config

export const google = config.google;
export const facebook = config.facebook;
export const api = config.api;
