import { getDiaries } from "../api/diaries.js";
import { QueryParamKeys } from "../common/routes.js";

// const {
//   content,
//   createdAt,
//   evaluation,
//   id: diaryId,
//   movie: { id: movieId, posterUrl, rating, releaseDate, title },
// } = data.diary;

const renderDiary = (diary) => {
  console.log(diary);
  const movieTitle = document.querySelector(".movie-title");
};

const fetchDiary = async () => {
  const id = new URLSearchParams(window.location.search).get(
    QueryParamKeys.diaryId
  );
  const { data, ok } = await getDiaries(id);

  if (!ok) {
    console.error("failed to fetch diary");
    return;
  }

  renderDiary(data.diary);
};

const init = () => {
  fetchDiary();
};

init();
