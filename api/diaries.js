import { privateRequester } from "./private-requester.js";

export const getDiary = async (id) => {
  const result = await privateRequester.get(`/api/v1/diaries/${id}`);
  return result;
};

export const postDiary = async (diary) => {
  const result = await privateRequester.post("/api/v1/diaries", diary);
  return result;
};

export const editDiary = async (id, diary) => {
  const result = await privateRequester.patch(`/api/v1/diaries/${id}`, diary);
  return result;
};

export const deleteDiary = async (id) => {
  const result = await privateRequester.remove(`/api/v1/diaries/${id}`);
  return result;
};
