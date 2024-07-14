import { fetchMovies } from "../api/movies.js";
import { errorMessage } from "../common/error-message.js";
import { queryParamKeys, routes } from "../common/routes.js";
import { getSearchParamValue } from "../common/url-util.js";

const renderMovieElements = (movies, isDiaryWritten) => {
  const $movieContainer = document.querySelector(".movie-list");

  if (movies.length === 0) {
    const $movie = document.createElement("li");
    isDiaryWritten
      ? ($movie.textContent = "아직 기록한 작품이 없어요")
      : ($movie.textContent = "모든 작품을 기록했어요");
    $movieContainer.replaceChildren($movie);
    return;
  }

  const $newMovies = movies.map(createMovieElement);
  $movieContainer.replaceChildren(...$newMovies);
};

const createMovieElement = (movie) => {
  const { id, title, posterUrl, diaryId } = movie;

  const href = diaryId
    ? `${routes.DETAIL}?${queryParamKeys.DIARY_ID}=${diaryId}`
    : `${routes.WRITE}?${queryParamKeys.MOVIE_ID}=${id}&${queryParamKeys.MOVIE_TITLE}=${title}`;

  const $movie = document.createElement("li");

  const $link = document.createElement("a");
  $link.setAttribute("href", href);
  $link.classList.add("movie-link");

  const $poster = document.createElement("img");
  $poster.setAttribute("src", posterUrl);
  $poster.setAttribute("alt", title);
  $poster.classList.add("poster");

  const $title = document.createElement("span");
  $title.textContent = title;

  $link.appendChild($poster);
  $link.appendChild($title);

  $movie.appendChild($link);
  return $movie;
};

const fetchMoviesByDiaryWritten = async (isDiaryWritten) => {
  const { data, ok } = await fetchMovies(isDiaryWritten);
  if (!ok) {
    alert(errorMessage.failToFetchMovies);
    return [];
  }
  return data.movies;
};

const handleTabClick = async (event) => {
  const $tab = event.target.closest(".tab");
  const isDiaryWritten = $tab.getAttribute("data-diary-written") === "true";
  activateTab(isDiaryWritten);

  const movies = await fetchMoviesByDiaryWritten(isDiaryWritten);
  renderMovieElements(movies, isDiaryWritten);
};

const bindTabClickEvent = () => {
  const $tabContainer = document.querySelector(".tab-container");
  $tabContainer.addEventListener("click", handleTabClick);
};

const activateTab = (isDiaryWritten) => {
  const $tabContainer = document.querySelector(".tab-container");
  const $tabs = $tabContainer.querySelectorAll(".tab");
  $tabs.forEach(($tab) => {
    const isActive =
      $tab.getAttribute("data-diary-written") === String(isDiaryWritten);
    $tab.classList.toggle("active", isActive);
  });

  const newUrl = `${routes.HOME}?${queryParamKeys.IS_DIARY_WRITTEN}=${isDiaryWritten}`;
  window.history.pushState({}, "", newUrl);
};

const handlePopState = async () => {
  const isDiaryWritten =
    getSearchParamValue(queryParamKeys.IS_DIARY_WRITTEN) === "true";
  activateTab(isDiaryWritten);
  const movies = await fetchMoviesByDiaryWritten(isDiaryWritten);
  renderMovieElements(movies, isDiaryWritten);
};

const bindPopstateEvent = () => {
  window.addEventListener("popstate", handlePopState);
};

const init = async () => {
  const isDiaryWritten =
    getSearchParamValue(queryParamKeys.IS_DIARY_WRITTEN) === "true";

  activateTab(isDiaryWritten);
  const movies = await fetchMoviesByDiaryWritten(isDiaryWritten);
  renderMovieElements(movies, isDiaryWritten);

  bindPopstateEvent();
  bindTabClickEvent();
};

init();
