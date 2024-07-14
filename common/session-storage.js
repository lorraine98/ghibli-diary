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

/**
 * @param {{ id: string, title: string }} movie
 */
