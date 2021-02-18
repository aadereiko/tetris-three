const levelValueElement = document.querySelector("#level-value");
const linesValueElement = document.querySelector("#lines-value");
const timeValueElement = document.querySelector("#time-value");

const gameOverElement = document.querySelector("#game-over");
const layerElement = document.querySelector("#gray-layer");

export function updateResultView(lines, level) {
  linesValueElement.textContent = lines;
  levelValueElement.textContent = level;
}

export function setGameOverBlock(visible) {
  if (visible) {
    layerElement.style.display = "block";
    gameOverElement.style.display = "block";
  } else {
    layerElement.style.display = "none";
    gameOverElement.style.display = "none";
  }
}

export function setTimeValue(seconds) {
    let secs = Math.floor(seconds % 60);
    secs = secs < 10 ? `0${secs}` : secs;

  if (seconds < 60) {
    timeValueElement.textContent = `${secs}s`;
  } else {
    let mins = Math.floor(seconds / 60);
    mins = mins < 10 ? `0${mins}` : mins;
    timeValueElement.textContent = `${mins}:${secs}`;
  }
}

updateResultView(0, 1);
setTimeValue(0)