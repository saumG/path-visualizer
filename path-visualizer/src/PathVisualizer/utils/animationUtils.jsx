// Function to animate the process of Dijkstra's algorithm
export const animateDijkstra = (
  visitedNodesInOrder, // Array of nodes visited in order
  nodesInShortestPathOrder, // Array of nodes in the shortest path
  validPath // Boolean flag indicating if a valid path exists
) => {
  // If no valid path is found, log a message and skip animation
  if (!validPath) {
    console.log("No path found. Animation skipped.");
    // return; TODO:
  }

  // Iterate over each node visited in order
  for (let i = 0; i <= visitedNodesInOrder.length; i++) {
    if (i === visitedNodesInOrder.length) {
      // Once all nodes have been visited, animate the shortest path
      setTimeout(() => {
        animateShortestPath(nodesInShortestPathOrder);
      }, 10 * i);
      return;
    }

    // Animate each node as it is visited
    setTimeout(() => {
      const node = visitedNodesInOrder[i];
      // Update the class of the node for CSS-based visualization
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node node-visited";
    }, 10 * i); // The delay ensures the animation is visible
  }
};

// Function to animate the shortest path found by Dijkstra's algorithm
export const animateShortestPath = (nodesInShortestPathOrder) => {
  // Iterate over each node in the shortest path
  for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
    // Animate each node in the shortest path
    setTimeout(() => {
      const node = nodesInShortestPathOrder[i];
      // Update the class of the node for CSS-based visualization
      document.getElementById(`node-${node.row}-${node.col}`).className =
        "node node-shortest-path";
    }, 50 * i); // The delay ensures the animation is visible and distinct from the visited nodes animation
  }
};

export const displayDijkstra = (
  visitedNodesInOrder,
  nodesInShortestPathOrder,
  validPath
) => {
  if (!validPath) {
    console.log("not valid path");
    return;
  }

  // Update visited nodes
  visitedNodesInOrder.forEach((node) => {
    document.getElementById(`node-${node.row}-${node.col}`).className =
      "node node-visited-final";
  });

  console.log("visited nodes: " + visitedNodesInOrder.length);

  // Update shortest path nodes
  nodesInShortestPathOrder.forEach((node) => {
    document.getElementById(`node-${node.row}-${node.col}`).className =
      "node node-shortest-path-final";
  });
  console.log("shortest path nodes: " + nodesInShortestPathOrder.length);

  return;
};
