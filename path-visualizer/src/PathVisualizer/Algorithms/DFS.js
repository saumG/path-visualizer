// DFS algorithm implementation
export function depthFirstSearch(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const stack = [startNode]; // Using an array as a stack

  while (stack.length > 0) {
    const currentNode = stack.pop();
    if (!currentNode.isVisited && !currentNode.isWall) {
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);

      if (currentNode === finishNode) {
        return { visitedNodesInOrder, validPath: true };
      }

      const neighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        neighbor.previousNode = currentNode;
        stack.push(neighbor);
      }
    }
  }

  return { visitedNodesInOrder, validPath: false };
}

// Function to retrieve unvisited neighboring nodes
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter((neighbor) => !neighbor.isVisited);
}
