const ACCESS_TOKEN_KEY = "accessToken";

let cachedAccessToken = "";

export const getAccessToken = () => {
  if (cachedAccessToken) {
    return cachedAccessToken;
  }
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) ?? "";
  cachedAccessToken = accessToken;
  return accessToken;
};

export const saveAccessToken = (accessToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  cachedAccessToken = accessToken;
};
