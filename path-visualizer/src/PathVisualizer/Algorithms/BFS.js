// Queue data structure for BFS
class Queue {
  constructor() {
    this.values = [];
  }

  enqueue(val) {
    this.values.push(val);
  }

  dequeue() {
    return this.values.shift();
  }

  get length() {
    return this.values.length;
  }
}

// BFS algorithm implementation
export function breadthFirstSearch(grid, startNode, finishNode) {
  let validPath = false;
  const visitedNodesInOrder = [];
  startNode.isVisited = true;
  const queue = new Queue();
  queue.enqueue(startNode);

  while (queue.length > 0) {
    const currentNode = queue.dequeue();
    visitedNodesInOrder.push(currentNode);

    if (currentNode === finishNode) {
      validPath = true;
      break;
    }

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        neighbor.isVisited = true;
        neighbor.previousNode = currentNode;
        queue.enqueue(neighbor);
      }
    }
  }

  return { visitedNodesInOrder, validPath };
}

// Function to retrieve unvisited neighboring nodes
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;

  // Check and add unvisited neighbors (up, down, left, right)
  if (row > 0 && !grid[row - 1][col].isVisited)
    neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1 && !grid[row + 1][col].isVisited)
    neighbors.push(grid[row + 1][col]);
  if (col > 0 && !grid[row][col - 1].isVisited)
    neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1 && !grid[row][col + 1].isVisited)
    neighbors.push(grid[row][col + 1]);

  return neighbors;
}
