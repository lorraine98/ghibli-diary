import { fetchMovies } from "../api/movies.js";
import { errorMessage } from "../common/error-message.js";
import { queryParamKeys, routes } from "../common/routes.js";
import { getSearchParamValue } from "../common/url-util.js";

const renderMovieElements = (movies, isDiaryWritten) => {
  const movieContainer = document.querySelector(".movie-list");

  if (movies.length === 0) {
    const movieElement = document.createElement("li");
    isDiaryWritten
      ? (movieElement.textContent = "아직 기록한 작품이 없어요")
      : (movieElement.textContent = "모든 작품을 기록했어요");
    movieContainer.replaceChildren(movieElement);
    return;
  }

  const newMovieElements = movies.map(createMovieElement);
  movieContainer.replaceChildren(...newMovieElements);
};

const createMovieElement = (movie) => {
  const { id, title, posterUrl, diaryId } = movie;

  const href = diaryId
    ? `${routes.DETAIL}?${queryParamKeys.DIARY_ID}=${diaryId}`
    : `${routes.WRITE}?${queryParamKeys.MOVIE_ID}=${id}&${queryParamKeys.MOVIE_TITLE}=${title}`;

  const movieElement = document.createElement("li");

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", href);
  linkElement.classList.add("movie-link");

  const posterElement = document.createElement("img");
  posterElement.setAttribute("src", posterUrl);
  posterElement.setAttribute("alt", title);
  posterElement.classList.add("poster");

  const titleElement = document.createElement("span");
  titleElement.textContent = title;

  linkElement.appendChild(posterElement);
  linkElement.appendChild(titleElement);

  movieElement.appendChild(linkElement);
  return movieElement;
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
  const tabElement = event.target.closest(".tab");
  const isDiaryWritten =
    tabElement.getAttribute("data-diary-written") === "true";
  activateTab(isDiaryWritten);

  const movies = await fetchMoviesByDiaryWritten(isDiaryWritten);
  renderMovieElements(movies, isDiaryWritten);
};

const bindTabClickEvent = () => {
  const tabContainer = document.querySelector(".tab-container");
  tabContainer.addEventListener("click", handleTabClick);
};

const activateTab = (isDiaryWritten) => {
  const tabContainer = document.querySelector(".tab-container");
  const tabElements = tabContainer.querySelectorAll(".tab");
  tabElements.forEach((tabElement) => {
    const isActive =
      tabElement.getAttribute("data-diary-written") === String(isDiaryWritten);
    tabElement.classList.toggle("active", isActive);
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
