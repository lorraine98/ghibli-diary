import { editDiary, getDiaries, postDiary } from "../api/diaries.js";
import { QueryParamKeys, Routes } from "../common/routes.js";

const urlSearchParams = new URLSearchParams(window.location.search);
const movieId = urlSearchParams.get(QueryParamKeys.movieId);
const movieTitle = urlSearchParams.get(QueryParamKeys.movieTitle);

const diaryId = urlSearchParams.get(QueryParamKeys.diaryId);
const isEditMode = !!diaryId;

const renderMovieTitle = (movieTitle) => {
  const titleElement = document.querySelector(".title");
  titleElement.textContent = movieTitle;
};

const handlePostDiary = async (requestForm) => {
  const res = await postDiary(requestForm);

  if (!res.ok) {
    alert("일기 작성에 실패했어요");
    return;
  }

  alert("일기를 작성했어요");
  window.location.replace(
    `${Routes.detail}?${QueryParamKeys.diaryId}=${res.data}`
  );
};

const handleEditDiary = async (requestForm) => {
  const res = await editDiary(diaryId, requestForm);

  if (!res.ok) {
    alert("일기 수정에 실패했어요");
    return;
  }

  alert("일기를 수정했어요");
  window.location.replace(
    `${Routes.detail}?${QueryParamKeys.diaryId}=${diaryId}`
  );
};

const bindButtonsEvent = () => {
  const cancelButton = document.querySelector(".cancel-button");
  const submitButton = document.querySelector(".submit-button");

  cancelButton.addEventListener("click", () => {
    const to = isEditMode
      ? `${Routes.detail}?${QueryParamKeys.diaryId}=${diaryId}`
      : Routes.home;
    window.location.href = to;
  });

  submitButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const contentTextarea = document.querySelector(".content");
    const checkedEvaluationRadio = document.querySelector(
      'input[name="evaluation"]:checked'
    );

    if (!contentTextarea.checkValidity()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const requestForm = {
      evaluation: checkedEvaluationRadio.value,
      content: contentTextarea.value,
      movieId,
    };

    isEditMode ? handleEditDiary(requestForm) : handlePostDiary(requestForm);
  });
};

const init = async () => {
  if (isEditMode) {
    const { data, ok } = await getDiaries(diaryId);

    if (!ok) {
      console.error("failed to fetch diary");
      return;
    }

    const { diary } = data;

    renderMovieTitle(diary.movie.title);
    document.querySelector(`input[value="${diary.evaluation}"]`).checked = true;
    document.querySelector(".content").value = diary.content;
  } else {
    renderMovieTitle(movieTitle);
  }

  bindButtonsEvent();
};

init();
