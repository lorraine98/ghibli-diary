import { deleteDiary, getDiaries } from "../api/diaries.js";
import { QueryParamKeys, Routes } from "../common/routes.js";

const getEvaluationText = (evaluation) => {
  switch (evaluation) {
    case "excellent":
      return "👍 최고에요";
    case "average":
      return "💪 무난해요";
    case "poor":
      return "👎 별로예요";
    default:
      return "평가없음";
  }
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDiaryId = () => {
  const diaryId = new URLSearchParams(window.location.search).get(
    QueryParamKeys.diaryId
  );
  return diaryId;
};

const renderDiary = (diary) => {
  const movieTitle = document.querySelector(".movie-title");
  movieTitle.textContent = diary.movie.title;

  const poster = document.querySelector(".poster");
  poster.src = diary.movie.posterUrl;

  const releaseDate = document.querySelector(".release-date");

  const releaseDateStr = formatDate(new Date(diary.movie.releaseDate));
  releaseDate.textContent = releaseDateStr;

  const rating = document.querySelector(".rating");
  rating.textContent = `⭐️ ${diary.movie.rating}`;

  const createdAt = document.querySelector(".created-at");
  const createdDateStr = formatDate(new Date(diary.createdAt));
  createdAt.textContent = createdDateStr;

  const evaluation = document.querySelector(".evaluation");
  const evaluationText = getEvaluationText(diary.evaluation);
  evaluation.textContent = evaluationText;

  const content = document.querySelector(".content");
  content.textContent = diary.content;
};

const fetchDiary = async () => {
  const id = getDiaryId();
  const { data, ok } = await getDiaries(id);

  if (!ok) {
    console.error("failed to fetch diary");
    return;
  }

  renderDiary(data.diary);
};

const bindButtonsEvent = () => {
  const editButton = document.querySelector(".edit-button");
  const deleteButton = document.querySelector(".delete-button");
  const dialog = document.querySelector(".delete-dialog");

  editButton.addEventListener("click", () => {
    //todo: edit button event
    // window.location.href = `${Routes.write}?${QueryParamKeys.diaryId}=${id}`;
  });

  deleteButton.addEventListener("click", () => {
    dialog.showModal();
  });

  dialog
    .querySelector(".delete-cancel-button")
    .addEventListener("click", () => {
      dialog.close();
    });

  const handleDeleteConfirmBtnClick = async () => {
    const id = getDiaryId();
    const result = await deleteDiary(id);
    if (result.ok) {
      window.location.replace(Routes.home);
    } else {
      alert("일기 삭제에 실패했어요. 다시 시도해주세요.");
    }
  };

  dialog
    .querySelector(".delete-confirm-button")
    .addEventListener("click", handleDeleteConfirmBtnClick);
};

const init = () => {
  fetchDiary();
  bindButtonsEvent();
};

init();
