import { displayTetrominoInNextBlock } from "../elements/nextTetromino";
import { getRandomInt } from "./helpers";
import { setGameOverBlock, updateResultView } from "../elements/gameInfo";

export const playfield = [];

export class TetrisGame {
  constructor() {
    this.tetrominos = {
      I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
      O: [
        [1, 1],
        [1, 1],
      ],
      S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
      Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
    };
    this.colors = {
      I: "cyan",
      O: "yellow",
      T: "purple",
      S: "green",
      Z: "red",
      J: "blue",
      L: "orange",
    };
    this.sequence = ["I", "J", "L", "O", "S", "T", "Z"];
    this._initGame();
  }

  _initGame() {
    this.count = 0;
    this.playfield = [];
    this._initPlayfield();
    this.tetrominoSequence = [];
    this.gameOver = false;
    this.currentTetromino = this.getNextTetromino();
    this.nextTetromino = this.getNextTetromino();
    this.lines = 0;
    this.record = 0;
    this.level = 0;

    this.currentTimeSecs = 0;
    this.currentInterval = setInterval(() => {
      this.currentTimeSecs += 1;
    }, 1000);
  }

  _initPlayfield() {
    for (let row = -2; row < 20; row++) {
      this.playfield[row] = [];

      for (let col = 0; col < 10; col++) {
        this.playfield[row][col] = 0;
      }
    }
  }

  generateSequence() {
    const copySequence = new Array(...this.sequence);

    while (copySequence.length) {
      const rand = getRandomInt(0, copySequence.length - 1);
      const name = copySequence.splice(rand, 1)[0];
      this.tetrominoSequence.push(name);
    }
  }

  getNextTetromino() {
    if (!this.tetrominoSequence.length) {
      this.generateSequence();
    }

    const name = this.tetrominoSequence.pop();
    const matrix = this.tetrominos[name];

    // I, O start at the center, other ones - lefter
    const col = this.playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
    // I start with 21 row (translation -1), other ones - 22 row (translation -2)
    const row = name === "I" ? -1 : -2;

    return {
      name,
      matrix,
      row,
      col,
    };
  }

  getColorByName(name) {
    return this.colors[name] || "black";
  }

  // https://codereview.stackexchange.com/a/186834
  rotate(matrix) {
    const N = matrix.length - 1;

    const result = matrix.map((row, i) =>
      row.map((val, j) => matrix[N - j][i])
    );

    return result;
  }

  // check whether a tetromino can be here after any action
  isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (
          matrix[row][col] &&
          // out of borders
          (cellCol + col < 0 ||
            cellCol + col >= this.playfield[0].length ||
            cellRow + row >= this.playfield.length ||
            // intersects
            this.playfield[cellRow + row][cellCol + col])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  placeTetromino() {
    for (let row = 0; row < this.currentTetromino.matrix.length; row++) {
      for (let col = 0; col < this.currentTetromino.matrix[row].length; col++) {
        if (this.currentTetromino.matrix[row][col]) {
          // if the side of shape is out of playground
          if (this.currentTetromino.row + row < 0) {
            this.gameOver = true;
            setGameOverBlock(true);
            return;
          }

          this.playfield[this.currentTetromino.row + row][
            this.currentTetromino.col + col
          ] = this.currentTetromino.name;
        }
      }
    }

    // check if all filled rows below are cleaned
    for (let row = this.playfield.length - 1; row >= 0; ) {
      if (this.playfield[row].every((cell) => !!cell)) {
        this.lines++;
        this.level = Math.floor(this.lines / 10);
        updateResultView(this.lines, this.level + 1);
        // drop every row above this one
        for (let r = row; r >= 0; r--) {
          for (let c = 0; c < this.playfield[r].length; c++) {
            this.playfield[r][c] = this.playfield[r - 1][c];
          }
        }
      } else {
        row--;
      }
    }
    this.currentTetromino = this.nextTetromino;
    this.nextTetromino = this.getNextTetromino();
    displayTetrominoInNextBlock(
      this.nextTetromino.matrix,
      this.getColorByName(this.nextTetromino.name)
    );
  }

  restart() {
    this._initGame();
  }

  keyDownHandle(e) {
    // left or right
    if (e.which === 37 || e.which === 39) {
      const col =
        e.which === 37
          ? this.currentTetromino.col - 1
          : this.currentTetromino.col + 1;
      if (
        this.isValidMove(
          this.currentTetromino.matrix,
          this.currentTetromino.row,
          col
        )
      ) {
        this.currentTetromino.col = col;
      }
    }
    // up
    if (e.which === 38) {
      const matrix = this.rotate(this.currentTetromino.matrix);
      if (
        this.isValidMove(
          matrix,
          this.currentTetromino.row,
          this.currentTetromino.col
        )
      ) {
        this.currentTetromino.matrix = matrix;
      }
    }
    if (this.nextTetromino) {
      displayTetrominoInNextBlock(
        this.nextTetromino.matrix,
        this.getColorByName(game.nextTetromino.name)
      );
    }
    if (e.which === 40) {
      const row = this.currentTetromino.row + 1;
      if (
        !this.isValidMove(
          this.currentTetromino.matrix,
          row,
          this.currentTetromino.col
        )
      ) {
        this.currentTetromino.row = row - 1;
        this.placeTetromino();
        return;
      }
      this.currentTetromino.row = row;
    }

    if (e.which === 82) {
      if (this.gameOver) {
        updateResultView(0, 1);
        clearInterval(this.currentInterval);
        setGameOverBlock(false);
        this.restart();
      }
    }
  }
}

export const game = new TetrisGame();

// init next block
if (game.nextTetromino) {
  displayTetrominoInNextBlock(
    game.nextTetromino.matrix,
    game.getColorByName(game.nextTetromino.name)
  );
}

document.addEventListener("keydown", game.keyDownHandle.bind(game));
