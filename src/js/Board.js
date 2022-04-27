import Card from './Card';
import showError from './showError';

export default class Board {
  constructor() {
    this.board = null;

    // this.tasksTodo = [];
    // this.tasksInP = [];
    // this.tasksDone = [];
    // this.tasks = [this.tasksTodo, this.tasksInP, this.tasksDone];
    this.addInput = this.addInput.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.addNewTask = this.addNewTask.bind(this);
    this.onTaskEnter = this.onTaskEnter.bind(this);
    // this.onTaskLeave = this.onTaskLeave.bind(this);
    // this.removeTask = this.removeTask.bind(this);
    // this.saveTasks = this.saveTasks.bind(this);
    // this.loadTasks = this.loadTasks.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.dragMove = this.dragMove.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.showPossiblePlace = this.showPossiblePlace.bind(this);
  }

  init() {
    // document.addEventListener('DOMContentLoaded', this.loadTasks);
    // const tasksLoaded = localStorage.getItem('board');
    // this.tasks = JSON.parse(tasksLoaded);

    this.drawBoard();
    const addList = this.board.querySelectorAll('.column__add');
    [...addList].forEach((el) => el.addEventListener('click', this.addInput));
    // window.addEventListener('beforeunload', this.saveTasks);
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
      [...taskList].forEach((el) => el.addEventListener('mousedown', this.mouseDown));
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
      closeEl.style.top = `${closeEl.offsetTop - closeEl.offsetHeight / 2}px`;
      closeEl.style.left = `${
        event.target.offsetWidth - closeEl.offsetWidth - 3
      }px`;

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

  // loadTasks() {
  //   const tasksLoaded = localStorage.getItem('board');
  //   if (tasksLoaded) {
  //     this.tasks = JSON.parse(tasksLoaded);
  //   }
  //   this.drawBoard();
  //   this.addListener();
  // }

  // saveTasks() {
  //   localStorage.setItem('board', JSON.stringify(this.tasks));
  // }

  mouseDown(event) {
    this.draggedEl = event.target;
    this.ghostEl = event.target.cloneNode(true);
    this.ghostEl.removeChild(this.ghostEl.querySelector('.close'));
    this.ghostEl.classList.add('dragged');
    this.ghostEl.style.width = `${this.draggedEl.offsetWidth}px`;
    this.ghostEl.style.height = `${this.draggedEl.offsetHeight}px`;
    document.body.appendChild(this.ghostEl);

    const { top, left } = this.draggedEl.getBoundingClientRect();
    this.ghostEl.style.top = `${top - 1.5 * this.draggedEl.offsetHeight}px`;
    this.ghostEl.style.left = `${left - this.board.offsetWidth - 100}px`;
    this.draggedEl.style.display = 'none';
    document.addEventListener('mousemove', this.dragMove);
    document.addEventListener('mousemove', this.showPossiblePlace);
    document.addEventListener('mouseup', this.mouseUp);

    // this.draggedEl.style.width = `${this.draggedEl.offsetWidth}px`;
    // this.draggedEl.style.height = `${this.draggedEl.offsetHeight}px`;
  }

  dragMove(event) {
    event.preventDefault();
    if (!this.draggedEl) {
      return;
    }

    this.ghostEl.style.left = `${
      event.pageX - this.board.offsetWidth - this.ghostEl.offsetWidth
    }px`;
    this.ghostEl.style.top = `${
      event.pageY - 1.5 * this.ghostEl.offsetHeight
    }px`;
  }

  mouseUp(event) {
    if (!this.draggedEl) {
      return;
    }
    const closest = document.elementFromPoint(event.clientX, event.clientY);

    if (closest) {
      const closestList = closest.closest('.tasks-list');

      if (!closestList) {
        this.newPlace.remove();
      } else if (closestList.contains(this.newPlace)) {
        this.newPlace.replaceWith(this.draggedEl);
      }
      this.draggedEl.style.display = 'flex';
      document.body.removeChild(document.body.querySelector('.dragged'));

      this.ghostEl = null;
      this.draggedEl = null;
    }
  }

  showPossiblePlace(event) {
    if (!this.draggedEl) {
      return;
    }
    const closestColumn = event.target.closest('.tasks-list');

    if (closestColumn) {
      const allTasks = closestColumn.querySelectorAll('.task');
      const allPos = [closestColumn.getBoundingClientRect().top];

      if (allTasks) {
        for (const item of allTasks) {
          allPos.push(item.getBoundingClientRect().top + item.offsetHeight / 2);
        }
      }

      if (!this.newPlace) {
        this.newPlace = document.createElement('div');
        this.newPlace.classList.add('task-list__new-place');
        this.newPlace.style.width = `${this.ghostEl.offsetWidth}px`;
        this.newPlace.style.height = `${this.ghostEl.offsetHeight}px`;
      }

      const itemIndex = allPos.findIndex((item) => item > event.pageY);
      if (itemIndex !== -1) {
        allTasks[itemIndex - 1].before(this.newPlace);
      } else {
        closestColumn.append(this.newPlace);
      }
    }
  }
}
