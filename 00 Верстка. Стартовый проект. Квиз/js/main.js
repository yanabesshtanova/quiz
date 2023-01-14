//движение вперед
let buttonNext = document.querySelectorAll('[data-nav="next"]');

buttonNext.forEach(function (button) {
  button.addEventListener("click", function () {
    let thisCard = this.closest("[data-card]");
    let thisCardNumber = parseInt(thisCard.dataset.card);
    if (thisCard.dataset.validate == "novalidate") {
      navigate("next", thisCard);
      upDateProgressBar("next", thisCardNumber);
    } else {
      saveAnswer(thisCardNumber, gatherCardDate(thisCardNumber));

      // валидация на заполненность
      if (isFillder(thisCardNumber) && checkOnRequired(thisCardNumber)) {
        navigate("next", thisCard);
        upDateProgressBar("next", thisCardNumber);
      } else {
        alert("Выберите ответ,прежде чем переходить далее ");
      }
    }
  });
});
// движение назад
let buttonPrev = document.querySelectorAll('[data-nav="prev"]');

buttonPrev.forEach(function (button) {
  button.addEventListener("click", function () {
    let thisCard = this.closest("[data-card]");
    let thisCardNumber = parseInt(thisCard.dataset.card);

    navigate("prev", thisCard);
    upDateProgressBar("prev", thisCardNumber);
  });
});
// функция для навыгации вперед назад
function navigate(direction, thisCard) {
  let thisCardNumber = parseInt(thisCard.dataset.card);
  let nextCard;

  if (direction == "next") {
    nextCard = thisCardNumber + 1;
  } else if (direction == "prev") {
    nextCard = thisCardNumber - 1;
  }

  thisCard.classList.add("hidden");
  document
    .querySelector(`[data-card="${nextCard}"]`)
    .classList.remove("hidden");
}

// обьект с сохраненными ответами
let answers = {
  2: null,
  3: null,
  4: null,
  5: null,
};

// функция для сбора данных

function gatherCardDate(number) {
  let question;
  let result = [];
  //находим карту по номеру и дата атрибуту
  let currentCard = document.querySelector(`[data-card="${number}"]`);

  question = currentCard.querySelector("[data-question]").innerHTML;

  // находим все заполненые значения радио кнопок
  let radioValues = currentCard.querySelectorAll('[type = "radio"]');

  radioValues.forEach(function (item) {
    if (item.checked) {
      result.push({
        name: item.name,
        value: item.value,
      });
    }
  });

  let data = {
    question: question,
    answer: result,
  };

  //находим все заполненые значения чекбоксов
  let checkboxValues = currentCard.querySelectorAll('[type = "checkbox"]');
  checkboxValues.forEach(function (item) {
    if (item.checked) {
      result.push({
        name: item.name,
        value: item.value,
      });
    }
  });

  let inputValues = currentCard.querySelectorAll(
    '[type="email"],[type="text"],[type="number"]'
  );
  inputValues.forEach(function (item) {
    itemValue = item.value;
    if (itemValue.trim() != "") {
      result.push({
        name: item.name,
        value: item.value,
      });
    }
  });

  return data;
}

// функция с записью ответов в обьект с ответами
function saveAnswer(number, data) {
  answers[number] = data;
}

// функция поверки на заполненость
function isFillder(number) {
  if (answers[number].answer.length > 0) {
    return true;
  } else {
    return false;
  }
}

// ф-я для проверки email
function validateEmail(email) {
  let pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
  return pattern.test(email);
}
// проверка на заполненость емайл и галочка
function checkOnRequired(number) {
  let currentCard = document.querySelector(`[data-card="${number}"]`);
  let requiredFields = currentCard.querySelectorAll("[required]");

  let isValidArray = [];

  requiredFields.forEach(function (item) {
    if (item.type == "checkbox" && item.checked == false) {
      isValidArray.push(false);
    } else if (item.type == "email") {
      if (validateEmail(item.value)) {
        isValidArray.push(true);
      } else {
        isValidArray.push(false);
      }
    }
  });
  if (isValidArray.indexOf(false) == -1) {
    return true;
  } else {
    return false;
  }
}
// подсвечиваем выбраную кнопку у радио блоков
document.querySelectorAll(".radio-group").forEach(function (item) {
  item.addEventListener("click", function (e) {
    let label = e.target.closest("label");
    if (label) {
      label
        .closest(".radio-group")
        .querySelectorAll("label")
        .forEach(function (item) {
          item.classList.remove("radio-block--active");
        });
      label.classList.add("radio-block--active");
    }
  });
});
// подсвечиваем выбраную кнопку у чекбоксов
document
  .querySelectorAll('label.checkbox-block input[type="checkbox"]')
  .forEach(function (item) {
    item.addEventListener("change", function () {
      if (item.checked) {
        item.closest("label").classList.add("checkbox-block--active");
      } else {
        item.closest("label").classList.remove("checkbox-block--active");
      }
    });
  });

//отображение прогресс бара
function upDateProgressBar(direction, cardNumber) {
  // расчет всего колличества карточек
  let cardsTotalNumber = document.querySelectorAll("[data-card]").length;

  // проверка направления перемещения
  if (direction == "next") {
    cardNumber = cardNumber + 1;
  } else if (direction == "prev") {
    cardNumber = cardNumber - 1;
  }

  //расчет процента прохождение
  let progress = (cardNumber * 100) / cardsTotalNumber;
  progress = progress.toFixed();

  let currentCard = document.querySelector(`[data-card="${cardNumber}"]`);

  let progressBar = document
    .querySelector(`[data-card="${cardNumber}"]`)
    .querySelector(".progress");
  if (progressBar != null) {
    currentCard.querySelector(
      ".progress__label strong"
    ).innerText = `${progress}%`;
    currentCard.querySelector(
      ".progress__line-bar"
    ).style = `width:${progress}%`;
  }
}
