import { editDiary, getDiaries, postDiary } from "../api/diaries.js";
import { ConfirmMessages, ErrorMessages } from "../common/error-message.js";
import { QueryParamKeys, Routes } from "../common/routes.js";
import {
  loadWritingDiary,
  saveWritingDiary,
} from "../common/session-storage.js";
import { getSearchParamValue } from "../common/url-util.js";

const movieId = getSearchParamValue(QueryParamKeys.movieId);
const movieTitle = getSearchParamValue(QueryParamKeys.movieTitle);
const diaryId = getSearchParamValue(QueryParamKeys.diaryId);

const isEditMode = !!diaryId;

const renderMovieTitle = (movieTitle) => {
  const titleElement = document.querySelector(".title");
  titleElement.textContent = movieTitle;
};

const handlePostDiary = async (requestForm) => {
  const res = await postDiary(requestForm);

  if (!res.ok) {
    alert(ErrorMessages.failToPostDiary);
    return;
  }

  alert(ConfirmMessages.successToWriteDiary);
  window.location.replace(
    `${Routes.detail}?${QueryParamKeys.diaryId}=${res.data}`
  );
};

const handleEditDiary = async (requestForm) => {
  const res = await editDiary(diaryId, requestForm);

  if (!res.ok) {
    alert(ErrorMessages.failToEditDiary);
    return;
  }

  alert(ConfirmMessages.successToEditDiary);
  window.location.replace(
    `${Routes.detail}?${QueryParamKeys.diaryId}=${diaryId}`
  );
};

const bindFormEvents = () => {
  const writeForm = document.querySelector(".write-form");

  const handleChange = (e) => {
    if (isEditMode) {
      return;
    }

    const form = e.currentTarget;

    const contentTextarea = form.querySelector(".content");
    const checkedEvaluationRadio = form.querySelector(
      'input[name="evaluation"]:checked'
    );

    const requestForm = {
      evaluation: checkedEvaluationRadio.value,
      content: contentTextarea.value,
      movieId,
    };

    saveWritingDiary(requestForm);
  };

  writeForm.addEventListener("change", handleChange);
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
      alert(ErrorMessages.pleaseFillOutContent);
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
      alert(ErrorMessages.failToFetchDiary);
      return;
    }

    const { diary } = data;

    renderMovieTitle(diary.movie.title);
    document.querySelector(`input[value="${diary.evaluation}"]`).checked = true;
    document.querySelector(".content").value = diary.content;
  } else {
    renderMovieTitle(movieTitle);

    const writingFormData = loadWritingDiary(movieId);
    if (writingFormData) {
      document.querySelector(
        `input[value="${writingFormData.evaluation}"]`
      ).checked = true;
      document.querySelector(".content").value = writingFormData.content;
    }
  }

  bindButtonsEvent();
  bindFormEvents();
};

init();
