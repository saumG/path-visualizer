import React, { useEffect, useState } from "react";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "./Algorithms/dijkstra.js";
import "./Board.css";
import Header from "./Header.jsx";
import Node from "./Node";
import {
  animateDijkstra,
  animateShortestPath,
} from "./utils/animationUtils.jsx";
import {
  clearPath,
  createInitialGrid,
  updateGridNode,
} from "./utils/gridUtils.jsx";

// Constants for grid size
const MAX_ROW_NUM = 21;
const MAX_COL_NUM = 50;

// Constants for start/finish nodes
const START_NODE_ROW = 10;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 20;

// Animation Time vairable
let totalAnimationTime = 0;

const Board = () => {
  // State for the grid and mouse interaction
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);

  const [currentAlgorithm, setCurrentAlgorithm] = useState("Dijkstra");
  const [isPlacingWalls, setIsPlacingWalls] = useState(true);
  const [isPlacingWeights, setIsPlacingWeights] = useState(false);

  const [startCoords, setStartCoords] = useState([]);
  const [finishCoords, setFinishCoords] = useState([]);
  const [isMovingStartNode, setIsMovingStartNode] = useState(false);
  const [isMovingFinishNode, setIsMovingFinishNode] = useState(false);

  const [visitedNodes, setVisitedNodes] = useState([]);
  const [shortestPathNodes, setShortestPathNodes] = useState([]);

  // Initialize the grid on component mount
  const resetGrid = () => {
    const initialGrid = createInitialGrid(
      MAX_ROW_NUM,
      MAX_COL_NUM,
      START_NODE_ROW,
      START_NODE_COL,
      FINISH_NODE_ROW,
      FINISH_NODE_COL
    );
    setGrid(initialGrid);
    setStartCoords([START_NODE_ROW, START_NODE_COL]);
    setFinishCoords([FINISH_NODE_ROW, FINISH_NODE_COL]);
    clearPath(visitedNodes, shortestPathNodes);
  };

  useEffect(() => {
    resetGrid();
  }, []);

  const isStartNode = (row, col) => {
    return grid[row][col].isStart;
  };

  const isFinishNode = (row, col) => {
    return grid[row][col].isFinish;
  };

  // Handle mouse down event on grid nodes
  const handleMouseDown = (row, col) => {
    let newGrid = grid;
    if (!isVisualizing) {
      if (isStartNode(row, col)) {
        setIsMovingStartNode(true);
        console.log("moving start node from " + row + " " + col);
      } else if (isFinishNode(row, col)) {
        setIsMovingFinishNode(true);
        console.log("moving finish node from " + row + " " + col);
      } else if (isPlacingWalls) {
        newGrid = updateGridNode(grid, row, col, {
          toggleWall: isPlacingWalls,
        });
      } else if (isPlacingWeights) {
        newGrid = updateGridNode(grid, row, col, {
          toggleWeight: isPlacingWeights,
        });
      }
      setGrid(newGrid);
      setMouseIsPressed(true);
    }
  };

  // Handle mouse enter event for drag functionality
  const handleMouseEnter = (row, col) => {
    if (mouseIsPressed && !isVisualizing) {
      let newGrid = grid;

      if (isMovingStartNode) {
        newGrid = updateGridNode(grid, row, col, {
          movingStartNode: isMovingStartNode,
        });
        setStartCoords([row, col]);
        console.log("setting new start coords to " + [row, col]);
      } else if (isMovingFinishNode) {
        newGrid = updateGridNode(grid, row, col, {
          movingFinishNode: isMovingFinishNode,
        });
        setFinishCoords([row, col]);
        console.log("setting new finish coords to " + [row, col]);
      } else if (isPlacingWalls) {
        newGrid = updateGridNode(grid, row, col, {
          toggleWall: isPlacingWalls,
        });
      } else if (isPlacingWeights) {
        newGrid = updateGridNode(grid, row, col, {
          toggleWeight: isPlacingWeights,
        });
      }

      setGrid(newGrid);
    }
  };

  // Reset mouse press state on mouse up
  const handleMouseUp = () => {
    if (!isVisualizing) {
      setMouseIsPressed(false);
      setIsMovingStartNode(false);
      setIsMovingFinishNode(false);
    }
  };

  //handle mouse leave
  const handleMouseLeave = (row, col) => {
    if (mouseIsPressed && !isVisualizing) {
      let newGrid = grid;
      if (isMovingStartNode) {
        newGrid = updateGridNode(grid, row, col, {
          movingStartNode: isMovingStartNode,
        });
      } else if (isMovingFinishNode) {
        newGrid = updateGridNode(grid, row, col, {
          movingFinishNode: isMovingFinishNode,
        });
      }
      setGrid(newGrid);
    }
  };

  const handleMouseLeaveGrid = () => {
    let newGrid = grid;
    // Check if start node is being moved and coordinates are valid
    if (isMovingStartNode && startCoords.length === 2) {
      newGrid = updateGridNode(newGrid, startCoords[0], startCoords[1], {
        movingStartNode: true,
      });
    }

    // Check if finish node is being moved and coordinates are valid
    if (isMovingFinishNode && finishCoords.length === 2) {
      newGrid = updateGridNode(newGrid, finishCoords[0], finishCoords[1], {
        movingFinishNode: true,
      });
    }

    setGrid(newGrid);
    handleMouseUp();

    // reset state to wall/weight
  };

  // Function to visualize Dijkstra's algorithm
  const visualizeDijkstra = () => {
    const startNode = grid[startCoords[0]][startCoords[1]];
    const finishNode = grid[finishCoords[0]][finishCoords[1]];

    console.log(startCoords);
    console.log(finishCoords);

    // Run Dijkstra's algorithm and get the path
    const { visitedNodesInOrder, validPath } = dijkstra(
      grid,
      startNode,
      finishNode
    );
    setVisitedNodes(visitedNodesInOrder);

    // Get nodes in the shortest path order
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    setShortestPathNodes(nodesInShortestPathOrder);

    // Animate the algorithm's path and shortest path
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, validPath);

    // Calculate the total animation time
    totalAnimationTime =
      visitedNodesInOrder.length * 10 + nodesInShortestPathOrder.length * 50;

    console.log("total animation time is " + totalAnimationTime);
  };

  const visualizeAlgorithm = (currentAlgorithm) => {
    console.log("visualizing algorithm: " + currentAlgorithm);
    setIsVisualizing(true);

    if (currentAlgorithm === "Dijkstra") {
      visualizeDijkstra();
    }

    // Reset isVisualizing after the total animation time
    setTimeout(() => {
      setIsVisualizing(false);
      console.log("set visualizing to false");
    }, totalAnimationTime);
  };

  const handleAlgorithmChange = (event) => {
    const selectedAlgorithm = event.target.value;
    console.log("updated current algorithm to " + selectedAlgorithm);

    setCurrentAlgorithm(selectedAlgorithm);
  };

  const toggleMousePlacementMode = () => {
    setIsPlacingWalls(!isPlacingWalls);
    setIsPlacingWeights(!isPlacingWeights);

    console.log("walls: " + !isPlacingWalls + " weights: " + !isPlacingWeights);
  };

  return (
    <>
      <Header
        handleAlgorithmChange={handleAlgorithmChange}
        onVisualize={() => {
          visualizeAlgorithm(currentAlgorithm);
        }}
        clearGrid={() => {
          resetGrid();
        }}
        clearPath={() => {
          clearPath(visitedNodes, shortestPathNodes);
        }}
        toggleWallWeight={() => {
          toggleMousePlacementMode();
        }}
        isPlacingWalls={isPlacingWalls}
      ></Header>

      <div className="grid" onMouseLeave={handleMouseLeaveGrid}>
        {grid.map((row, rowIdx) => (
          <div key={rowIdx}>
            {row.map((node, nodeIdx) => {
              const { row, col, isFinish, isStart, isWall, isWeight } = node;
              return (
                <Node
                  key={nodeIdx}
                  col={col}
                  isFinish={isFinish}
                  isStart={isStart}
                  isWall={isWall}
                  isWeight={isWeight}
                  mouseIsPressed={mouseIsPressed}
                  onMouseDown={() => handleMouseDown(row, col)}
                  onMouseEnter={() => handleMouseEnter(row, col)}
                  onMouseLeave={() => handleMouseLeave(row, col)}
                  onMouseUp={() => handleMouseUp()}
                  row={row}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};
export default Board;
