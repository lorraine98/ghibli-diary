import { requester } from "./requester.js";

export const fetchMovies = async (isDiaryWritten = false) => {
  const result = await requester.get("/api/v1/movies", {
    queryParams: { isDiaryWritten },
    isPrivate: true,
  });
  return result;
};
