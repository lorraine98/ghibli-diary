let cachedSearch = null;
let cachedUrlSearchParams = null;

export const getSearchParamValue = (key) => {
  const { search } = window.location;

  if (search !== cachedSearch) {
    cachedUrlSearchParams = new URLSearchParams(search);
    cachedSearch = search;
  }

  const paramValue = cachedUrlSearchParams.get(key);
  return paramValue;
};
