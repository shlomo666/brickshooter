/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/Board.js":
/*!*********************!*\
  !*** ./js/Board.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nconst Cell = __webpack_require__(/*! ./Cell */ \"./js/Cell.js\");\nconst Rectangle = __webpack_require__(/*! ./Rectangle */ \"./js/Rectangle.js\");\n\nconst arrowByDirection = {\n  'up': '\\u2191',\n  'down': '\\u2193',\n  'left': '\\u2190',\n  'right': '\\u2192'\n};\nmodule.exports = class Board {\n  constructor(BOARD_SIZE, DOCK_LENGTH, DOCK_WIDTH, CELLS_IN_BOARD, CELL_SIZE) {\n    this.canvas = document.createElement('canvas');\n    this.canvas.height = this.canvas.width = BOARD_SIZE;\n    this.BOARD_SIZE = BOARD_SIZE;\n    this.DOCK_LENGTH = DOCK_LENGTH;\n    this.DOCK_WIDTH = DOCK_WIDTH;\n    this.CELLS_IN_BOARD = CELLS_IN_BOARD;\n    this.CELLS_IN_DOCK_LENGTH = CELLS_IN_BOARD / 2 | 0;\n    this.CELLS_IN_DOCK_WIDTH = CELLS_IN_BOARD / 4 | 0;\n    this.CELL_SIZE = CELL_SIZE;\n    this.playground = new Rectangle(this.CELLS_IN_DOCK_WIDTH, this.CELLS_IN_DOCK_WIDTH, this.CELLS_IN_DOCK_LENGTH, this.CELLS_IN_DOCK_LENGTH);\n\n    this.cells = this.generateCells();\n\n    this.ctx = this.canvas.getContext('2d');\n  }\n\n  resize(BOARD_SIZE, DOCK_LENGTH, DOCK_WIDTH, CELLS_IN_BOARD, CELL_SIZE) {\n    this.canvas.height = this.canvas.width = BOARD_SIZE;\n    this.BOARD_SIZE = BOARD_SIZE;\n    this.DOCK_LENGTH = DOCK_LENGTH;\n    this.DOCK_WIDTH = DOCK_WIDTH;\n    this.CELLS_IN_BOARD = CELLS_IN_BOARD;\n    this.CELL_SIZE = CELL_SIZE;\n    this.playground = new Rectangle(this.CELLS_IN_DOCK_WIDTH, this.CELLS_IN_DOCK_WIDTH, this.CELLS_IN_DOCK_LENGTH, this.CELLS_IN_DOCK_LENGTH);\n\n    this.paint();\n  }\n\n  getElement() {\n    this.paint();\n    return this.canvas;\n  }\n\n  paint() {\n    const { ctx } = this;\n\n    ctx.clearRect(0, 0, this.BOARD_SIZE, this.BOARD_SIZE);\n    this.addGradient();\n\n    ctx.lineWidth = \"1\";\n    ctx.strokeStyle = \"black\";\n\n    for (let y = 0; y < this.CELLS_IN_BOARD; y++)\n      for (let x = 0; x < this.CELLS_IN_BOARD; x++) {\n        const { color, direction } = this.cells[y][x];\n        if (color === undefined) continue;\n\n        ctx.fillStyle = color;\n        ctx.fillRect(x * this.CELL_SIZE, y * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);\n\n        if (direction) {\n          this.drawArrow(color, arrowByDirection[direction], { x, y });\n        }\n\n        ctx.beginPath();\n        ctx.rect(x * this.CELL_SIZE, y * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);\n        ctx.stroke();\n      }\n  }\n\n  addGradient() {\n    const { ctx } = this;\n\n    const gradient = ctx.createLinearGradient(0, 20, 0, this.BOARD_SIZE - 20);\n\n    gradient.addColorStop(0, 'blue');\n    gradient.addColorStop(.25, 'black');\n    gradient.addColorStop(.5, 'blue');\n    gradient.addColorStop(.75, 'black');\n    gradient.addColorStop(1, 'blue');\n\n    this.gradient = gradient;\n\n    ctx.fillStyle = gradient;\n    ctx.fillRect(0, 0, this.BOARD_SIZE, this.BOARD_SIZE);\n  }\n\n  async click(xPX, yPX) {\n    if (this.busy) return;\n\n    const x = xPX / this.CELL_SIZE | 0;\n    const y = yPX / this.CELL_SIZE | 0;\n\n    await this.main(y, x);\n\n    this.busy = false;\n  }\n\n  async main(y, x) {\n    const cell = this.cells[y][x];\n    if (cell.color && this.isEdgeCell(x, y)) {\n      const direction = this.getDirection(x, y);\n\n      const { destination, cause } = this.getDestination(x, y, direction);\n      if (this.playground.contains(cause) && !this.same(cell, destination)) {\n        this.busy = true;\n        cell.direction = direction;\n\n        await this.animateMotion(x, y, destination.x, destination.y, arrowByDirection[direction]);\n        this.refill(x, y, direction);\n\n        do {\n          this.removeSeries();\n          this.paint();\n        } while (await this.searchAndMoveMoveableCells());\n        this.paint();\n\n        if (this.won()) {\n          setTimeout(() => alert('You won!'), 80);\n        } else {\n          this.busy = false; // Disable further play\n        }\n      }\n    }\n  }\n\n  same(cell1, cell2) {\n    return cell1.x === cell2.x && cell1.y === cell2.y;\n  }\n\n  generateCells() {\n    const cells = Array(this.CELLS_IN_BOARD).fill().map((_, y) =>\n      Array(this.CELLS_IN_BOARD).fill().map((_, x) => {\n        return new Cell(y, x, 'no');\n      })\n    );\n\n    for (let x = this.CELLS_IN_DOCK_WIDTH; x < this.CELLS_IN_DOCK_LENGTH + this.CELLS_IN_DOCK_WIDTH; x++) {\n      for (let y = 0; y < this.CELLS_IN_DOCK_WIDTH; y++) {\n        cells[y][x] = new Cell(y, x);\n      }\n    }\n    for (let x = this.CELLS_IN_DOCK_WIDTH; x < this.CELLS_IN_DOCK_LENGTH + this.CELLS_IN_DOCK_WIDTH; x++) {\n      for (let y = this.CELLS_IN_BOARD - 1; y >= this.CELLS_IN_BOARD - this.CELLS_IN_DOCK_WIDTH; y--) {\n        cells[y][x] = new Cell(y, x);\n      }\n    }\n    for (let x = 0; x < this.CELLS_IN_DOCK_WIDTH; x++) {\n      for (let y = this.CELLS_IN_DOCK_WIDTH; y < this.CELLS_IN_DOCK_LENGTH + this.CELLS_IN_DOCK_WIDTH; y++) {\n        cells[y][x] = new Cell(y, x);\n      }\n    }\n    for (let x = this.CELLS_IN_DOCK_LENGTH + this.CELLS_IN_DOCK_WIDTH; x < this.CELLS_IN_BOARD; x++) {\n      for (let y = this.CELLS_IN_DOCK_WIDTH; y < this.CELLS_IN_DOCK_LENGTH + this.CELLS_IN_DOCK_WIDTH; y++) {\n        cells[y][x] = new Cell(y, x);\n      }\n    }\n\n    // setup initial middle cells - don't let them all be of the same color.\n    const colors = new Set();\n    let counter = 0;\n    for (let x = this.CELLS_IN_BOARD / 2 - 1 | 0; x < this.CELLS_IN_BOARD / 2 + 1 | 0; x++) {\n      for (let y = this.CELLS_IN_BOARD / 2 - 1 | 0; y < this.CELLS_IN_BOARD / 2 + 1 | 0; y++) {\n        counter++;\n        do {\n          cells[y][x] = new Cell(y, x);\n          colors.add(cells[y][x].color);\n        } while (counter === 4 && colors.size === 1);\n      }\n    }\n\n    return cells;\n\n  }\n\n  isEdgeCell(x, y) {\n    const peek = this.CELLS_IN_DOCK_WIDTH - 1;\n    return (\n      x === peek ||\n      this.CELLS_IN_BOARD - 1 - x === peek ||\n      y === peek ||\n      this.CELLS_IN_BOARD - 1 - y === peek\n    )\n  }\n\n  getDirection(x, y) {\n    const peek = this.CELLS_IN_DOCK_WIDTH - 1;\n    if (x === peek) return 'right';\n    if (this.CELLS_IN_BOARD - 1 - x === peek) return 'left';\n    if (y === peek) return 'down';\n    if (this.CELLS_IN_BOARD - 1 - y === peek) return 'up';\n    throw new Error('No Direction');\n  }\n\n  getDestination(x, y, direction) {\n    if (direction === 'down') {\n      while (!this.cells[++y][x].color);\n      return { destination: { x, y: y - 1 }, cause: { x, y } };\n    }\n    if (direction === 'up') {\n      while (!this.cells[--y][x].color);\n      return { destination: { x, y: y + 1 }, cause: { x, y } };\n    }\n    if (direction === 'right') {\n      while (!this.cells[y][++x].color);\n      return { destination: { x: x - 1, y }, cause: { x, y } };\n    }\n    if (direction === 'left') {\n      while (!this.cells[y][--x].color);\n      return { destination: { x: x + 1, y }, cause: { x, y } };\n    }\n  }\n\n  animateMotion(xFrom, yFrom, xTo, yTo, arrow) {\n    const { color } = this.cells[yFrom][xFrom];\n    return new Promise((resolve, reject) => {\n      const interval = setInterval(() => {\n        if (xFrom !== xTo) {\n          const nextX = xFrom + Math.sign(xTo - xFrom);\n          this.drawCell({ x: xFrom, y: yFrom }, { x: nextX, y: yTo }, color, arrow, nextX === xTo);\n          this.swapCells(xFrom, yFrom, nextX, yTo);\n          xFrom = nextX;\n        } else if (yFrom !== yTo) {\n          const nextY = yFrom + Math.sign(yTo - yFrom);\n          this.drawCell({ x: xFrom, y: yFrom }, { x: xTo, y: nextY }, color, arrow, nextY === yTo);\n          this.swapCells(xFrom, yFrom, xTo, nextY);\n          yFrom = nextY;\n        }\n        if (yFrom === yTo && xFrom === xTo) {\n          clearInterval(interval);\n          resolve();\n        }\n      }, 40);\n    });\n  }\n\n  drawCell(from, to, color, arrow, frame) {\n    const { x, y } = to;\n    const { ctx, CELL_SIZE: px } = this;\n    // clear old cell\n    ctx.clearRect(from.x * px, from.y * px, px, px);\n    ctx.fillStyle = this.gradient;\n    ctx.fillRect(from.x * px, from.y * px, px, px);\n\n    ctx.fillStyle = color;\n    ctx.fillRect(x * px, y * px, px, px);\n    this.drawArrow(color, arrow, to);\n\n    if (frame) {\n      ctx.beginPath();\n      ctx.rect(x * px, y * px, px, px);\n      ctx.stroke();\n    }\n  }\n\n  drawArrow(color, arrow, location) {\n    const { ctx, CELL_SIZE: px } = this;\n\n    ctx.font = `bold ${px / 2}px serif`;\n    ctx.fillStyle = Board.contrass(color);\n    ctx.textAlign = \"center\";\n    ctx.fillText(arrow, location.x * px + px / 2, location.y * px + px / 1.5);\n  }\n\n  async removeSeries() {\n    for (let x = this.playground.left; x <= this.playground.right; x++)\n      for (let y = this.playground.left; y <= this.playground.right; y++)\n        if (this.cells[y][x].color) {\n          const pathChain = [];\n          const pathLength = this.followPath(y, x, this.cells[y][x].color, pathChain);\n          if (pathLength >= 4) {\n            pathChain.forEach(cell => {\n              delete cell.color;\n              delete cell.direction;\n            })\n          }\n        }\n  }\n\n  refill(x, y, direction) {\n    if (direction === 'down') { while (--y > -1) this.swapCells(x, y, x, y + 1); this.cells[y + 1][x] = new Cell(y + 1, x); }\n    if (direction === 'up') { while (++y < this.CELLS_IN_BOARD) this.swapCells(x, y, x, y - 1); this.cells[y - 1][x] = new Cell(y - 1, x); }\n    if (direction === 'right') { while (--x > -1) this.swapCells(x, y, x + 1, y); this.cells[y][x + 1] = new Cell(y, x + 1); }\n    if (direction === 'left') { while (++x < this.CELLS_IN_BOARD) this.swapCells(x, y, x - 1, y); this.cells[y][x - 1] = new Cell(y, x - 1); }\n\n    this.paint();\n  }\n\n  swapCells(xFrom, yFrom, xTo, yTo) {\n    const [from, to] = [this.cells[yFrom][xFrom], this.cells[yTo][xTo]];\n    [this.cells[yFrom][xFrom], this.cells[yTo][xTo]] = [to, from];\n    [from.x, from.y, to.x, to.y] = [to.x, to.y, from.x, from.y];\n  }\n\n  followPath(y, x, color, pathChain) {\n    if (!this.playground.contains({ x, y })) return 0;\n    if (this.cells[y][x].color !== color) return 0;\n    if (this.cells[y][x].onPath) return 0;\n\n    this.cells[y][x].onPath = true;\n    pathChain.push(this.cells[y][x]);\n\n    const result = 1 + this.followPath(y, x + 1, color, pathChain) +\n      this.followPath(y, x - 1, color, pathChain) +\n      this.followPath(y + 1, x, color, pathChain) +\n      this.followPath(y - 1, x, color, pathChain);\n\n    this.cells[y][x].onPath = false;\n\n    return result;\n  }\n\n  async searchAndMoveMoveableCells() {\n    const promises = [];\n\n    const takenCellsByThisSearch = new Set();\n    this.cells.forEach(cells => cells.forEach(cell => {\n      if (this.playground.contains(cell) && cell.direction) {\n        const next = this.nextCell(cell, cell.direction);\n        if (!next.color && !takenCellsByThisSearch.has(next)) {\n          takenCellsByThisSearch.add(next);\n          promises.push(this.animateMotion(cell.x, cell.y, next.x, next.y, arrowByDirection[cell.direction]))\n        }\n      }\n    }));\n\n    await Promise.all(promises);\n    return promises.length > 0;\n  }\n\n  /** @param {{ x: number, y: number }} cell */\n  /** @param {'up' | 'down' | 'left' | 'right'} direction */\n  nextCell(cell, direction) {\n    const { x, y } = cell;\n    switch (direction) {\n      case 'down': return this.cells[y + 1][x];\n      case 'up': return this.cells[y - 1][x];\n      case 'right': return this.cells[y][x + 1];\n      case 'left': return this.cells[y][x - 1];\n    }\n  }\n\n  won() {\n    for (let x = this.CELLS_IN_DOCK_WIDTH; x < this.CELLS_IN_DOCK_WIDTH + this.CELLS_IN_DOCK_LENGTH; x++)\n      for (let y = this.CELLS_IN_DOCK_WIDTH; y < this.CELLS_IN_DOCK_WIDTH + this.CELLS_IN_DOCK_LENGTH; y++)\n        if (this.cells[y][x].color) return false;\n    return true;\n  }\n\n  static contrass(hex) {\n    hex = hex.slice(1);\n    // convert 3-digit hex to 6-digits.\n    if (hex.length === 3) {\n      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];\n    }\n    if (hex.length !== 6) {\n      throw new Error('Invalid HEX color.');\n    }\n    var r = parseInt(hex.slice(0, 2), 16),\n      g = parseInt(hex.slice(2, 4), 16),\n      b = parseInt(hex.slice(4, 6), 16);\n\n    // http://stackoverflow.com/a/3943023/112731\n    return (r * 0.299 + g * 0.587 + b * 0.114) > 186\n      ? '#000000'\n      : '#FFFFFF';\n  }\n}\n\n//# sourceURL=webpack:///./js/Board.js?");

