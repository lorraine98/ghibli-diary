import { getAccessToken, saveAccessToken } from "../common/auth-storage.js";

export const login = async () => {
  let accessToken = getAccessToken();

  if (!accessToken) {
    const { data, ok } = await post("/api/v1/auth/login");

    if (!ok) {
      console.error(errorMessage.failToLogin);
      return;
    }
    accessToken = data.accessToken;
    saveAccessToken(accessToken);
  }

  return accessToken;
};
