import Card from "./Card";
import Storage from "./Storage";

export default class CardController {
  constructor(board) {
    this.board = board;
    this.state = [];
  }

  init() {
    this.board.createBoard();
    this.container = document.querySelector("#container");

    this.onClickAddCard();
    this.addSubscribe(this.container);

    this.storage = new Storage();
    this.state = this.storage.getPinCards();
    this.loadState(this.state);
  }

  addSubscribe(element) {
    element.addEventListener("click", this.onClickDeleteCard.bind(this));
    element.addEventListener("click", this.onClickPinCard.bind(this));
    element.addEventListener("click", this.deletePinnedCard.bind(this));
    element.addEventListener("keyup", this.keyUp.bind(this));
    element.addEventListener("click", this.completionField.bind(this));
    element.addEventListener("input", this.onSearchMatches.bind(this));
  }

  renderingCard(text) {
    if (text.value !== "") {
      this.card = new Card();
      this.card.init();
      text.value = "";
      document.querySelector(".error").classList.add("hidden");

      if (this.tasksCard)
        document.querySelector(".tasks-default-text").classList.add("hidden");

      [...this.tasksCard].forEach((elem) => (elem.style.display = "flex"));
      return this.card.task;
    }
  }

  validity(field) {
    if (field.value === "") {
      document.querySelector(".error").classList.toggle("hidden");
    }
  }

  completionField(e) {
    if (e.target.classList.contains("input-task-name")) {
      document.querySelector(".error").classList.add("hidden");
    }
  }

  onSearchMatches(e) {
    if (!e.target.classList.contains("input-task-name")) {
      return;
    }

    this.tasksCard = document.querySelectorAll(".task__card");

    if (this.formArea.value === "") {
      [...this.tasksCard].forEach((elem) => (elem.style.display = "flex"));
    }

    const matches = this.getMatches(this.formArea.value);
    if (matches) this.renderMatches(this.tasksCard, matches);
    const every = this.filteredInputName([...this.tasksCard]);

    every
      ? document.querySelector(".tasks-default-text").classList.remove("hidden")
      : document.querySelector(".tasks-default-text").classList.add("hidden");
  }

  getMatches() {
    const result = [];

    const tasksTitle = document.querySelectorAll(".task__title");

    [...tasksTitle].forEach((elem) => {
      if (elem.textContent.startsWith(this.formArea.value)) {
        result.push(elem);
      }
    });
    return result;
  }

  renderMatches(arr1, arr2) {
    // Выбирает кого выбросить из потока, а кого включить

    [...arr1].forEach((elem) => (elem.style.display = "none"));
    [...arr2].forEach((elem) => (elem.parentElement.style.display = "flex"));
  }

  saveTask(value, type) {
    // сохраняет элемент в стораже

    const stateItem = new Card(value, type);

    this.state.push(stateItem);
    this.storage.save(this.state);
  }

  onClickAddCard() {
    // добавить задачу в AllTasks
    this.addCardBtn = document.querySelector(".task__add-button");
    this.formArea = document.querySelector(".input-task-name");

    this.addCardBtn.addEventListener("click", () => {
      if (this.formArea.value === "") {
        document.querySelector(".error").classList.remove("hidden");
        return;
      }

      document.querySelector(".error").classList.add("hidden");

      const valueForStorage = this.renderingCard(this.formArea);
      if (!valueForStorage) {
        return;
      }

      this.saveTask(valueForStorage, "task");

      this.renderingCard(this.formArea);
    });
  }

  keyUp(e) {
    // добавление карточки по Enter
    this.validity(this.formArea);
    if (e.key === "Enter") {
      const valueForStorage = this.renderingCard(this.formArea);
      if (!valueForStorage) {
        return;
      }
      this.saveTask(valueForStorage, "task");
      this.renderingCard(this.formArea);
    }
  }

