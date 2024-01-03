// Function to create the initial grid for the pathfinding visualization
export const createInitialGrid = (
  MAX_ROW_NUM, // Maximum number of rows
  MAX_COL_NUM, // Maximum number of columns
  START_NODE_ROW, // Row index of the start node
  START_NODE_COL, // Column index of the start node
  FINISH_NODE_ROW, // Row index of the finish node
  FINISH_NODE_COL // Column index of the finish node
) => {
  const grid = [];
  for (let row = 0; row < MAX_ROW_NUM; row++) {
    const currentRow = [];
    for (let col = 0; col < MAX_COL_NUM; col++) {
      // Add a node to the current row
      currentRow.push(
        createNode(
          row,
          col,
          START_NODE_ROW,
          START_NODE_COL,
          FINISH_NODE_ROW,
          FINISH_NODE_COL
        )
      );
    }
    // Add the current row to the grid
    grid.push(currentRow);
  }
  return grid;
};

// Function to create a node with its properties
const createNode = (
  row, // Row index of the node
  col, // Column index of the node
  START_NODE_ROW, // Row index of the start node for comparison
  START_NODE_COL, // Column index of the start node for comparison
  FINISH_NODE_ROW, // Row index of the finish node for comparison
  FINISH_NODE_COL // Column index of the finish node for comparison
) => {
  return {
    row, // Row index of the node
    col, // Column index of the node
    isStart: row === START_NODE_ROW && col === START_NODE_COL, // Is this the start node?
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL, // Is this the finish node?
    distance: Infinity, // Initial distance set to Infinity
    isVisited: false, // Has this node been visited?
    isWall: false, // Is this node a wall?
    previousNode: null, // Reference to the previous node in the path
  };
};

// Function to toggle the wall state of a node in the grid
export const updateGridState = (
  grid,
  startCoords,
  finishCoords,
  row,
  col,
  options
) => {
  const newGrid = grid.map((innerRow) => innerRow.slice());
  const node = newGrid[row][col];

  let newStartCoords = startCoords;
  let newFinishCoords = finishCoords;

  if (options.movingStartNode && !node.isFinish) {
    const [oldStartRow, oldStartCol] = startCoords;
    newGrid[oldStartRow][oldStartCol].isStart = false;

    node.isStart = true;
    node.isWall = false;
    node.isWeight = false;
    newStartCoords = [row, col];
  } else if (options.movingFinishNode && !node.isStart) {
    const [oldFinishRow, oldFinishCol] = finishCoords;
    newGrid[oldFinishRow][oldFinishCol].isFinish = false;
    console.log("removed old finish " + finishCoords);

    node.isFinish = true;
    node.isWall = false;
    node.isWeight = false;
    newFinishCoords = [row, col];
    console.log("added new finish " + [row, col]);
  } else if (options.toggleWall) {
    node.isWall = !node.isWall;
  } else if (options.toggleWeight) {
    node.isWeight = !node.isWeight;
  }
  return { newGrid, newStartCoords, newFinishCoords };
};

export const clearPath = (visitedNodesInOrder, nodesInShortestPathOrder) => {
  for (let i = 0; i < visitedNodesInOrder.length; i++) {
    const node = visitedNodesInOrder[i];
    let element = document.getElementById(`node-${node.row}-${node.col}`);
    element.classList.remove("node-visited", "node-visited-final");
    // console.log("removed visited class for node " + node.row + "-" + node.col);
  }
  // console.log(
  //   "cleared " + visitedNodesInOrder.length + " visited node classes"
  // );

  for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
    const node = nodesInShortestPathOrder[i];
    let element = document.getElementById(`node-${node.row}-${node.col}`);
    element.classList.remove("node-shortest-path", "node-shortest-path-final");

    // console.log(
    //   "removed shortest path class for node " + node.row + "-" + node.col
    // );
  }

  // console.log(
  //   "cleared " + nodesInShortestPathOrder.length + " shortest path node classes"
  // );

  console.log("cleared path");
};

export const resetStartFinishNodes = (
  maxRowNum,
  maxColNum,
  startRow,
  startCol,
  finishRow,
  finishCol
) => {
  return createInitialGrid(
    maxRowNum,
    maxColNum,
    startRow,
    startCol,
    finishRow,
    finishCol
  );
};
