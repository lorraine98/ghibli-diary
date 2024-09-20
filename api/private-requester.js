import { getAccessToken, saveAccessToken } from "../common/auth-storage.js";
import { errorMessage } from "../common/error-message.js";
import { requester } from "./requester.js";

const createOptionsWithAccessToken = async (options = {}) => {
  let accessToken = getAccessToken();

  if (!accessToken) {
    const { data, ok } = await requester.post("/api/v1/auth/login");

    if (!ok) {
      console.error(errorMessage.failToLogin);
      return options;
    }
    accessToken = data.accessToken;
    saveAccessToken(accessToken);
  }

  return {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${accessToken}` },
  };
};

const get = async (urlPath, queryParams = {}, options = {}) => {
  const optionsWithToken = await createOptionsWithAccessToken(options);
  return requester.get(urlPath, queryParams, optionsWithToken);
};

const post = async (urlPath, body = {}, options = {}) => {
  const optionsWithToken = await createOptionsWithAccessToken(options);
  return requester.post(urlPath, body, optionsWithToken);
};

const patch = async (urlPath, body = {}, options = {}) => {
  const optionsWithToken = await createOptionsWithAccessToken(options);
  return requester.patch(urlPath, body, optionsWithToken);
};

const remove = async (urlPath, queryParams = {}, options = {}) => {
  const optionsWithToken = await createOptionsWithAccessToken(options);
  return requester.remove(urlPath, queryParams, optionsWithToken);
};

export const privateRequester = {
  get,
  post,
  patch,
  remove,
};
