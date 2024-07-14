import { requester } from "./requester.js";

export const postDiary = async (diary) => {
  const result = await requester.post("/api/v1/diaries", diary);
  return result;
};
