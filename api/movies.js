import { get } from "./requester.js";

export const fetchMovies = async (isDiaryWritten = false) => {
  return await get(`/movies?isDiaryWritten=${isDiaryWritten}`);
};
