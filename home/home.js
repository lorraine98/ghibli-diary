import { fetchMovies } from "../api/movies.js";

const addTabClickEvent = () => {
  let isDiaryWritten = false;

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

    moviesList.innerHTML = movies.map((movie) => {
      const { id, title, posterUrl, diaryId } = movie;

      return `
          <li data-id="${id}">
            <a href="/detail?movie-id=${id}&diary-id=${diaryId}">
              <img src="${posterUrl}" alt="${title}"/>
            </a>
          </li>
        `;
    });
  };

  const fetchMoviesByDiaryWritten = async () => {
    const data = await fetchMovies(isDiaryWritten);
    renderMovies(data.movies);
  };

  const pushWithNewUrl = () => {
    const newUrl = `${window.location.pathname}?isDiaryWritten=${isDiaryWritten}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

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
  addTabClickEvent();
};

init();
