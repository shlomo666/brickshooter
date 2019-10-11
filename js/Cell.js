const COLORS = [
  '#ff0000', // red 
  '#0000ff', // blue 
  // '#008000', // green 
  '#ffff00', // yellow 
  '#ff0000', // biege 
  '#a52a2a' // brown;
];

module.exports = class Cell {
  constructor(y, x, color) {
    this.y = y;
    this.x = x;
    this.color = COLORS[color || Math.random() * COLORS.length | 0];
    /** @type {'up' | 'down' | 'left' | 'right'} */
    this.direction = undefined;
  }
}