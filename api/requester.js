import { getAccessToken, saveAccessToken } from "../common/auth-storage.js";
import { errorMessage } from "../common/error-message.js";

const API_BASE_URL = "http://localhost:3000";

const statusCode = {
  UNKNOWN: -1,
};

const requestMethod = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

const request = async (path, options = {}) => {
  const uri = `${API_BASE_URL}${path}`;

  try {
    const response = await fetch(uri, options);

    const hasContent = +response.headers.get("Content-Length") > 0;

    const isJsonResponse = response.headers
      .get("Content-Type")
      ?.includes("application/json");

    const isUnexpectedResponse = hasContent && !isJsonResponse;
    if (isUnexpectedResponse) {
      console.warn("Unexpected data received", await response.text());
    }

    const data = isJsonResponse ? await response.json() : undefined;

    return {
      ok: response.ok,
      statusCode: response.status,
      data,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      statusCode: statusCode.UNKNOWN,
      error,
    };
  }
};

const login = async () => {
  let accessToken = getAccessToken();

  if (!accessToken) {
    const { data, ok } = await post("/api/v1/auth/login", { isPrivate: false });

    if (!ok) {
      console.error(errorMessage.failToLogin);
      return;
    }
    accessToken = data.accessToken;
    saveAccessToken(accessToken);
  }

  return accessToken;
};

const ContentTypeJsonHeaders = Object.freeze({
  "Content-Type": "application/json",
});

const appendAuthorization = async (headers) => {
  const accessToken = await login();
  headers ??= {};
  headers.Authorization = `Bearer ${accessToken}`;
  return headers;
};

const get = async (urlPath, { queryParams = {}, isPrivate }) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = queryString ? `${urlPath}?${queryString}` : urlPath;

  const headers = {};
  if (isPrivate) {
    await appendAuthorization(headers);
  }
  return request(url, { headers });
};

const post = async (urlPath, { body = {}, isPrivate }) => {
  const headers = { ...ContentTypeJsonHeaders };
  if (isPrivate) {
    await appendAuthorization(headers);
  }

  return request(urlPath, {
    headers,
    method: requestMethod.POST,
    body: JSON.stringify(body),
  });
};

const patch = async (urlPath, { body = {}, isPrivate }) => {
  const headers = { ...ContentTypeJsonHeaders };
  if (isPrivate) {
    await appendAuthorization(headers);
  }
  return request(urlPath, {
    headers,
    method: requestMethod.PATCH,
    body: JSON.stringify(body),
  });
};

const remove = async (urlPath, { queryParams = {}, isPrivate }) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = queryString ? `${urlPath}?${queryString}` : urlPath;
  const headers = {};
  if (isPrivate) {
    await appendAuthorization(headers);
  }
  return request(url, {
    headers,
    method: requestMethod.DELETE,
  });
};

export const requester = {
  get,
  post,
  patch,
  remove,
};
