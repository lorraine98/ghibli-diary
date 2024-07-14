import { editDiary, getDiary, postDiary } from "../api/diaries.js";
import { confirmMessage, errorMessage } from "../common/error-message.js";
import { queryParamKeys, routes } from "../common/routes.js";
import {
  loadWritingDiary,
  saveWritingDiary,
} from "../common/session-storage.js";
import { getSearchParamValue } from "../common/url-util.js";

const movieId = getSearchParamValue(queryParamKeys.MOVIE_ID);
const movieTitle = getSearchParamValue(queryParamKeys.MOVIE_TITLE);
const diaryId = getSearchParamValue(queryParamKeys.DIARY_ID);

const isEditMode = !!diaryId;

const renderMovieTitle = (movieTitle) => {
  const titleElement = document.querySelector(".title");
  titleElement.textContent = movieTitle;
};

const handlePostDiary = async (requestForm) => {
  const res = await postDiary(requestForm);

  if (!res.ok) {
    alert(errorMessage.failToPostDiary);
    return;
  }

  alert(confirmMessage.successToWriteDiary);
  window.location.replace(
    `${routes.DETAIL}?${queryParamKeys.DIARY_ID}=${res.data}`
  );
};

const handleEditDiary = async (requestForm) => {
  const res = await editDiary(diaryId, requestForm);

  if (!res.ok) {
    alert(errorMessage.failToEditDiary);
    return;
  }

  alert(confirmMessage.successToEditDiary);
  window.location.replace(
    `${routes.DETAIL}?${queryParamKeys.DIARY_ID}=${diaryId}`
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
      ? `${routes.DETAIL}?${queryParamKeys.DIARY_ID}=${diaryId}`
      : routes.HOME;
    window.location.href = to;
  });

  submitButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const contentTextarea = document.querySelector(".content");
    const checkedEvaluationRadio = document.querySelector(
      'input[name="evaluation"]:checked'
    );

    if (!contentTextarea.checkValidity()) {
      alert(errorMessage.pleaseFillOutContent);
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
    const { data, ok } = await getDiary(diaryId);

    if (!ok) {
      alert(errorMessage.failToFetchDiary);
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
