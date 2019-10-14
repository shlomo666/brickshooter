const { COLORS } = require('./config');

module.exports = class Cell {
  constructor(y, x, color) {
    this.y = y;
    this.x = x;
    this.color = COLORS[color || Math.random() * COLORS.length | 0];
    /** @type {'up' | 'down' | 'left' | 'right'} */
    this.direction = undefined;
  }

  clone() {
    const cell = new Cell(this.y, this.x, 'no');
    cell.color = this.color;
    cell.direction = this.direction;
    return cell;
  }
}