const API_BASE_URL = "http://localhost:3000";

const StatusCode = {
  Unknown: -1,
};

const RequestMethod = {
  GET: "GET",
  POST: "POST",
};

const request = async (path, options = {}) => {
  const uri = `${API_BASE_URL}${path}`;
  const defaultOptions = {
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await fetch(uri, { ...defaultOptions, ...options });
    const data = await response.json();
    return {
      ok: response.ok,
      statusCode: response.status,
      data,
    };
  } catch (error) {
    console.error(error?.message);
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
  return request(urlPath, {
    method: RequestMethod.POST,
    body: JSON.stringify(body),
    options,
  });
};

export const requester = {
  get,
  post,
};
