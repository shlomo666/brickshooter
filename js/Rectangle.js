module.exports = class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
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

  *[Symbol.iterator] () {
    for (let y = this.top; y <= this.bottom; y++)
      for (let x = this.left; x <= this.right; x++) {
        yield { x, y };
      }
  }
}