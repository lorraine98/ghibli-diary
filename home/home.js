import { fetchMovies } from "../api/movies.js";
import { QueryParamKeys, Routes } from "../common/routes.js";
import { getSearchParamValue } from "../common/url-util.js";

const renderMovies = (movies, isDiaryWritten) => {
  const moviesList = document.querySelector(".movies-list");
  if (movies.length === 0) {
    while (moviesList.firstChild) {
      moviesList.removeChild(moviesList.firstChild);
    }
    const li = document.createElement("li");

    isDiaryWritten
      ? (li.textContent = "아직 기록한 작품이 없어요")
      : (li.textContent = "모든 작품을 기록했어요");

    moviesList.appendChild(li);
    return;
  }

  while (moviesList.firstChild) {
    moviesList.removeChild(moviesList.firstChild);
  }

  movies.forEach((movie) => {
    const { id, title, posterUrl, diaryId } = movie;

    const href = diaryId
      ? `${Routes.detail}?${QueryParamKeys.diaryId}=${diaryId}`
      : `${Routes.write}?${QueryParamKeys.movieId}=${id}&${QueryParamKeys.movieTitle}=${title}`;

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.setAttribute("href", href);
    a.classList.add("movie-title");

    const img = document.createElement("img");
    img.setAttribute("src", posterUrl);
    img.setAttribute("alt", title);
    img.classList.add("poster");

    const p = document.createElement("p");
    p.textContent = title;

    a.appendChild(img);
    a.appendChild(p);
    li.appendChild(a);
    moviesList.appendChild(li);
  });
};

const pushWithNewUrl = (isDiaryWritten) => {
  const newUrl = `${Routes.home}?${QueryParamKeys.isDiaryWritten}=${isDiaryWritten}`;
  window.history.pushState({ path: newUrl }, "", newUrl);
};

const fetchMoviesByDiaryWritten = async (isDiaryWritten) => {
  const { data, ok, error } = await fetchMovies(isDiaryWritten);
  if (!ok) {
    console.error(error);
    return [];
  }
  return data.movies;
};

const bindTabClickEvent = () => {
  const handleTabClick = async (event) => {
    const tab = event.target.closest(".tab");
    const isDiaryWritten = tab.getAttribute("data-diary-written") === "true";
    activateTab(isDiaryWritten);

    pushWithNewUrl(isDiaryWritten);
    const movies = await fetchMoviesByDiaryWritten(isDiaryWritten);
    renderMovies(movies, isDiaryWritten);
  };

  const tabContainer = document.querySelector(".tab-container");
  tabContainer.addEventListener("click", handleTabClick);
};

const activateTab = (isDiaryWritten) => {
  const tabContainer = document.querySelector(".tab-container");
  const tabs = tabContainer.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.classList.remove("active");
    if (tab.getAttribute("data-diary-written") === String(isDiaryWritten)) {
      tab.classList.add("active");
    }
  });
};

const bindPopstateEvent = () => {
  const handlePopState = async () => {
    const isDiaryWritten =
      getSearchParamValue(QueryParamKeys.isDiaryWritten) === "true";
    activateTab(isDiaryWritten);
    const movies = await fetchMoviesByDiaryWritten(isDiaryWritten);
    renderMovies(movies, isDiaryWritten);
  };

  window.addEventListener("popstate", handlePopState);
};

const init = async () => {
  const isDiaryWritten =
    getSearchParamValue(QueryParamKeys.isDiaryWritten) === "true";

  pushWithNewUrl(isDiaryWritten);
  activateTab(isDiaryWritten);
  const movies = await fetchMoviesByDiaryWritten(isDiaryWritten);
  renderMovies(movies, isDiaryWritten);

  bindPopstateEvent();
  bindTabClickEvent();
};

init();
