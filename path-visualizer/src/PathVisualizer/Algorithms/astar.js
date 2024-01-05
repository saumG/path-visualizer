class PriorityQueue {
  constructor() {
    this.values = []; // Initialize an empty array to hold the nodes
  }

  // Method to add a node to the queue and sort it
  enqueue(val) {
    this.values.push(val); // Add the node to the end of the array
    this.sort(); // Sort the array based on node distance
  }

  // Method to remove and return the node with the shortest distance
  dequeue() {
    return this.values.shift(); // Remove and return the first node in the array
  }

  // Method to sort the nodes in the queue based on their distance
  sort() {
    this.values.sort((a, b) => a.fCost - b.fCost); // Sort the array in ascending order of distance
  }

  // Getter method to get the length of the queue
  get length() {
    return this.values.length; // Return the number of nodes in the queue
  }
}
// Heuristic function (Manhattan distance)
function heuristic(nodeA, nodeB) {
  const dRow = Math.abs(nodeA.row - nodeB.row);
  const dCol = Math.abs(nodeA.col - nodeB.col);
  return dRow + dCol;
}

// Update unvisited neighbors for A*
function updateUnvisitedNeighborsAStar(node, finishNode, grid, unvisitedNodes) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    const weight = neighbor.isWeight ? 5 : 1;
    const gCostNew = node.gCost + weight;
    const hCostNew = heuristic(neighbor, finishNode);
    const fCostNew = gCostNew + hCostNew;

    if (fCostNew < neighbor.fCost) {
      neighbor.gCost = gCostNew;
      neighbor.hCost = hCostNew;
      neighbor.fCost = fCostNew;
      neighbor.previousNode = node;

      if (!neighbor.isVisited) {
        unvisitedNodes.enqueue(neighbor);
      }
    }
  }
}

// A* algorithm implementation
export function aStar(grid, startNode, finishNode) {
  let validPath = false;

  const visitedNodesInOrder = [];
  startNode.gCost = 0;
  startNode.hCost = heuristic(startNode, finishNode);
  startNode.fCost = startNode.gCost + startNode.hCost;
  const unvisitedNodes = new PriorityQueue();
  unvisitedNodes.enqueue(startNode);

  while (!!unvisitedNodes.length) {
    const closestNode = unvisitedNodes.dequeue();

    if (closestNode.isWall) {
      continue;
    }
    if (closestNode.fCost === Infinity) {
      console.log(`fCost is infinity`);
      return { visitedNodesInOrder, validPath };
    }

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === finishNode) {
      validPath = true;
      break;
    }

    updateUnvisitedNeighborsAStar(
      closestNode,
      finishNode,
      grid,
      unvisitedNodes
    );
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

  return neighbors; // Return the array of unvisited neighbors
}
