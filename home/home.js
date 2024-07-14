import { fetchMovies } from "../api/movies.js";
import { QueryParamKeys, Routes } from "../common/routes.js";

const queryParams = new URLSearchParams(window.location.search);
let isDiaryWritten = queryParams.get(QueryParamKeys.isDiaryWritten) === "true";

const renderMovies = (movies) => {
  const moviesList = document.querySelector(".movies-list");
  if (movies.length === 0) {
    moviesList.innerHTML = isDiaryWritten
      ? `
        <li>아직 기록한 작품이 없어요</li>
      `
      : `
        <li>모든 작품을 기록했어요</li>
      `;
    return;
  }

  moviesList.innerHTML = movies
    .map((movie) => {
      const { id, title, posterUrl, diaryId } = movie;

      // todo : session storage에 제목 저장하기
      const href = diaryId
        ? `${Routes.detail}?movie-id=${id}&diary-id=${diaryId}`
        : `${Routes.write}?movie-id=${id}`;

      return `
          <li>
            <a href="${href}">
              <img width="200px" src="${posterUrl}" alt="${title}" />
              <p>${title}</p>
            </a>
          </li>
        `;
    })
    .join("");
};

const pushWithNewUrl = () => {
  const uriBuilder = new URL(window.location.href);
  uriBuilder.search = `?${QueryParamKeys.isDiaryWritten}=${isDiaryWritten}`;
  const newUrl = uriBuilder.href;
  window.history.pushState({ path: newUrl }, "", newUrl);
};

const fetchMoviesByDiaryWritten = async () => {
  const data = await fetchMovies(isDiaryWritten);
  renderMovies(data.movies);
};

const addTabClickEvent = () => {
  const handleTabClick = (event) => {
    isDiaryWritten = event.target.getAttribute("data-diary-written");

    pushWithNewUrl();
    fetchMoviesByDiaryWritten();
  };

  const tabButtons = document.querySelectorAll(".tab");

  tabButtons.forEach((link) => {
    link.addEventListener("click", handleTabClick);
  });
};

const init = () => {
  pushWithNewUrl();
  fetchMoviesByDiaryWritten();
  addTabClickEvent();
};

init();
