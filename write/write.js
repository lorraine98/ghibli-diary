import { postDiary } from "../api/diaries.js";

const addButtonsEvent = () => {
  const cancelButton = document.querySelector(".cancel-button");
  const submitButton = document.querySelector(".submit-button");

  cancelButton.addEventListener("click", () => {
    window.history.back();
  });

  submitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const movieId = new URLSearchParams(window.location.search).get("movie-id");
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

    postDiary(requestForm);
    alert("일기를 작성했어요");
    window.location.href = "/home/?isDiaryWritten=true";
  });
};

const init = () => {
  addButtonsEvent();
};

init();