  onClickDeleteCard(e) {
    // Удалить задачу из AllTasks
    e.preventDefault();

    if (!e.target.classList.contains("task__del")) {
      document.querySelector(".error").classList.add("hidden");
      return;
    }

    if (e.target.classList.contains("task__del")) {
      const task = e.target.parentElement.previousElementSibling.textContent;

      this.removeItem(this.state, task);
      e.target.parentElement.closest(".task__card").remove();
    }

    this.filteredArr(this.state, this.parentArr, "task");
  }

  onClickPinCard(e) {
    // закрепить карточку на доске Pinned
    e.preventDefault();
    if (!e.target.classList.contains("task__edit")) {
      document.querySelector(".error").classList.add("hidden");
      return;
    }
    this.pinTitle = e.target.parentElement.previousElementSibling.textContent;

    this.removeItem(this.state, this.pinTitle);
    this.saveTask(this.pinTitle, "pin");

    e.target.parentElement.closest(".task__card").remove();

    const pinnedCard = this.constructor.template(this.pinTitle);

    document.querySelector(".pinned-default-text").classList.remove("hidden");
    document
      .querySelector(".pinned-tasks")
      .insertAdjacentHTML("beforeend", pinnedCard);

    this.filteredArr(this.state, this.parentArr, "task");
    this.filteredArr(this.state, this.pinnedArr, "pin");
  }

  deletePinnedCard(e) {
    // открепить пин и отправить его в AllTasks
    e.preventDefault();

    if (!e.target.classList.contains("pin__del")) {
      document.querySelector(".error").classList.add("hidden");
      return;
    }

    this.pinTitle = e.target.parentElement.previousElementSibling.textContent;

    e.target.parentElement.closest(".pin__card").remove();
    this.removeItem(this.state, this.pinTitle);

    this.saveTask(this.pinTitle, "task");

    const card = this.constructor.templateTask(this.pinTitle);
    document.querySelector(".tasks-box").insertAdjacentHTML("beforeend", card);

    this.filteredArr(this.state, this.parentArr, "task");
    this.filteredArr(this.state, this.pinnedArr, "pin");
  }

  removeItem(arr, value) {
    const item = arr.findIndex((elem) => elem.task === value);
    this.state.splice(item, 1);
    this.storage.save(this.state);
  }

  loadState(arr) {
    arr.forEach((elem) => {
      if (elem.type === "task") {
        const card = this.constructor.templateTask(elem.task);

        document
          .querySelector(".tasks-box")
          .insertAdjacentHTML("beforeend", card);
      }

      if (elem.type === "pin") {
        const pinnedCard = this.constructor.template(elem.task);
        document
          .querySelector(".pinned-tasks")
          .insertAdjacentHTML("beforeend", pinnedCard);
      }
    });
    this.parentArr = document.querySelector(".tasks-box");
    this.pinnedArr = document.querySelector(".pinned-tasks");
    this.filteredArr(this.state, this.parentArr, "task");
    this.filteredArr(this.state, this.pinnedArr, "pin");
  }

  filteredArr(donorArr, parentArr, type) {
    const arr = donorArr.filter((elem) => elem.type === type);

    arr.length > 0
      ? parentArr.firstElementChild.classList.add("hidden")
      : parentArr.firstElementChild.classList.remove("hidden");
  }

  filteredInputName(arr) {
    const every = arr.every((item) => item.style.display === "none");

    arr.length > 0
      ? document.querySelector(".tasks-default-text").classList.remove("hidden")
      : document.querySelector(".tasks-default-text").classList.add("hidden");
    return every;
  }

  static templateTask(task) {
    return `
    <div class="task__card ">
        <span class="task__title">${task}</span>
        <div class="block__button">
            <button class="task__edit ">&#9733</button>
            <button class="task__del ">&#10060</button>
        </div>
    </div>
   `;
  }

  static template(pinCard) {
    return `
<div class="pin__card ">
    <span class="pin__title">${pinCard}</span>
    <div class="block__button">
        <button class="pin__del ">&#9733</button>
    </div>
</div>
`;
  }
}
