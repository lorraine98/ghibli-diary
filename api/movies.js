import { get } from "./requester.js";

export const fetchMovies = async () => {
  const data = await get("/movies");
  console.log(data);
};
