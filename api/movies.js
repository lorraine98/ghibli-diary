import { privateRequester } from "./private-requester.js";

export const fetchMovies = async (isDiaryWritten = false) => {
  const result = await privateRequester.get("/api/v1/movies", { isDiaryWritten });
  return result;
};
