const boardElement = document.getElementById('board');
const Board = require('./Board');
let BOARD_SIZE;
let DOCK_LENGTH;
let DOCK_WIDTH;
let CELL_SIZE;
let CELLS_IN_BOARD;

function setSizes() {
  BOARD_SIZE = Math.min(boardElement.offsetHeight, boardElement.offsetWidth);
  DOCK_LENGTH = BOARD_SIZE / 2 | 0;
  DOCK_WIDTH = DOCK_LENGTH / 2 | 0;
  CELLS_IN_BOARD = 24;
  CELL_SIZE = DOCK_WIDTH / (CELLS_IN_BOARD / 4) | 0;
}
window.onresize = () => {
  setSizes();
  board.resize(BOARD_SIZE, DOCK_LENGTH, DOCK_WIDTH, CELLS_IN_BOARD, CELL_SIZE);
};
setSizes();

const board = new Board(BOARD_SIZE, DOCK_LENGTH, DOCK_WIDTH, CELLS_IN_BOARD, CELL_SIZE);

const canvas = board.getElement();
boardElement.appendChild(canvas);
canvas.width = canvas.height = BOARD_SIZE;

board.paint();

canvas.onmouseup = function(ev){
  board.click(ev.x, ev.y);
} 