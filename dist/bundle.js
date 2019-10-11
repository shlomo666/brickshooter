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

eval("const Cell = __webpack_require__(/*! ./Cell */ \"./js/Cell.js\");\n\nmodule.exports = class Board {\n  constructor(BOARD_SIZE, DOCK_LENGTH, DOCK_WIDTH, CELLS_IN_BOARD, CELL_SIZE) {\n    this.canvas = document.createElement('canvas');\n    this.canvas.height = this.canvas.width = BOARD_SIZE;\n    this.BOARD_SIZE = BOARD_SIZE;\n    this.DOCK_LENGTH = DOCK_LENGTH;\n    this.DOCK_WIDTH = DOCK_WIDTH;\n    this.CELLS_IN_BOARD = CELLS_IN_BOARD;\n    this.CELL_SIZE = CELL_SIZE;\n\n    this.cells = this.generateCells();\n  }\n\n  getElement() {\n    this.paint();\n    return canvas;\n  }\n\n  paint() {\n    const ctx = this.canvas.getContext('2d');\n    ctx.clearRect(0, 0, this.BOARD_SIZE, this.BOARD_SIZE);\n\n    for (y = 0; y < this.CELLS_IN_BOARD; y++)\n      for (x = 0; x < this.CELLS_IN_BOARD; x++) {\n        ctx.fillStyle = this.cells[y][x].color;\n        ctx.fillRect(x, y, this.CELL_SIZE, this.CELL_SIZE);\n      }\n  }\n\n  generateCells() {\n    return Array(this.CELLS_IN_BOARD).fill().map((_, y) =>\n      Array(this.CELLS_IN_BOARD).fill().map((_, x) =>\n        new Cell(y, x)\n      ));\n  }\n\n  resize(BOARD_SIZE, DOCK_LENGTH, DOCK_WIDTH, CELLS_IN_BOARD, CELL_SIZE) {\n    this.canvas.height = this.canvas.width = BOARD_SIZE;\n    this.BOARD_SIZE = BOARD_SIZE;\n    this.DOCK_LENGTH = DOCK_LENGTH;\n    this.DOCK_WIDTH = DOCK_WIDTH;\n    this.CELLS_IN_BOARD = CELLS_IN_BOARD;\n    this.CELL_SIZE = CELL_SIZE;\n    this.paint();\n  }\n}\n\n//# sourceURL=webpack:///./js/Board.js?");

/***/ }),

/***/ "./js/Cell.js":
/*!********************!*\
  !*** ./js/Cell.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const COLORS = ['red', 'blue', 'green', 'yellow', 'biege'];\n\nmodule.exports = class Cell {\n  constructor(y, x, color) {\n    this.y = y;\n    this.x = x;\n    this.color = color || Math.random() * COLORS.length | 0;\n  }\n}\n\n//# sourceURL=webpack:///./js/Cell.js?");

/***/ }),

/***/ "./js/index.js":
/*!*********************!*\
  !*** ./js/index.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const boardElement = document.getElementById('board');\nconst Board = __webpack_require__(/*! ./Board */ \"./js/Board.js\");\nlet BOARD_SIZE;\nlet DOCK_LENGTH;\nlet DOCK_WIDTH;\nlet CELL_SIZE;\nlet CELLS_IN_BOARD;\n\nfunction setSizes() {\n  BOARD_SIZE = Math.min(boardElement.offsetHeight, boardElement.offsetWidth);\n  DOCK_LENGTH = BOARD_SIZE;\n  DOCK_WIDTH = DOCK_LENGTH / 4 | 0;\n  CELLS_IN_BOARD = 20;\n  CELL_SIZE = DOCK_WIDTH / (CELLS_IN_BOARD / 4) | 0;\n}\ndocument.onresize = () => {\n  setSizes();\n  board.resize(BOARD_SIZE, DOCK_LENGTH, DOCK_WIDTH, CELLS_IN_BOARD, CELL_SIZE);\n};\nsetSizes();\n\nconst board = new Board(BOARD_SIZE, DOCK_LENGTH, DOCK_WIDTH, CELLS_IN_BOARD, CELL_SIZE);\n\nboardElement.appendChild(board.getElement());\n\nboard.paint();\n\n//# sourceURL=webpack:///./js/index.js?");

/***/ })

/******/ });