/***/ }),

/***/ "./js/Cell.js":
/*!********************!*\
  !*** ./js/Cell.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const COLORS = [\n  '#ff0000', // red \n  '#0000ff', // blue \n  // '#008000', // green \n  '#ffff00', // yellow \n  '#ff0000', // biege \n  '#a52a2a' // brown;\n];\n\nmodule.exports = class Cell {\n  constructor(y, x, color) {\n    this.y = y;\n    this.x = x;\n    this.color = COLORS[color || Math.random() * COLORS.length | 0];\n    /** @type {'up' | 'down' | 'left' | 'right'} */\n    this.direction = undefined;\n  }\n}\n\n//# sourceURL=webpack:///./js/Cell.js?");

/***/ }),

/***/ "./js/Rectangle.js":
/*!*************************!*\
  !*** ./js/Rectangle.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = class Rectangle {\n  constructor(y, x, width, height) {\n    this.y = y;\n    this.x = x;\n    this.width = width;\n    this.height = height;\n  }\n\n  get top() {\n    return this.y;\n  }\n  get bottom() {\n    return this.y + this.height - 1;\n  }\n  get left() {\n    return this.x;\n  }\n  get right() {\n    return this.x + this.width - 1;\n  }\n\n  /** \n   * @param {{ x: number, y: number }} point\n   * @returns {boolean}\n  */ \n  contains(point) {\n    return (point.x >= this.left && point.x <= this.right) && (point.y >= this.top && point.y <= this.bottom);\n  }\n}\n\n//# sourceURL=webpack:///./js/Rectangle.js?");

