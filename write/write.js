import { postDiary } from "../api/diaries.js";
import { QueryParamKeys, Routes } from "../common/routes.js";

const addButtonsEvent = () => {
  const cancelButton = document.querySelector(".cancel-button");
  const submitButton = document.querySelector(".submit-button");

  cancelButton.addEventListener("click", () => {
    window.history.back();
  });

  submitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const movieId = new URLSearchParams(window.location.search).get(
      QueryParamKeys.movieId
    );
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

    alert("일기를 작성했어요");
    window.location.href = `${Routes.detail}?${QueryParamKeys.movieId}=${movieId}`;
  });
};

const init = () => {
  addButtonsEvent();
};

init();
