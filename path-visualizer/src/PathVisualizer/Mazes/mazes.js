import { updateGridState } from "../utils/gridUtils";

// Constants for grid size
const MAX_ROW_NUM = 21;
const MAX_COL_NUM = 51;
const directions = [
  [-2, 0],
  [2, 0],
  [0, -2],
  [0, 2],
]; // Up, Down, Left, Right

export function backtrackDFS(grid, r, c, pathList = []) {
  grid[r][c].isMazeVisited = true;
  grid[r][c].isMazeWall = false;
  grid[r][c].isMazePath = true;

  pathList.push([r, c]);

  let neighbors = getUnvisitedNeighbors(grid, r, c);

  while (neighbors.length > 0) {
    let nextIdx = Math.floor(Math.random() * neighbors.length);
    let cell = neighbors[nextIdx];
    neighbors.splice(nextIdx, 1);

    const rowNext = cell[0];
    const colNext = cell[1];

    if (!grid[rowNext][colNext].isMazeVisited) {
      const rowGap = cell[2];
      const colGap = cell[3];

      grid[rowGap][colGap].isMazeVisited = true;
      grid[rowGap][colGap].isMazePath = true;
      grid[rowGap][colGap].isMazeWall = false;

      pathList.push([rowGap, colGap]);
      backtrackDFS(grid, rowNext, colNext, pathList);
    }
  }

  return { grid, pathList };
}

function getUnvisitedNeighbors(grid, row, col) {
  const neighbors = [];

  for (let [dRow, dCol] of directions) {
    const newRow = row + dRow;
    const newRowGap = row + dRow / 2;
    const newCol = col + dCol;
    const newColGap = col + dCol / 2;

    if (
      newRow >= 0 &&
      newRow < MAX_ROW_NUM &&
      newCol >= 0 &&
      newCol < MAX_COL_NUM &&
      !grid[newRow][newCol].isMazeVisited
    ) {
      neighbors.push([newRow, newCol, newRowGap, newColGap]);
    }
  }
  return neighbors;
}
