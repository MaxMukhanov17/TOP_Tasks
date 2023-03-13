export default class Board {
  constructor(container) {
    this.container = container;
    this.board = null;
  }

  createBoard() {
    this.board = document.createElement("div");
    this.board.classList.add("board");
    this.bindToDOM();
  }

  static get markup() {
    return `
	<div class="form-container"
	<form class="tasks-form">
			<input class="input-task-name" id="task__name" type="text" placeholder="Что будем делать?"  minlength="1">
			<button class="task__add-button">Добавить</button>
			<span class="error hidden">Добавьте текст!<span>
			
		</form>

	</div>
    <div class="pinned-tasks">
		<span class="pinned-default-text">Нет закреплённых задач</span>
	</div>
    <div class="tasks-box">
	<span class="tasks-default-text">Нет задач</span></div>`;
  }

  bindToDOM() {
    this.container.insertAdjacentHTML("afterbegin", this.constructor.markup);
  }
}
