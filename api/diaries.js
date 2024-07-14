import { post } from "./requester";

export const postDiary = async (diary) => {
  return await post("/diaries", diary);
};