/***/ }),

/***/ "./js/index.js":
/*!*********************!*\
  !*** ./js/index.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const boardElement = document.getElementById('board');\nconst Board = __webpack_require__(/*! ./Board */ \"./js/Board.js\");\nlet BOARD_SIZE;\nlet DOCK_LENGTH;\nlet DOCK_WIDTH;\nlet CELL_SIZE;\nlet CELLS_IN_BOARD;\n\nfunction setSizes() {\n  BOARD_SIZE = Math.min(boardElement.offsetHeight, boardElement.offsetWidth);\n  DOCK_LENGTH = BOARD_SIZE / 2 | 0;\n  DOCK_WIDTH = DOCK_LENGTH / 2 | 0;\n  CELLS_IN_BOARD = 24;\n  CELL_SIZE = DOCK_WIDTH / (CELLS_IN_BOARD / 4) | 0;\n}\nwindow.onresize = () => {\n  setSizes();\n  board.resize(BOARD_SIZE, DOCK_LENGTH, DOCK_WIDTH, CELLS_IN_BOARD, CELL_SIZE);\n};\nsetSizes();\n\nconst board = new Board(BOARD_SIZE, DOCK_LENGTH, DOCK_WIDTH, CELLS_IN_BOARD, CELL_SIZE);\n\nconst canvas = board.getElement();\nboardElement.appendChild(canvas);\ncanvas.width = canvas.height = BOARD_SIZE;\n\nboard.paint();\n\ncanvas.onmouseup = function(ev){\n  console.log(ev);\n  board.click(ev.offsetX, ev.offsetY);\n} \n\n//# sourceURL=webpack:///./js/index.js?");

/***/ })

/******/ });