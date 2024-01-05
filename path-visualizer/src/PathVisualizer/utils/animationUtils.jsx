//NOT IN USE

// Function to animate the process of Dijkstra's algorithm
export const animateDijkstra = (
  visitedNodesInOrder, // Array of nodes visited in order
  nodesInShortestPathOrder, // Array of nodes in the shortest path
  validPath,
  grid // Boolean flag indicating if a valid path exists
) => {
  // If no valid path is found, log a message and skip animation
  if (!validPath) {
    console.log("No path found. Animation skipped.");
    // return; TODO:
  }
  let newGrid = grid;
  for (let i = 0; i <= visitedNodesInOrder.length; i++) {
    if (i === visitedNodesInOrder.length) {
      return animateShortestPath(nodesInShortestPathOrder, newGrid);
    }

    const node = visitedNodesInOrder[i];
    newGrid[node.row][node.col].isVisited = true;
  }
  return newGrid;
};

// Function to animate the shortest path found by Dijkstra's algorithm
export const animateShortestPath = (nodesInShortestPathOrder, grid) => {
  let newGrid = grid;

  for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
    const node = nodesInShortestPathOrder[i];
    newGrid[node.row][node.col].isInShortestPath = true;
  }

  return newGrid;
};

export const displayDijkstra = (
  visitedNodesInOrder,
  nodesInShortestPathOrder,
  validPath,
  grid
) => {
  let newGrid = grid;

  if (!validPath) {
    console.log("not valid path");
    return newGrid;
  }

  // Update visited nodes
  visitedNodesInOrder.forEach((node) => {
    newGrid[node.row][node.col].isVisited = true;
  });

  console.log("visited nodes: " + visitedNodesInOrder.length);

  // Update shortest path nodes
  nodesInShortestPathOrder.forEach((node) => {
    newGrid[node.row][node.col].isInShortestPath = true;
  });
  console.log("shortest path nodes: " + nodesInShortestPathOrder.length);

  return newGrid;
};
