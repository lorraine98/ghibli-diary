const loadFromSessionStorage = (key) => {
  console.assert(typeof key === "string", "key must be a string");
  const item = sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

const saveToSessionStorage = (key, value) => {
  if (typeof value !== "string") {
    value = JSON.stringify(value);
  }
  sessionStorage.setItem(key, value);
};

const writeDiaryPrefix = "diary-write:";
/**
 * @param {{ movieId: string, content: string, evaluation: string }}  formData
 */
export const saveWritingDiary = ({ movieId, ...rest }) => {
  saveToSessionStorage(`${writeDiaryPrefix}${movieId}`, rest);
};

/**
 * @param {string} movieId
 */
export const loadWritingDiary = (movieId) => {
  return loadFromSessionStorage(`${writeDiaryPrefix}${movieId}`);
};
