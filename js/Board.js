'use strict';

const Cell = require('./Cell');
const Rectangle = require('./Rectangle');
const {
  GRADIENT,
  arrowByDirection,
  FRAME_IN_MILLISEC,
  CELLS_IN_BOARD,
  CELLS_IN_DOCK_LENGTH,
  CELLS_IN_DOCK_WIDTH,
  INITIAL_CENTER_SIZE,
  DIRECTIONS: {
    DOWN, LEFT, RIGHT, UP
  },
  COLORS: {
    length: COLORS_LENGTH
  }
} = require('./config');

module.exports = class Board {
  constructor(BOARD_SIZE, CELL_SIZE) {
    this.canvas = document.createElement('canvas');
    this.resize(BOARD_SIZE, CELL_SIZE);

    this.cells = this.generateCells();
    this.states = [];
    this.stepCounter = -1;
    this.saveState();

    this.ctx = this.canvas.getContext('2d');
  }

  resize(BOARD_SIZE, CELL_SIZE) {
    this.canvas.height = this.canvas.width = BOARD_SIZE;
    this.BOARD_SIZE = BOARD_SIZE;
    this.CELL_SIZE = CELL_SIZE;

    this.boardArea = new Rectangle(0, 0, CELLS_IN_BOARD, CELLS_IN_BOARD);
    this.playground = new Rectangle(CELLS_IN_DOCK_WIDTH, CELLS_IN_DOCK_WIDTH, CELLS_IN_DOCK_LENGTH, CELLS_IN_DOCK_LENGTH);

    const middle = (CELLS_IN_BOARD - INITIAL_CENTER_SIZE) / 2 | 0;
    this.center = new Rectangle(middle, middle, INITIAL_CENTER_SIZE, INITIAL_CENTER_SIZE);
    this.dockerUp = new Rectangle(CELLS_IN_DOCK_WIDTH, 0, CELLS_IN_DOCK_LENGTH, CELLS_IN_DOCK_WIDTH);
    this.dockerDown = new Rectangle(CELLS_IN_DOCK_WIDTH, CELLS_IN_DOCK_WIDTH + CELLS_IN_DOCK_LENGTH, CELLS_IN_DOCK_LENGTH, CELLS_IN_DOCK_WIDTH);
    this.dockerLeft = new Rectangle(0, CELLS_IN_DOCK_WIDTH, CELLS_IN_DOCK_WIDTH, CELLS_IN_DOCK_LENGTH);
    this.dockerRight = new Rectangle(CELLS_IN_DOCK_WIDTH + CELLS_IN_DOCK_LENGTH, CELLS_IN_DOCK_WIDTH, CELLS_IN_DOCK_WIDTH, CELLS_IN_DOCK_LENGTH);
  }

  resizeAndPaint(BOARD_SIZE, CELL_SIZE) {
    this.resize(BOARD_SIZE, CELL_SIZE);
    this.paint();
  }

  getElement() {
    this.paint();
    return this.canvas;
  }

  paint() {
    const { ctx } = this;

    ctx.clearRect(0, 0, this.BOARD_SIZE, this.BOARD_SIZE);

    if (GRADIENT) {
      this.addGradient();
    } else {
      this.canvas.style.background = '#282c35';
    }

    ctx.lineWidth = "1";
    ctx.strokeStyle = "black";

    for (const { x, y } of this.boardArea) {
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

    const gradient = ctx.createLinearGradient(0, 0, this.BOARD_SIZE, this.BOARD_SIZE);

    gradient.addColorStop(0, 'white');
    gradient.addColorStop(.25, 'black');
    gradient.addColorStop(.5, 'white');
    gradient.addColorStop(.75, 'black');
    gradient.addColorStop(1, 'white');

    this.gradient = gradient;

    ctx.fillStyle = this.gradient;
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
        
        this.saveState();

        if (this.won()) {
          setTimeout(() => alert('You won!'), FRAME_IN_MILLISEC * 2);
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
    const cells = Array(CELLS_IN_BOARD).fill().map((_, y) =>
      Array(CELLS_IN_BOARD).fill().map((_, x) => {
        return new Cell(y, x, 'no');
      })
    );

    [this.dockerUp, this.dockerRight, this.dockerLeft, this.dockerDown]
      .forEach(docker => {
        for (const { y, x } of docker) {
          cells[y][x] = new Cell(y, x);
        }
      });

    // setup initial middle cells - make all cell colors unique.
    if(INITIAL_CENTER_SIZE ** 2 > COLORS_LENGTH) throw new Error('all cell colors unique but not enough colors available');
    const colors = new Set();
    for (const { y, x } of this.center) {
      do {
        cells[y][x] = new Cell(y, x);
      } while (colors.has(cells[y][x].color));
      colors.add(cells[y][x].color);
    }

    return cells;
  }

  isEdgeCell(x, y) {
    return (
      y === this.dockerUp.bottom ||
      y === this.dockerDown.top ||
      x === this.dockerLeft.right ||
      x === this.dockerRight.left
    );
  }

  getDirection(x, y) {
    const peek = CELLS_IN_DOCK_WIDTH - 1;
    if (x === this.dockerLeft.right) return RIGHT;
    if (x === this.dockerRight.left) return LEFT;
    if (y === this.dockerUp.bottom) return DOWN;
    if (y === this.dockerDown.top) return UP;
    throw new Error('No Direction');
  }

  getDestination(x, y, direction) {
    let destination, cause = this.cells[y][x];
    do
      [destination, cause] = [cause, this.nextCell(cause, direction)];
    while (!cause.color);

    return { destination, cause };
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
      }, FRAME_IN_MILLISEC);
    });
  }

  drawCell(from, to, color, arrow, frame) {
    const { x, y } = to;
    const { ctx, CELL_SIZE: px } = this;
    // clear old cell
    ctx.clearRect(from.x * px, from.y * px, px, px);
    if (GRADIENT) {
      ctx.fillStyle = this.gradient;
      ctx.fillRect(from.x * px, from.y * px, px, px);
    }

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
    for (const { x, y } of this.playground)
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
    if (direction === DOWN) { while (--y > -1) this.swapCells(x, y, x, y + 1); this.cells[y + 1][x] = new Cell(y + 1, x); }
    if (direction === UP) { while (++y < CELLS_IN_BOARD) this.swapCells(x, y, x, y - 1); this.cells[y - 1][x] = new Cell(y - 1, x); }
    if (direction === RIGHT) { while (--x > -1) this.swapCells(x, y, x + 1, y); this.cells[y][x + 1] = new Cell(y, x + 1); }
    if (direction === LEFT) { while (++x < CELLS_IN_BOARD) this.swapCells(x, y, x - 1, y); this.cells[y][x - 1] = new Cell(y, x - 1); }

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

    const takenCellsByThisSearch = new Set();
    this.cells.forEach(cells => cells.forEach(cell => {
      if (this.playground.contains(cell) && cell.direction) {
        const next = this.nextCell(cell, cell.direction);
        if (!next.color && !takenCellsByThisSearch.has(next)) {
          takenCellsByThisSearch.add(next);
          promises.push(this.animateMotion(cell.x, cell.y, next.x, next.y, arrowByDirection[cell.direction]))
        }
      }
    }));

    await Promise.all(promises);
    return promises.length > 0;
  }

  nextCell(cell, direction) {
    const { x, y } = cell;
    switch (direction) {
      case DOWN: return this.cells[y + 1][x];
      case UP: return this.cells[y - 1][x];
      case RIGHT: return this.cells[y][x + 1];
      case LEFT: return this.cells[y][x - 1];
    }
  }

  won() {
    for (const { x, y } of this.playground) {
      if (this.cells[y][x].color) return false;
    }
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

  backStep() {
    if(this.stepCounter > 0) {
      this.cells = Board.cloneCells(this.states[--this.stepCounter]);
      this.paint();
    }
  }

  forwardStep() {
    if(this.stepCounter < this.states.length - 1) {
      this.cells = Board.cloneCells(this.states[++this.stepCounter]);
      this.paint();
    }
  }

  saveState() {
    this.stepCounter++;
    this.states.splice(this.stepCounter);
    this.states[this.stepCounter] = Board.cloneCells(this.cells);
  }

  static cloneCells(cells) {
    return cells.map(cells => cells.map(cell => cell.clone()));
  }
}