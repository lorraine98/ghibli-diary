import { fetchMovies } from "../api/movies.js";
import { QueryParamKeys, Routes } from "../common/routes.js";

const queryParams = new URLSearchParams(window.location.search);
let isDiaryWritten = queryParams.get(QueryParamKeys.isDiaryWritten) === "true";

const renderMovies = (movies) => {
  const moviesList = document.querySelector(".movies-list");
  if (movies.length === 0) {
    moviesList.textContent = "";
    const li = document.createElement("li");

    isDiaryWritten
      ? (li.textContent = "아직 기록한 작품이 없어요")
      : (li.textContent = "모든 작품을 기록했어요");

    moviesList.appendChild(li);
    return;
  }

  moviesList.textContent = "";

  movies.forEach((movie) => {
    const { id, title, posterUrl, diaryId } = movie;

    const href = diaryId
      ? `${Routes.detail}?${QueryParamKeys.movieId}=${id}&${QueryParamKeys.diaryId}=${diaryId}`
      : `${Routes.write}?${QueryParamKeys.movieId}=${id}`;

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.setAttribute("href", href);

    const img = document.createElement("img");
    img.setAttribute("src", posterUrl);
    img.setAttribute("alt", title);
    img.setAttribute("width", "200px");

    const p = document.createElement("p");
    p.textContent = title;

    a.appendChild(img);
    a.appendChild(p);
    li.appendChild(a);
    moviesList.appendChild(li);
  });
};

const pushWithNewUrl = () => {
  // `${Routes.home}?${QueryParamKeys.isDiaryWritten}=${isDiaryWritten}`
  const uriBuilder = new URL(window.location.href);
  uriBuilder.search = `?${QueryParamKeys.isDiaryWritten}=${isDiaryWritten}`;
  const newUrl = uriBuilder.href;
  window.history.pushState({ path: newUrl }, "", newUrl);
};

const fetchMoviesByDiaryWritten = async () => {
  const{ data} = await fetchMovies(isDiaryWritten);
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
