export default class Card {
  constructor(task, type) {
    this.task = task;
    this.type = type;
  }

  init() {
    this.bindToDOM();
  }

  static template(task) {
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

  bindToDOM() {
    this.tasksBox = document.querySelector(".tasks-box");
    this.cardTask = this.addTask(this.task);
    this.tasksBox.insertAdjacentHTML("beforeend", this.cardTask);
  }

  addTask() {
    const taskName = document.querySelector(".input-task-name");
    // this.pinTitle = document.querySelectorAll('.pin__title');
    // можно сделать, чтоб класс формировал карточки на обе доски
    // пока не придумала - будет ли так удобнее
    this.task = taskName.value.trim();

    if (this.task) {
      const text = this.constructor.template(this.task);
      return text;
    }
    return false;
  }
}
