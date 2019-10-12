'use strict';

const Cell = require('./Cell');
const Rectangle = require('./Rectangle');

const arrowByDirection = {
  'up': '\u2191',
  'down': '\u2193',
  'left': '\u2190',
  'right': '\u2192'
};
module.exports = class Board {
  constructor(BOARD_SIZE, DOCK_LENGTH, DOCK_WIDTH, CELLS_IN_BOARD, CELL_SIZE) {
    this.canvas = document.createElement('canvas');
    this.canvas.height = this.canvas.width = BOARD_SIZE;
    this.BOARD_SIZE = BOARD_SIZE;
    this.DOCK_LENGTH = DOCK_LENGTH;
    this.DOCK_WIDTH = DOCK_WIDTH;
    this.CELLS_IN_BOARD = CELLS_IN_BOARD;
    this.CELLS_IN_DOCK_LENGTH = CELLS_IN_BOARD / 2 | 0;
    this.CELLS_IN_DOCK_WIDTH = CELLS_IN_BOARD / 4 | 0;
    this.CELL_SIZE = CELL_SIZE;
    this.playground = new Rectangle(this.CELLS_IN_DOCK_WIDTH, this.CELLS_IN_DOCK_WIDTH, this.CELLS_IN_DOCK_LENGTH, this.CELLS_IN_DOCK_LENGTH);

    this.cells = this.generateCells();

    this.ctx = this.canvas.getContext('2d');
  }

  resize(BOARD_SIZE, DOCK_LENGTH, DOCK_WIDTH, CELLS_IN_BOARD, CELL_SIZE) {
    this.canvas.height = this.canvas.width = BOARD_SIZE;
    this.BOARD_SIZE = BOARD_SIZE;
    this.DOCK_LENGTH = DOCK_LENGTH;
    this.DOCK_WIDTH = DOCK_WIDTH;
    this.CELLS_IN_BOARD = CELLS_IN_BOARD;
    this.CELL_SIZE = CELL_SIZE;
    this.playground = new Rectangle(this.CELLS_IN_DOCK_WIDTH, this.CELLS_IN_DOCK_WIDTH, this.CELLS_IN_DOCK_LENGTH, this.CELLS_IN_DOCK_LENGTH);

    this.paint();
  }

  getElement() {
    this.paint();
    return this.canvas;
  }

  paint() {
    const { ctx } = this;

    ctx.clearRect(0, 0, this.BOARD_SIZE, this.BOARD_SIZE);
    this.addGradient();

    ctx.lineWidth = "1";
    ctx.strokeStyle = "black";

    for (let y = 0; y < this.CELLS_IN_BOARD; y++)
      for (let x = 0; x < this.CELLS_IN_BOARD; x++) {
        const { color, direction } = this.cells[y][x];
        if (color === undefined) continue;

        ctx.fillStyle = color;
        ctx.fillRect(x * this.CELL_SIZE, y * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);

        if (direction) {
          this.drawArrow(color, arrowByDirection[direction], { x, y });
        }

        ctx.beginPath();
        ctx.rect(x * this.CELL_SIZE, y * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);
        ctx.stroke();
      }
  }

  addGradient() {
    const { ctx } = this;

    const gradient = ctx.createLinearGradient(0, 20, 0, this.BOARD_SIZE - 20);

    gradient.addColorStop(0, 'blue');
    gradient.addColorStop(.25, 'black');
    gradient.addColorStop(.5, 'blue');
    gradient.addColorStop(.75, 'black');
    gradient.addColorStop(1, 'blue');

    this.gradient = gradient;

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.BOARD_SIZE, this.BOARD_SIZE);
  }

  async click(xPX, yPX) {
    if (this.busy) return;

    const x = xPX / this.CELL_SIZE | 0;
    const y = yPX / this.CELL_SIZE | 0;

    await this.main(y, x);

    this.busy = false;
  }

  async main(y, x) {
    const cell = this.cells[y][x];
    if (cell.color && this.isEdgeCell(x, y)) {
      const direction = this.getDirection(x, y);

      const { destination, cause } = this.getDestination(x, y, direction);
      if (this.playground.contains(cause) && !this.same(cell, destination)) {
        this.busy = true;
        cell.direction = direction;

        await this.animateMotion(x, y, destination.x, destination.y, arrowByDirection[direction]);
        this.refill(x, y, direction);

        do {
          this.removeSeries();
          this.paint();
        } while (await this.searchAndMoveMoveableCells());
        this.paint();

        if (this.won()) {
          alert('You won!');
        } else {
          this.busy = false; // Disable further play
        }
      }
    }
  }

  same(cell1, cell2) {
    return cell1.x === cell2.x && cell1.y === cell2.y;
  }

  generateCells() {
    const cells = Array(this.CELLS_IN_BOARD).fill().map((_, y) =>
      Array(this.CELLS_IN_BOARD).fill().map((_, x) => {
        return new Cell(y, x, 'no');
      })
    );

    for (let x = this.CELLS_IN_DOCK_WIDTH; x < this.CELLS_IN_DOCK_LENGTH + this.CELLS_IN_DOCK_WIDTH; x++) {
      for (let y = 0; y < this.CELLS_IN_DOCK_WIDTH; y++) {
        cells[y][x] = new Cell(y, x);
      }
    }
    for (let x = this.CELLS_IN_DOCK_WIDTH; x < this.CELLS_IN_DOCK_LENGTH + this.CELLS_IN_DOCK_WIDTH; x++) {
      for (let y = this.CELLS_IN_BOARD - 1; y >= this.CELLS_IN_BOARD - this.CELLS_IN_DOCK_WIDTH; y--) {
        cells[y][x] = new Cell(y, x);
      }
    }
    for (let x = 0; x < this.CELLS_IN_DOCK_WIDTH; x++) {
      for (let y = this.CELLS_IN_DOCK_WIDTH; y < this.CELLS_IN_DOCK_LENGTH + this.CELLS_IN_DOCK_WIDTH; y++) {
        cells[y][x] = new Cell(y, x);
      }
    }
    for (let x = this.CELLS_IN_DOCK_LENGTH + this.CELLS_IN_DOCK_WIDTH; x < this.CELLS_IN_BOARD; x++) {
      for (let y = this.CELLS_IN_DOCK_WIDTH; y < this.CELLS_IN_DOCK_LENGTH + this.CELLS_IN_DOCK_WIDTH; y++) {
        cells[y][x] = new Cell(y, x);
      }
    }

    // setup initial middle cells - don't let them all be of the same color.
    const colors = new Set();
    let counter = 0;
    for (let x = this.CELLS_IN_BOARD / 2 - 1 | 0; x < this.CELLS_IN_BOARD / 2 + 1 | 0; x++) {
      for (let y = this.CELLS_IN_BOARD / 2 - 1 | 0; y < this.CELLS_IN_BOARD / 2 + 1 | 0; y++) {
        counter++;
        do {
          cells[y][x] = new Cell(y, x);
          colors.add(cells[y][x].color);
        } while (counter === 4 && colors.size === 1);
      }
    }

    return cells;

  }

  isEdgeCell(x, y) {
    const peek = this.CELLS_IN_DOCK_WIDTH - 1;
    return (
      x === peek ||
      this.CELLS_IN_BOARD - 1 - x === peek ||
      y === peek ||
      this.CELLS_IN_BOARD - 1 - y === peek
    )
  }

  getDirection(x, y) {
    const peek = this.CELLS_IN_DOCK_WIDTH - 1;
    if (x === peek) return 'right';
    if (this.CELLS_IN_BOARD - 1 - x === peek) return 'left';
    if (y === peek) return 'down';
    if (this.CELLS_IN_BOARD - 1 - y === peek) return 'up';
    throw new Error('No Direction');
  }

  getDestination(x, y, direction) {
    if (direction === 'down') {
      while (!this.cells[++y][x].color);
      return { destination: { x, y: y - 1 }, cause: { x, y } };
    }
    if (direction === 'up') {
      while (!this.cells[--y][x].color);
      return { destination: { x, y: y + 1 }, cause: { x, y } };
    }
    if (direction === 'right') {
      while (!this.cells[y][++x].color);
      return { destination: { x: x - 1, y }, cause: { x, y } };
    }
    if (direction === 'left') {
      while (!this.cells[y][--x].color);
      return { destination: { x: x + 1, y }, cause: { x, y } };
    }
  }

  animateMotion(xFrom, yFrom, xTo, yTo, arrow) {
    const { color } = this.cells[yFrom][xFrom];
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (xFrom !== xTo) {
          const nextX = xFrom + Math.sign(xTo - xFrom);
          this.drawCell({ x: xFrom, y: yFrom }, { x: nextX, y: yTo }, color, arrow, nextX === xTo);
          this.swapCells(xFrom, yFrom, nextX, yTo);
          xFrom = nextX;
        } else if (yFrom !== yTo) {
          const nextY = yFrom + Math.sign(yTo - yFrom);
          this.drawCell({ x: xFrom, y: yFrom }, { x: xTo, y: nextY }, color, arrow, nextY === yTo);
          this.swapCells(xFrom, yFrom, xTo, nextY);
          yFrom = nextY;
        }

        if (yFrom === yTo && xFrom === xTo) {
          clearInterval(interval);
          resolve();
        }
      }, 40);
    });
  }

  drawCell(from, to, color, arrow, frame) {
    const { x, y } = to;
    const { ctx, CELL_SIZE: px } = this;
    // clear old cell
    ctx.clearRect(from.x * px, from.y * px, px, px);
    ctx.fillStyle = this.gradient;
    ctx.fillRect(from.x * px, from.y * px, px, px);

    ctx.fillStyle = color;
    ctx.fillRect(x * px, y * px, px, px);
    this.drawArrow(color, arrow, to);

    if (frame) {
      ctx.beginPath();
      ctx.rect(x * px, y * px, px, px);
      ctx.stroke();
    }
  }

  drawArrow(color, arrow, location) {
    const { ctx, CELL_SIZE: px } = this;

    ctx.font = `bold ${px / 2}px serif`;
    ctx.fillStyle = Board.contrass(color);
    ctx.textAlign = "center";
    ctx.fillText(arrow, location.x * px + px / 2, location.y * px + px / 1.5);
  }

  async removeSeries() {
    for (let x = this.playground.left; x <= this.playground.right; x++)
      for (let y = this.playground.left; y <= this.playground.right; y++)
        if (this.cells[y][x].color) {
          const pathChain = [];
          const pathLength = this.followPath(y, x, this.cells[y][x].color, pathChain);
          if (pathLength >= 4) {
            pathChain.forEach(cell => {
              delete cell.color;
              delete cell.direction;
            })
          }
        }
  }

  refill(x, y, direction) {
    if (direction === 'down') { while (--y > -1) this.swapCells(x, y, x, y + 1); this.cells[y + 1][x] = new Cell(y + 1, x); }
    if (direction === 'up') { while (++y < this.CELLS_IN_BOARD) this.swapCells(x, y, x, y - 1); this.cells[y - 1][x] = new Cell(y - 1, x); }
    if (direction === 'right') { while (--x > -1) this.swapCells(x, y, x + 1, y); this.cells[y][x + 1] = new Cell(y, x + 1); }
    if (direction === 'left') { while (++x < this.CELLS_IN_BOARD) this.swapCells(x, y, x - 1, y); this.cells[y][x - 1] = new Cell(y, x - 1); }

    this.paint();
  }

  swapCells(xFrom, yFrom, xTo, yTo) {
    const [from, to] = [this.cells[yFrom][xFrom], this.cells[yTo][xTo]];
    [this.cells[yFrom][xFrom], this.cells[yTo][xTo]] = [to, from];
    [from.x, from.y, to.x, to.y] = [to.x, to.y, from.x, from.y];
  }

  followPath(y, x, color, pathChain) {
    if (!this.playground.contains({ x, y })) return 0;
    if (this.cells[y][x].color !== color) return 0;
    if (this.cells[y][x].onPath) return 0;

    this.cells[y][x].onPath = true;
    pathChain.push(this.cells[y][x]);

    const result = 1 + this.followPath(y, x + 1, color, pathChain) +
      this.followPath(y, x - 1, color, pathChain) +
      this.followPath(y + 1, x, color, pathChain) +
      this.followPath(y - 1, x, color, pathChain);

    this.cells[y][x].onPath = false;

    return result;
  }

  async searchAndMoveMoveableCells() {
    const promises = [];

    this.cells.forEach(cells => cells.forEach(cell => {
      if (this.playground.contains(cell) && cell.direction) {
        const next = this.nextCell(cell, cell.direction);
        if (!next.color) {
          promises.push(this.animateMotion(cell.x, cell.y, next.x, next.y, arrowByDirection[cell.direction]))
        }
      }
    }));

    await Promise.all(promises);
    return promises.length > 0;
  }

  /** @param {{ x: number, y: number }} cell */
  /** @param {'up' | 'down' | 'left' | 'right'} direction */
  nextCell(cell, direction) {
    const { x, y } = cell;
    switch (direction) {
      case 'down': return this.cells[y + 1][x];
      case 'up': return this.cells[y - 1][x];
      case 'right': return this.cells[y][x + 1];
      case 'left': return this.cells[y][x - 1];
    }
  }

  won() {
    for (let x = this.CELLS_IN_DOCK_WIDTH; x < this.CELLS_IN_DOCK_WIDTH + this.CELLS_IN_DOCK_LENGTH; x++)
      for (let y = this.CELLS_IN_DOCK_WIDTH; y < this.CELLS_IN_DOCK_WIDTH + this.CELLS_IN_DOCK_LENGTH; y++)
        if (this.cells[y][x].color) return false;
    return true;
  }

  static contrass(hex) {
    hex = hex.slice(1);
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);

    // http://stackoverflow.com/a/3943023/112731
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
      ? '#000000'
      : '#FFFFFF';
  }
}