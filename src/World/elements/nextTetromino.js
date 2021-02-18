const nextTetrominoMatrix = [];

const nextTetrominoBlockElement = document.querySelector(
  "#next-tetromino-block"
);

function addColumnToRow(cellIndex, rowIndex) {
  const col = document.createElement("div");
  col.classList.add("next-block-col");
  col.id = `cell-${rowIndex}-${cellIndex}`;

  const row = document.querySelector(`#next-block-row-${rowIndex}`);
  if (row) {
    row.appendChild(col);
  }
}

function resetBlocks() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      const cell = document.querySelector(`#cell-${row}-${col}`);
      cell.style.backgroundColor = "white";
    }
  }
}

export function displayTetrominoInNextBlock(matrix, color) {
  resetBlocks();
  // separated handle for I
  const startRow = matrix.length === 4 ? 0 : 1;
  const startCol = matrix.length === 4 ? 0 : 1;

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      const finalRow = row + startRow;
      const finalCol = col + startCol;
      const cell = document.querySelector(`#cell-${finalRow}-${finalCol}`);

      if (matrix[row][col]) {
        cell.style.backgroundColor = color;
        nextTetrominoMatrix[finalRow][finalCol] = 1;
      } else {
        cell.style.backgroundColor = "white";
        nextTetrominoMatrix[finalRow][finalCol] = 0;
      }
    }
  }
}

const rowsAmount = 4;
const colsAmount = 5;

for (let i = 0; i < colsAmount * rowsAmount; i++) {
  const rowIndex = Math.floor(i / colsAmount);
  const colIndex = Math.floor(i % colsAmount);

  if (!(i % colsAmount)) {
    nextTetrominoMatrix.push([0, 0, 0, 0, 0, 0]);
    // add row
    const row = document.createElement("div");
    row.classList.add("next-block-row");

    row.id = `next-block-row-${rowIndex}`;
    nextTetrominoBlockElement.appendChild(row);
  }

  addColumnToRow(colIndex, rowIndex);
}
