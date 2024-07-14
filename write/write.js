import { editDiary, getDiary, postDiary } from "../api/diaries.js";
import { confirmMessage, errorMessage } from "../common/error-message.js";
import { queryParamKeys, routes } from "../common/routes.js";
import {
  deleteWritingDiary,
  loadWritingDiary,
  saveWritingDiary,
} from "../common/session-storage.js";
import { getSearchParamValue } from "../common/url-util.js";

const movieId = getSearchParamValue(queryParamKeys.MOVIE_ID);
const movieTitle = getSearchParamValue(queryParamKeys.MOVIE_TITLE);
const diaryId = getSearchParamValue(queryParamKeys.DIARY_ID);

const isEditMode = !!diaryId;

const renderMovieTitle = (title) => {
  const $title = document.querySelector(".title");
  $title.textContent = title;
};

const handlePostDiary = async (requestForm) => {
  const { ok, data } = await postDiary(requestForm);
  if (!ok) {
    alert(errorMessage.failToPostDiary);
    return;
  }
  alert(confirmMessage.successToWriteDiary);

  deleteWritingDiary(data.movieId);
  window.location.replace(
    `${routes.DETAIL}?${queryParamKeys.DIARY_ID}=${data.id}`
  );
};

const handleEditDiary = async (requestForm) => {
  const { ok } = await editDiary(diaryId, requestForm);
  if (!ok) {
    alert(errorMessage.failToEditDiary);
    return;
  }
  alert(confirmMessage.successToEditDiary);
  window.location.replace(
    `${routes.DETAIL}?${queryParamKeys.DIARY_ID}=${diaryId}`
  );
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const $content = document.querySelector(".content");
  const $checkedEvaluation = document.querySelector(
    'input[name="evaluation"]:checked'
  );

  if (!$content.checkValidity()) {
    alert(errorMessage.pleaseFillOutContent);
    return;
  }

  const requestForm = {
    evaluation: $checkedEvaluation.value,
    content: $content.value,
    movieId,
  };

  isEditMode ? handleEditDiary(requestForm) : handlePostDiary(requestForm);
};

const handleCancel = () => {
  const to = isEditMode
    ? `${routes.DETAIL}?${queryParamKeys.DIARY_ID}=${diaryId}`
    : routes.HOME;
  window.location.href = to;
};

const handleChange = (e) => {
  if (isEditMode) {
    // 수정 모드에서는 임시 저장하지 않음
    return;
  }

  const form = e.currentTarget;
  const $content = form.querySelector(".content");
  const $checkedEvaluation = form.querySelector(
    'input[name="evaluation"]:checked'
  );
  const requestForm = {
    evaluation: $checkedEvaluation.value,
    content: $content.value,
    movieId,
  };
  saveWritingDiary(requestForm);
};

const bindEvents = () => {
  const $writeForm = document.querySelector(".write-form");
  const $cancelBtn = document.querySelector(".cancel-button");
  const $submitBtn = document.querySelector(".submit-button");

  $writeForm.addEventListener("change", handleChange);
  $cancelBtn.addEventListener("click", handleCancel);
  $submitBtn.addEventListener("click", handleSubmit);
};

const fetchFormData = async () => {
  if (isEditMode) {
    const { data, ok } = await getDiary(diaryId);
    if (!ok) {
      alert(errorMessage.failToFetchDiary);
      return;
    }
    return data.diary;
  }

  const writingFormData = loadWritingDiary(movieId);
  return writingFormData;
};

const fillOutForm = (diary) => {
  document.querySelector(`input[value="${diary.evaluation}"]`).checked = true;
  document.querySelector(".content").value = diary.content;
};

const fetchAndFillOutForm = async () => {
  const formData = await fetchFormData();
  if (formData) {
    fillOutForm(formData);
  }
};

const init = () => {
  renderMovieTitle(movieTitle);
  bindEvents();
  fetchAndFillOutForm();
};

init();
