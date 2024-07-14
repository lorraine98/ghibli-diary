import { requester } from "./requester.js";

export const login = async (accessToken) => {
  const result = await requester.post("/api/v1/auth/login", { accessToken });
  return result;
};
