import {
  BoxGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
} from "three/build/three.module";
import { setTimeValue } from "../elements/gameInfo";
import { game } from "../game";

class TetrominosThree {
  constructor() {
    this.cells = [];
    this.CELL_SIDE = 50;
    this._initCells();
  }

  getCoordinatesByIndexes(row, col) {
    const topLeft = { x: -250, y: 500 };

    const xDistance = col * this.CELL_SIDE;
    const yDistance = row * this.CELL_SIDE;

    const coords = {
      x: topLeft.x + xDistance,
      y: topLeft.y - yDistance,
    };

    return coords;
  }

  getCellIndexByIndexes(row, col) {
    return row * 10 + col;
  }

  getEdgesOfCell(cell) {
    return cell.children[0];
  }

  syncViewWithPlayfield() {
    const playfield = game.playfield;

    for (let row = 0; row < playfield.length; row++) {
      for (let col = 0; col < playfield[row].length; col++) {
        const cellIndex = this.getCellIndexByIndexes(row, col);
        const cellMaterial = this.cells[cellIndex].material;
        const edgesMaterial = this.getEdgesOfCell(this.cells[cellIndex])
          .material;
        const prevCellMaterialVisible = cellMaterial.visible;

        if (playfield[row][col]) {
          cellMaterial.visible = true;
          edgesMaterial.visible = true;
        } else {
          cellMaterial.visible = false;
          edgesMaterial.visible = false;
        }

        if (prevCellMaterialVisible !== cellMaterial.visible) {
          cellMaterial.needsUpdate = true;
        }
      }
    }
  }

  syncViewTetromino(tetromino) {
    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
          const cellIndex = this.getCellIndexByIndexes(
            tetromino.row + row,
            tetromino.col + col
          );
          if (cellIndex >= 0) {
            const cellMaterial = this.cells[cellIndex].material;
            cellMaterial.visible = true;
            const edgesMaterial = this.getEdgesOfCell(this.cells[cellIndex])
              .material;
            edgesMaterial.visible = true;
            cellMaterial.color.set(game.getColorByName(tetromino.name));
            cellMaterial.needsUpdate = true;
          }
        }
      }
    }
  }

  _initCells() {
    const cellGeom = new BoxGeometry(
      this.CELL_SIDE,
      this.CELL_SIDE,
      this.CELL_SIDE
    );

    for (let i = 0; i < 200; i++) {
      const row = Math.floor(i / 10);
      const col = Math.floor(i % 10);

      const cellMat = new MeshPhongMaterial();
      const cell = new Mesh(cellGeom, cellMat);

      const edgesGeo = new EdgesGeometry(cell.geometry);
      const edgesMat = new LineBasicMaterial({
        color: "black",
        lineWidth: 1,
      });
      const edges = new LineSegments(edgesGeo, edgesMat);
      edges.renderOrder = 1;

      const { x, y } = this.getCoordinatesByIndexes(row, col);
      cell.position.x = x;
      cell.position.y = y;
      cell.castShadow = true;
      cell.receiveShadow = true;
      cell.add(edges);

      this.cells.push(cell);
    }
  }

  tick() {
    // current tetromino
    if (!game.gameOver) {
      const tetromino = game.currentTetromino;
      this.syncViewWithPlayfield();
      setTimeValue(game.currentTimeSecs);

      if (tetromino) {
        if (++game.count > Math.abs(35 - 5 * game.level)) {
          tetromino.row++;
          game.count = 0;
        }

        if (!game.isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
          tetromino.row--;
          game.placeTetromino();
        }

        for (let row = 0; row < tetromino.matrix.length; row++) {
          for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {
              this.syncViewTetromino(tetromino);
            }
          }
        }
      }
    }
  }
}

export const tetrominoThree = new TetrominosThree();
