import Card from './Card';
import showError from './showError';

export default class Board {
  constructor() {
    this.board = null;
    this.addInput = this.addInput.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.addNewTask = this.addNewTask.bind(this);
    this.onTaskEnter = this.onTaskEnter.bind(this);
    // this.onTaskLeave = this.onTaskLeave.bind(this);
    // this.removeTask = this.removeTask.bind(this);
  }

  init() {
    this.drawBoard();
    this.addListeners();
  }

  drawBoard() {
    this.board = document.createElement('section');
    this.board.classList.add('board');
    this.board.innerHTML = `<div class="column">
    <h2 class="column__header">todo</h2>
    <ul class="tasks-list todo"></ul>
    <div class="column__add">+ Add another card</div>
  </div>
  <div class="column">
    <h2 class="column__header">in progress</h2>
    <ul class="tasks-list in-progress" id="trew"></ul> 
    <div class="column__add">+ Add another card</div>
  </div>
  <div class="column">
    <h2 class="column__header">done</h2>
    <ul class="tasks-list done"></ul>
    <div class="column__add">+ Add another card</div>
  </div>`;

    document.querySelector('body').appendChild(this.board);
  }

  addListeners() {
    const addList = this.board.querySelectorAll('.column__add');
    [...addList].forEach((el) => el.addEventListener('click', this.addInput));
  }

  addInput(event) {
    const newCardForm = document.createElement('form');
    newCardForm.classList.add('column__add-form');

    newCardForm.innerHTML = `
    <textarea class="add-form__textarea" type ="text" placeholder="Enter a title for this card"></textarea>
    <div class="add-form__form-control">
      <button class="add-form__submit-button add-form__button">Add Card</button>
      <button class="add-form__close-button add-form__button">Close</button>
    </div>
 `;

    const closestColumn = event.target.closest('.column');

    event.target.replaceWith(newCardForm);

    const add = closestColumn.querySelector('.add-form__submit-button');
    const close = closestColumn.querySelector('.add-form__close-button');

    add.addEventListener('click', this.addNewTask);
    close.addEventListener('click', this.closeForm);
  }

  closeForm(event) {
    event.preventDefault();
    const columnAdd = document.createElement('div');
    columnAdd.classList.add('column__add');
    columnAdd.textContent = '+ Add another card';

    const parent = event.target.closest('.column');
    const child = parent.querySelector('.column__add-form');
    parent.removeChild(child);
    parent.appendChild(columnAdd);
    columnAdd.addEventListener('click', this.addInput);
  }

  addNewTask(event) {
    event.preventDefault();
    const closestColumn = event.target.closest('.column');
    const parent = closestColumn.querySelector('.tasks-list');
    const task = closestColumn.querySelector('.add-form__textarea').value;

    if (/\S.*/.test(task)) {
      new Card(parent, task).addTask();

      // if (parent.classList.contains('todo')) {
      //   this.tasksTodo.push(task);
      // }
      // if (parent.classList.contains('in-progress')) {
      //   this.tasksInP.push(task);
      // }
      // if (parent.classList.contains('done')) {
      //   this.tasksDone.push(task);
      // }

      const columnAdd = document.createElement('div');
      columnAdd.classList.add('column__add');
      columnAdd.textContent = '+ Add another card';

      closestColumn.removeChild(
        closestColumn.querySelector('.column__add-form'),
      );
      closestColumn.appendChild(columnAdd);
      columnAdd.addEventListener('click', this.addInput);

      const taskList = this.board.querySelectorAll('.task');
      [...taskList].forEach((el) => el.addEventListener('mouseover', this.onTaskEnter));
      [...taskList].forEach((el) => el.addEventListener('mouseleave', this.onTaskLeave));
    } else {
      showError(closestColumn.querySelector('.column__add-form'), 'empty');
    }
  }

  onTaskEnter(event) {
    if (
      event.target.classList.contains('task')
      && !event.target.querySelector('.close')
    ) {
      const closeEl = document.createElement('div');
      closeEl.classList.add('tasks-list__close');
      closeEl.classList.add('close');

      event.target.appendChild(closeEl);

      closeEl.addEventListener('click', this.removeTask);
    }
  }

  onTaskLeave(event) {
    event.target.removeChild(event.target.querySelector('.close'));
  }

  removeTask(event) {
    const task = event.target.closest('.task');
    const taskList = event.target.closest('.tasks-list');

    taskList.removeChild(task);
  }
}
