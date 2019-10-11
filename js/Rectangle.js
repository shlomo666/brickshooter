module.exports = class Rectangle {
  constructor(y, x, width, height) {
    this.y = y;
    this.x = x;
    this.width = width;
    this.height = height;
  }

  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.height - 1;
  }
  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width - 1;
  }

  /** 
   * @param {{ x: number, y: number }} point
   * @returns {boolean}
  */ 
  contains(point) {
    return (point.x >= this.left && point.x <= this.right) && (point.y >= this.top && point.y <= this.bottom);
  }
}