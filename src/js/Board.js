export default class Board {
  constructor() {
    this.board = null;
  }

  init() {
    this.board = document.createElement('section');
    this.board.classList.add('board');
    this.board.innerHTML = `<div class="column">
    <h2 class="column__header">todo</h2>
    <ul class="tasks-list"></ul>
    <div class="column__add">+ Add another card</div>
  </div>
  <div class="column">
    <h2 class="column__header">in progress</h2>
    <ul class="tasks-list" id="trew"></ul> 
    <div class="column__add">+ Add another card</div>
  </div>
  <div class="column">
    <h2 class="column__header">done</h2>
    <ul class="tasks-list"></ul>
    <div class="column__add">+ Add another card</div>
  </div>`;

    document.querySelector('body').appendChild(this.board);
  }
}
