const loadFromSessionStorage = (key) => {
  const item = sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

const saveToSessionStorage = (key, value) => {
  if (typeof value !== "string") {
    value = JSON.stringify(value);
  }
  sessionStorage.setItem(key, value);
};

const WRITING_MOVIE_KEY = "WRITING_MOVIE";

export const loadWritingMovie = () => {
  return loadFromSessionStorage(WRITING_MOVIE_KEY);
};

/**
 * @param {{ id: string, title: string }} movie
 */
export const saveWritingMovie = (movie) => {
  saveToSessionStorage(WRITING_MOVIE_KEY, movie);
};
