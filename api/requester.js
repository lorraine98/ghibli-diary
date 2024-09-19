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

const get = async (urlPath, queryParams = {}, options = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = queryString ? `${urlPath}?${queryString}` : urlPath;
  return request(url, options);
};

const post = (urlPath, body = {}, options = {}) => {
  options.headers ??= {};
  options.headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  return request(urlPath, {
    ...options,
    method: requestMethod.POST,
    body: JSON.stringify(body),
  });
};

const patch = (urlPath, body = {}, options = {}) => {
  options.headers ??= {};
  options.headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  return request(urlPath, {
    ...options,
    method: requestMethod.PATCH,
    body: JSON.stringify(body),
  });
};

const remove = (urlPath, queryParams = {}, options = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = queryString ? `${urlPath}?${queryString}` : urlPath;
  return request(url, {
    ...options,
    method: requestMethod.DELETE,
  });
};

export const requester = {
  get,
  post,
  patch,
  remove,
};
