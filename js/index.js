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

const board = new Board(BOARD_SIZE, CELL_SIZE);

const canvas = board.getElement();
boardElement.appendChild(canvas);
canvas.width = canvas.height = BOARD_SIZE;

board.paint();

canvas.onmouseup = function (ev) {
  board.click(ev.offsetX, ev.offsetY);
} 