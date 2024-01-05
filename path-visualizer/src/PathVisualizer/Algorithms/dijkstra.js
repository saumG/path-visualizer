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
    this.values.sort((a, b) => a.distance - b.distance); // Sort the array in ascending order of distance
  }

  // Getter method to get the length of the queue
  get length() {
    return this.values.length; // Return the number of nodes in the queue
  }
}

// Exported function implementing Dijkstra's algorithm
export function dijkstra(grid, startNode, finishNode) {
  let validPath = false; // Flag to track if a valid path is found

  const visitedNodesInOrder = []; // Array to store the order of visited nodes
  startNode.distance = 0; // Set the starting node's distance to 0
  const unvisitedNodes = new PriorityQueue(); // Create a new PriorityQueue
  unvisitedNodes.enqueue(startNode); // Add the starting node to the queue

  while (!!unvisitedNodes.length) {
    const closestNode = unvisitedNodes.dequeue(); // Get the node with the shortest distance

    if (closestNode.isWall) {
      console.log(
        `${closestNode.row} + ${closestNode.col} is a wall. skipping`
      );
      continue; // Skip if the node is a wall
    }

    if (closestNode.distance === Infinity) {
      return { visitedNodesInOrder, validPath }; // If node distance is Infinity, no path exists
    }

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === finishNode) {
      validPath = true;
      break;
    }

    // Update distances for unvisited neighbors
    updateUnvisitedNeighbors(closestNode, grid, unvisitedNodes);
  }

  return { visitedNodesInOrder, validPath }; // Return the visited nodes and the validPath flag
}

// Function to update distances of unvisited neighboring nodes
function updateUnvisitedNeighbors(node, grid, unvisitedNodes) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    const weight = neighbor.isWeight ? 5 : 1;
    const newDistance = node.distance + weight; // Calculate the new distance
    if (newDistance < neighbor.distance) {
      // Check if the new distance is shorter
      neighbor.distance = newDistance; // Update the neighbor's distance
      neighbor.previousNode = node; // Set the previous node for backtracking
      if (!neighbor.isVisited) {
        unvisitedNodes.enqueue(neighbor); // Add unvisited neighbor to the queue
      }
    }
  }
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

// Function to backtrack from the finish node to find the shortest path. ONLY CALL AFTER DIJKSTRA
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode; // Start with the finish node

  // Backtrack from the finish node to the start node
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode); // Add the node to the start of the array
    currentNode = currentNode.previousNode; // Move to the previous node in the path
  }
  return nodesInShortestPathOrder; // Return the array of nodes in the shortest path
}
