const COLORS = [
  '#C8282B', // Brick Red
  '#F1F037', // Starship 
  '#6C66E5', // Royal Blue
  '#C3C3BD', // Gray Nickel
  '#281c35' // Cornflower Blue
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