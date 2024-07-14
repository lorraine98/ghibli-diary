import { post } from "./requester.js";

export const postDiary = async (diary) => {
  return await post("/diaries", diary);
};
