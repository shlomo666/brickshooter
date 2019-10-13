exports.INITIAL_CENTER_SIZE = 2;
exports.CELLS_IN_BOARD = 24;
exports.CELLS_IN_DOCK_LENGTH = exports.CELLS_IN_BOARD / 2 | 0;
exports.CELLS_IN_DOCK_WIDTH = exports.CELLS_IN_BOARD / 4 | 0;

exports.COLORS = [
  '#C8282B', // Brick Red
  '#F1F037', // Starship 
  '#6C66E5', // Royal Blue
  '#C3C3BD', // Gray Nickel
  '#281c35' // Cornflower Blue
];

exports.GRADIENT = false;

exports.DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
};

exports.arrowByDirection = {
  'up': '\u2191',
  'down': '\u2193',
  'left': '\u2190',
  'right': '\u2192'
};

exports.FRAME_IN_MILLISEC = 40;