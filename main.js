(() => {
  const restart = document.querySelector(".restart");
  const game = document.querySelector(".game");
  const difficultSelect = document.querySelector(".difficult-select");
  const cardsNumbers = [];
  const timer = document.querySelector(".timer");
  const modalOverlay = document.querySelector(".modals");
  const modalWindow = document.querySelector(".modals__window");
  const modalSpan = document.querySelector(".modals__span");
  let firstCard = null;
  let secondCard = null;
  let timerId;
  let intervalId;

  function createNumbersArray(count) {
    const arr = [];
    for (let i = 1; i <= count; i++) {
      arr.push(i, i);
    }
    for (let i = 0; i < arr.length; i++) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function showModalWindow(btn, text) {
    modalWindow.append(btn);
    modalSpan.textContent = text;
    modalOverlay.classList.add("modals_visible");
    modalWindow.classList.add("modals__window_visible");
  }

  function removeModalWindow(btn) {
    restart.append(btn);
    modalOverlay.classList.remove("modals_visible");
    modalWindow.classList.remove("modals__window_visible");
  }

  function restartGame() {
    clearInterval(intervalId);
    cardsNumbers.length = 0;
    restart.innerHTML = "";
    timer.innerHTML = "";
    game.innerHTML = "";
    firstCard = null;
    secondCard = null;
    game.classList.remove("game_visible");
    restart.classList.remove("restart_visible");
    timer.classList.remove("timer_visible");
    modalOverlay.classList.remove("modals_visible");
    modalWindow.classList.remove("modals__window_visible");
  }

  function countdownTimer(span, cb) {
    let seconds = span.textContent;
    intervalId = setInterval(() => {
      span.textContent = --seconds;
      if (span.textContent <= 10) {
        span.style.color = "red";
      }
      if (span.textContent == 0) {
        clearInterval(intervalId);
        cb();
      }
    }, 1000);
  }

  function createGame() {
    restartGame();

    const difTitle = document.createElement("h1");
    difTitle.textContent = "Difficulty selection";
    difTitle.classList.add("difficult-select__title");
    difficultSelect.append(difTitle);

    const createDifficultBtn = (difficult, title) => {
      const btnDifficult = document.createElement("button");
      btnDifficult.textContent = title;
      btnDifficult.classList.add("difficult-select__btn");

      btnDifficult.addEventListener("click", () => {
        difficultSelect.innerHTML = "";
        game.innerHTML = "";
        restart.classList.add("restart_visible");
        const cards = createNumbersArray(difficult);
        const btnRestart = document.createElement("button");
        const gameTimer = document.createElement("span");

        btnRestart.textContent = "Restart";
        btnRestart.classList.add("restart__btn");
        restart.append(btnRestart);
        gameTimer.textContent = 60;
        gameTimer.classList.add("timer__span");
        timer.append(gameTimer);
        timer.classList.add("timer_visible");
        countdownTimer(gameTimer, () => {
          showModalWindow(btnRestart, "You lose :(");
        });

        btnRestart.addEventListener("click", () => {
          removeModalWindow(btnRestart);
          createGame();
        });

        cards.forEach((cardNumber) => {
          const card = document.createElement("div");
          card.textContent = cardNumber;
          card.classList.add("game__card");
          game.classList.add("game_visible");

          if (btnDifficult.textContent == "Easy") {
            card.classList.add("game__card_easy");
          } else if (btnDifficult.textContent == "Medium") {
            card.classList.add("game__card_medium");
          } else if (btnDifficult.textContent == "Hard") {
            card.classList.add("game__card_hard");
          }

          game.append(card);
          cardsNumbers.push(cardNumber);

          card.addEventListener("click", () => {
            if (
              card.classList.contains("game__card_check") ||
              card.classList.contains("game__card_correct")
            ) {
              return;
            }

            clearTimeout(timerId);

            if (firstCard !== null && secondCard !== null) {
              firstCard.classList.remove("game__card_check");
              secondCard.classList.remove("game__card_check");
              firstCard = null;
              secondCard = null;
            }

            card.classList.add("game__card_check");
            if (firstCard == null) {
              firstCard = card;
            } else {
              secondCard = card;
            }

            if (firstCard !== null && secondCard !== null) {
              let firstCardNum = firstCard.textContent;
              let secondCardNum = secondCard.textContent;
              if (firstCardNum == secondCardNum) {
                firstCard.classList.add("game__card_correct");
                secondCard.classList.add("game__card_correct");
              } else {
                timerId = setTimeout(() => {
                  firstCard.classList.remove("game__card_check");
                  secondCard.classList.remove("game__card_check");
                }, 500);
              }
            }

            if (
              cardsNumbers.length ==
              document.querySelectorAll(".game__card_correct").length
            ) {
              timerId = setTimeout(() => {
                showModalWindow(btnRestart, "You win :)");
                clearInterval(intervalId);
              }, 500);
            }
          });
        });
      });
      return btnDifficult;
    };

    difficultSelect.append(
      createDifficultBtn(6, "Easy"),
      createDifficultBtn(8, "Medium"),
      createDifficultBtn(10, "Hard")
    );
  }

  createGame();
})();
