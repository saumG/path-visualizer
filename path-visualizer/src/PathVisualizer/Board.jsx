import React, { useEffect, useRef, useState } from "react";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "./Algorithms/dijkstra.js";
import "./Board.css";
import Header from "./Header.jsx";
import Node from "./Node";
import {
  clearPath,
  createInitialGrid,
  updateGridState,
} from "./utils/gridUtils.jsx";

import finishIcon from "./images/node-finish.png";
import startIcon from "./images/node-start.png";

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
  const [isVisualized, setIsVisualized] = useState(false);
  const isVisualizingRef = useRef(false);
  const isVisualizedRef = useRef(false);

  const [currentAlgorithm, setCurrentAlgorithm] = useState("Dijkstra");
  const [isPlacingWalls, setIsPlacingWalls] = useState(true);
  const [isPlacingWeights, setIsPlacingWeights] = useState(false);

  const [isMovingStartNode, setIsMovingStartNode] = useState(false);
  const [isMovingFinishNode, setIsMovingFinishNode] = useState(false);

  const visitedNodesRef = useRef([]);
  const shortestPathNodesRef = useRef([]);
  const startCoordsRef = useRef([START_NODE_ROW, START_NODE_COL]);
  const finishCoordsRef = useRef([FINISH_NODE_ROW, FINISH_NODE_COL]);

  const updateCoords = (newStartCoords, newFinishCoords) => {
    startCoordsRef.current = newStartCoords;
    finishCoordsRef.current = newFinishCoords;
  };

  const resetNodeStates = () => {
    for (const row of grid) {
      for (const node of row) {
        node.isVisited = false;
        node.distance = Infinity;
        node.previousNode = null;
      }
    }
  };

  const resetGrid = (
    maxRowNum,
    maxColNum,
    startRow,
    startCol,
    finishRow,
    finishCol
  ) => {
    const initialGrid = createInitialGrid(
      maxRowNum,
      maxColNum,
      startRow,
      startCol,
      finishRow,
      finishCol
    );

    resetNodeStates();
    clearPath(visitedNodesRef.current, shortestPathNodesRef.current);

    updateCoords([startRow, startCol], [finishRow, finishCol]);

    setGrid(initialGrid);
    visitedNodesRef.current = [];
    shortestPathNodesRef.current = [];
    setIsVisualized(false);
  };

  const updateStartFinishIcons = (startRow, startCol, finishRow, finishCol) => {
    const startNode = document.getElementById(`node-${startRow}-${startCol}`);
    const finishNode = document.getElementById(
      `node-${finishRow}-${finishCol}`
    );

    console.log(startNode);
    console.log(finishNode);

    if (startNode) {
      startNode.classList.add("node-start");
      const startIconContainer = document.getElementById(
        `icon-container-${startRow}-${startCol}`
      );
      startIconContainer.innerHTML = `<img src="${startIcon}" alt="Start" class="node-start node-icon" draggable="false" />`;
    }

    if (finishNode) {
      finishNode.classList.add("node-finish");
      const finishIconContainer = document.getElementById(
        `icon-container-${finishRow}-${finishCol}`
      );
      finishIconContainer.innerHTML = `<img src="${finishIcon}" alt="Finish" class="node-finish node-icon" draggable="false" />`;
    }
  };

  useEffect(() => {
    resetGrid(
      MAX_ROW_NUM,
      MAX_COL_NUM,
      START_NODE_ROW,
      START_NODE_COL,
      FINISH_NODE_ROW,
      FINISH_NODE_COL
    );

    setTimeout(() => {
      updateStartFinishIcons(
        START_NODE_ROW,
        START_NODE_COL,
        FINISH_NODE_ROW,
        FINISH_NODE_COL
      );
    }, 0);
  }, []);

  const handleMouseDown = (row, col) => {
    if (!isVisualizing) {
      if (grid[row][col].isStart) {
        setIsMovingStartNode(true);
      } else if (grid[row][col].isFinish) {
        setIsMovingFinishNode(true);
      } else if (isPlacingWalls || isPlacingWeights) {
        const options = {
          movingStartNode: isMovingStartNode,
          movingFinishNode: isMovingFinishNode,
          toggleWall: isPlacingWalls,
          toggleWeight: isPlacingWeights,
        };
        const { newGrid, newStartCoords, newFinishCoords } = updateGridState(
          grid,
          startCoordsRef.current,
          finishCoordsRef.current,
          row,
          col,
          options
        );
        setGrid(newGrid);
        updateCoords(newStartCoords, newFinishCoords);
      }
      setMouseIsPressed(true);
    }
  };

  const handleMouseEnter = (row, col) => {
    if (mouseIsPressed && !isVisualizing) {
      const options = {
        movingStartNode: isMovingStartNode,
        movingFinishNode: isMovingFinishNode,
        toggleWall: isPlacingWalls,
        toggleWeight: isPlacingWeights,
      };
      const { newGrid, newStartCoords, newFinishCoords } = updateGridState(
        grid,
        startCoordsRef.current,
        finishCoordsRef.current,
        row,
        col,
        options
      );
      setGrid(newGrid);
      updateCoords(newStartCoords, newFinishCoords);
    }

    if ((isMovingStartNode || isMovingFinishNode) && isVisualized) {
      visualizeAlgorithm(currentAlgorithm);
      console.log("should have displayed algorithm");
    }
  };

  const handleMouseUp = () => {
    if (!isVisualizing) {
      setMouseIsPressed(false);
      setIsMovingStartNode(false);
      setIsMovingFinishNode(false);
    }
  };

  const handleMouseLeaveGrid = () => {
    let newGrid = grid;
    // Check if start node is being moved and coordinates are valid
    if (isMovingStartNode && startCoordsRef.current.length === 2) {
      newGrid = updateGridState(
        newGrid,
        startCoordsRef.current[0],
        startCoordsRef.current[1],
        {
          movingStartNode: true,
        }
      );
    }

    // Check if finish node is being moved and coordinates are valid
    if (isMovingFinishNode && finishCoordsRef.current.length === 2) {
      newGrid = updateGridState(
        newGrid,
        finishCoordsRef.current[0],
        finishCoordsRef.current[1],
        {
          movingFinishNode: true,
        }
      );
    }

    setGrid(newGrid);
    handleMouseUp();

    // reset state to wall/weight
  };

  const animateAlgorithm = (
    validPath,
    visitedNodesInOrder,
    shortestPathNodes
  ) => {
    if (validPath) {
      let newGrid = grid;
      visitedNodesInOrder.forEach((node, index) => {
        setTimeout(() => {
          newGrid[node.row][node.col].isVisited = true;
          newGrid[node.row][node.col].nodePathClassifier = "node-visited";

          let element = document.getElementById(`node-${node.row}-${node.col}`);
          element.classList.add("node-visited");
        }, 10 * index);
      });

      shortestPathNodes.forEach((node, index) => {
        setTimeout(() => {
          newGrid[node.row][node.col].isInShortestPath = true;
          newGrid[node.row][node.col].nodePathClassifier = "node-shortest-path";

          let element = document.getElementById(`node-${node.row}-${node.col}`);
          element.classList.add("node-shortest-path");
        }, 50 * index);
      });

      setGrid(newGrid);

      totalAnimationTime =
        visitedNodesInOrder.length * 10 + shortestPathNodes.length * 50;
    }
  };

  const instantAlgorithm = (
    validPath,
    visitedNodesInOrder,
    shortestPathNodes
  ) => {
    if (validPath) {
      // Update visited nodes
      let newGrid = grid;
      visitedNodesInOrder.forEach((node) => {
        newGrid[node.row][node.col].isVisited = true;
        newGrid[node.row][node.col].nodePathClassifier =
          "node-shortest-path-final";

        let element = document.getElementById(`node-${node.row}-${node.col}`);
        element.classList.add("node-visited-final");
      });

      // Update shortest path nodes
      shortestPathNodes.forEach((node) => {
        newGrid[node.row][node.col].isInShortestPath = true;
        newGrid[node.row][node.col].nodePathClassifier =
          "node-shortest-path-final";

        let element = document.getElementById(`node-${node.row}-${node.col}`);
        element.classList.add("node-shortest-path-final");
      });

      console.log(
        "visited: " +
          visitedNodesInOrder.length +
          " shortest: " +
          shortestPathNodes.length
      );
      setGrid(newGrid);
    }
    totalAnimationTime = 0;
    console.log("not valid path");
  };

  const visualizeDijkstra = () => {
    const startNode =
      grid[startCoordsRef.current[0]][startCoordsRef.current[1]];
    const finishNode =
      grid[finishCoordsRef.current[0]][finishCoordsRef.current[1]];

    clearPath(visitedNodesRef.current, shortestPathNodesRef.current);
    console.log("CLEARED old path");
    resetNodeStates();
    console.log("reset node states");

    // Run Dijkstra's algorithm and get the path
    const { visitedNodesInOrder, validPath } = dijkstra(
      grid,
      startNode,
      finishNode
    );
    visitedNodesRef.current = visitedNodesInOrder;
    console.log("valid path?: " + validPath);

    // Get nodes in the shortest path order
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    shortestPathNodesRef.current = nodesInShortestPathOrder;

    if (isVisualized) {
      console.log("DISPLAYING new path");
      instantAlgorithm(
        validPath,
        visitedNodesInOrder,
        nodesInShortestPathOrder
      );
    } else {
      console.log("ANIMATING new path");
      animateAlgorithm(
        validPath,
        visitedNodesInOrder,
        nodesInShortestPathOrder
      );
      console.log("total animation time is " + totalAnimationTime);
    }

    let newGrid = grid;

    let logGridVisited = [];
    let logGridShortest = [];
    for (let i = 0; i < 40; i++) {
      logGridVisited.push(newGrid[10][i].isVisited);
      logGridShortest.push(newGrid[10][i].isInShortestPath);
    }
    console.log("new grid visited is " + JSON.stringify(logGridVisited));
    console.log("new grid shortest is " + JSON.stringify(logGridShortest));
  };

  const visualizeAlgorithm = (currentAlgorithm) => {
    console.log("visualizing algorithm: " + currentAlgorithm);
    isVisualizingRef.current = true;
    isVisualizedRef.current = false;

    if (currentAlgorithm === "Dijkstra") {
      visualizeDijkstra();
    }

    // Reset isVisualizing after the total animation time
    setTimeout(() => {
      setIsVisualizing(false);
      setIsVisualized(true);
      isVisualizingRef.current = false;
      isVisualizedRef.current = true;
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
          resetGrid(
            MAX_ROW_NUM,
            MAX_COL_NUM,
            startCoordsRef.current[0],
            startCoordsRef.current[1],
            finishCoordsRef.current[0],
            finishCoordsRef.current[1]
          );
        }}
        clearPath={() => {
          clearPath(visitedNodesRef.current, shortestPathNodesRef.current);
          visitedNodesRef.current = [];
          shortestPathNodesRef.current = [];
          setIsVisualized(false);
        }}
        toggleWallWeight={() => {
          toggleMousePlacementMode();
        }}
        isPlacingWalls={isPlacingWalls}
      ></Header>

      <div className="grid" onMouseLeave={handleMouseLeaveGrid}>
        {grid.map((row, rowIdx) => (
          <div key={rowIdx}>
            {row.map((node) => {
              const {
                row,
                col,
                isFinish,
                isStart,
                isWall,
                isWeight,
                isVisited,
                isInShortestPath,
                nodeClassifier,
                nodePathClassifier,
              } = node;
              return (
                <Node
                  key={`${row}-${col}`}
                  col={col}
                  isFinish={isFinish}
                  isStart={isStart}
                  isWall={isWall}
                  isWeight={isWeight}
                  mouseIsPressed={mouseIsPressed}
                  onMouseDown={() => handleMouseDown(row, col)}
                  onMouseEnter={() => handleMouseEnter(row, col)}
                  onMouseUp={() => handleMouseUp()}
                  row={row}
                  isVisited={isVisited}
                  isInShortestPath={isInShortestPath}
                  nodeClassifier={nodeClassifier}
                  nodePathClassifier={nodePathClassifier}
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
