import { requester } from "./requester.js";

export const getDiary = async (id) => {
  const result = await requester.get(`/api/v1/diaries/${id}`, {
    isPrivate: true,
  });
  return result;
};

export const postDiary = async (diary) => {
  const result = await requester.post("/api/v1/diaries", {
    body: diary,
    isPrivate: true,
  });
  return result;
};

export const editDiary = async (id, diary) => {
  const result = await requester.patch(`/api/v1/diaries/${id}`, {
    body: diary,
    isPrivate: true,
  });
  return result;
};

export const deleteDiary = async (id) => {
  const result = await requester.remove(`/api/v1/diaries/${id}`, {
    isPrivate: true,
  });
  return result;
};
