import { postDiary } from "../api/diaries.js";
import { QueryParamKeys, Routes } from "../common/routes.js";
import {
  loadWritingMovie,
  removeWritingMovie,
} from "../common/session-storage.js";

let movieId;

const renderMovieTitle = (movieTitle) => {
  const titleElement = document.querySelector(".title");
  titleElement.textContent = movieTitle;
};

const getWritingMovie = () => {
  const writingMovie = loadWritingMovie();

  if (!writingMovie) {
    alert("잘못된 접근입니다.");
    window.location.href = Routes.home;
    return;
  }

  const { id, title } = writingMovie;

  movieId = id;
  renderMovieTitle(title);
};

const bindButtonsEvent = () => {
  const cancelButton = document.querySelector(".cancel-button");
  const submitButton = document.querySelector(".submit-button");

  cancelButton.addEventListener("click", () => {
    window.history.back();
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

    const res = await postDiary(requestForm);

    if (!res.ok) {
      alert("일기 작성에 실패했어요");
      return;
    }

    removeWritingMovie();
    alert("일기를 작성했어요");
    window.location.replace(
      `${Routes.detail}?${QueryParamKeys.diaryId}=${res.data.id}`
    );
  });
};

const init = () => {
  getWritingMovie();
  bindButtonsEvent();
};

init();
