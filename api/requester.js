const API_BASE_URL = "http://localhost:3000";

const StatusCode = {
  Unknown: -1,
};

const RequestMethod = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

const request = async (path, options = {}) => {
  const uri = `${API_BASE_URL}${path}`;

  try {
    const response = await fetch(uri, options);

    const hasJsonData = response.headers
      .get("Content-Type")
      ?.includes("application/json");

    const data = hasJsonData ? await response.json() : await response.text();

    return {
      ok: response.ok,
      statusCode: response.status,
      data,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      statusCode: StatusCode.Unknown,
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
    method: RequestMethod.POST,
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
    method: RequestMethod.PATCH,
    body: JSON.stringify(body),
  });
};

const remove = (urlPath, queryParams = {}, options = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = queryString ? `${urlPath}?${queryString}` : urlPath;
  return request(url, {
    ...options,
    method: RequestMethod.DELETE,
  });
};

export const requester = {
  get,
  post,
  patch,
  remove,
};
