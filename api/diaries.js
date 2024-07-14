import { privateRequester } from "./private-requester.js";

export const getDiaries = async (id) => {
  const result = await privateRequester.get(`/api/v1/diaries/${id}`);
  return result;
};

export const postDiary = async (diary) => {
  const result = await privateRequester.post("/api/v1/diaries", diary);
  return result;
};
