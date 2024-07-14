const API_BASE_URL = "http://localhost:3000/api/v1";

const get = async (path, query) => {
  try {
    const url = query
      ? `${API_BASE_URL}${path}${query}`
      : `${API_BASE_URL}${path}`;

    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error(error);
  }
};

export { get };
