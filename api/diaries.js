import { privateRequester } from "./private-requester.js";

export const postDiary = async (diary) => {
  const result = await privateRequester.post("/api/v1/diaries", diary);
  return result;
};
