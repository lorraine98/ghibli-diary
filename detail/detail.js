import { deleteDiary, getDiary } from "../api/diaries.js";
import { errorMessage } from "../common/error-message.js";
import { queryParamKeys, routes } from "../common/routes.js";

const getEvaluationText = (evaluation) => {
  switch (evaluation) {
    case "excellent":
      return "👍 최고예요";
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
    queryParamKeys.DIARY_ID
  );
  return diaryId;
};

const renderDiary = (diary) => {
  const $movieTitle = document.querySelector(".movie-title");
  $movieTitle.textContent = diary.movie.title;

  const $poster = document.querySelector(".poster");
  $poster.src = diary.movie.posterUrl;

  const $releaseDate = document.querySelector(".release-date");

  const releaseDateStr = formatDate(new Date(diary.movie.releaseDate));
  $releaseDate.textContent = releaseDateStr;

  const $rating = document.querySelector(".rating");
  $rating.textContent = `⭐️ ${diary.movie.rating}`;

  const $createdAt = document.querySelector(".created-at");
  const createdDateStr = formatDate(new Date(diary.createdAt));
  $createdAt.textContent = createdDateStr;

  const $evaluation = document.querySelector(".evaluation");
  const evaluationText = getEvaluationText(diary.evaluation);
  $evaluation.textContent = evaluationText;

  const $content = document.querySelector(".content");
  $content.textContent = diary.content;
};

const fetchAndRenderDiary = async () => {
  const id = getDiaryId();
  const { data, ok } = await getDiary(id);

  if (!ok) {
    alert(errorMessage.failToFetchDiary);
    return;
  }

  renderDiary(data.diary);
};

const handleDeleteConfirmBtnClick = async () => {
  const id = getDiaryId();
  const { ok } = await deleteDiary(id);
  if (ok) {
    window.location.replace(routes.HOME);
  } else {
    alert(errorMessage.failToDeleteDiary);
  }
};

const bindButtonsEvent = () => {
  const $editBtn = document.querySelector(".edit-button");
  const $deleteBtn = document.querySelector(".delete-button");
  const $deleteConfirmDialog = document.querySelector(".delete-dialog");

  $editBtn.addEventListener("click", () => {
    const id = getDiaryId();
    window.location.href = `${routes.WRITE}?${queryParamKeys.DIARY_ID}=${id}`;
  });

  $deleteBtn.addEventListener("click", () => {
    $deleteConfirmDialog.showModal();
  });

  $deleteConfirmDialog.addEventListener("click", (e) => {
    const $cancelBtn = e.target.closest(".delete-cancel-button");
    if ($cancelBtn) {
      $deleteConfirmDialog.close();
      return;
    }

    const $confirmBtn = e.target.closest(".delete-confirm-button");
    if ($confirmBtn) {
      handleDeleteConfirmBtnClick();
    }
  });
};

const init = () => {
  bindButtonsEvent();
  fetchAndRenderDiary();
};

init();
