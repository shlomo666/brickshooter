const boardElement = document.getElementById('board');
const Board = require('./Board');
const { CELLS_IN_BOARD } = require('./config');
let BOARD_SIZE;
let CELL_SIZE;

function setSizes() {
  BOARD_SIZE = Math.min(boardElement.offsetHeight, boardElement.offsetWidth);
  const dockLength = BOARD_SIZE / 2 | 0;
  const dockWidth = dockLength / 2 | 0;
  CELL_SIZE = dockWidth / (CELLS_IN_BOARD / 4) | 0;
}
window.onresize = () => {
  setSizes();
  board.resizeAndPaint(BOARD_SIZE, CELL_SIZE);
};
setSizes();

/** @type {Board} */
let board;
let canvas;

window.app = {
  newGame: () => {
    board = new Board(BOARD_SIZE, CELL_SIZE);
    if(boardElement.childElementCount) {
      boardElement.removeChild(canvas);
    }
    canvas = board.getElement();
    boardElement.appendChild(canvas);
    canvas.width = canvas.height = BOARD_SIZE;

    board.paint();
    updateMeta();
    
    canvas.onmouseup = async ev => {
      await board.click(ev.offsetX, ev.offsetY);
      updateMeta();
    };
    document.onkeydown = (ev) => {
      if(ev.metaKey && ev.key.toLowerCase() === 'z') {
        if(ev.shiftKey) {
          window.app.forwardStep();
        } else {
          window.app.backStep();
        }
      }
    }
  },
  backStep: () => {
    board.backStep();
    updateMeta();
  },
  forwardStep: () => { 
    board.forwardStep();
    updateMeta();
  }
};

window.app.newGame();

function updateMeta() {
  document.getElementById('step number').innerText = board.stepCounter + ' Steps';
}