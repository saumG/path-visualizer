import React, { useEffect, useRef, useState } from "react";
import { breadthFirstSearch } from "./Algorithms/BFS.js";
import { depthFirstSearch } from "./Algorithms/DFS.js";
import { aStar } from "./Algorithms/astar.js";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "./Algorithms/dijkstra.js";
import "./Board.css";
import Header from "./Components/Header.jsx";
import Node from "./Components/Node.jsx";
import {
  clearPath,
  createInitialGrid,
  updateGridState,
} from "./utils/gridUtils.jsx";

import { backtrackDFS } from "./Mazes/mazes.js";

import finishIcon from "./images/node-finish.png";
import startIcon from "./images/node-start.png";

// Constants for grid size
const MAX_ROW_NUM = 21;
const MAX_COL_NUM = 51;

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
  const [currentAlgorithm, setCurrentAlgorithm] = useState("Dijkstra");
  const [currentMaze, setCurrentMaze] = useState("Maze");

  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isVisualized, setIsVisualized] = useState(false);
  const isVisualizingRef = useRef(false);
  const isVisualizedRef = useRef(false);

  const [isPlacingWalls, setIsPlacingWalls] = useState(true);
  const [isPlacingWeights, setIsPlacingWeights] = useState(false);

  const [isMovingStartNode, setIsMovingStartNode] = useState(false);
  const [isMovingFinishNode, setIsMovingFinishNode] = useState(false);
  const startCoordsRef = useRef([START_NODE_ROW, START_NODE_COL]);
  const finishCoordsRef = useRef([FINISH_NODE_ROW, FINISH_NODE_COL]);

  const visitedNodesRef = useRef([]);
  const shortestPathNodesRef = useRef([]);

  const updateCoords = (newStartCoords, newFinishCoords) => {
    startCoordsRef.current = newStartCoords;
    finishCoordsRef.current = newFinishCoords;
  };

  const resetNodeStates = () => {
    for (const row of grid) {
      for (const node of row) {
        node.isVisited = false;
        node.distance = Infinity;
        node.fCost = Infinity;
        node.gCost = Infinity;
        node.hcost = Infinity;
        node.previousNode = null;
        node.isMazeWall = !(node.isStart || node.isFinish);
        node.isMazePath = false;
        node.isMazeVisited = node.isStart || node.isFinish;
      }
    }
  };

  const clearWallsWeights = (selector) => {
    let newGrid = grid;
    for (let row = 0; row < MAX_ROW_NUM; row++) {
      for (let col = 0; col < MAX_COL_NUM; col++) {
        let element = document.getElementById(`node-${row}-${col}`);
        if (selector === "wall") {
          element.classList.remove("node-wall");
          newGrid[row][col].isWall = false;
        } else if (selector === "weight") {
          element.classList.remove("node-weight");
          newGrid[row][col].isWeight = false;
        } else {
          element.classList.remove("node-wall", "node-weight");
          newGrid[row][col].isWall = false;
          newGrid[row][col].isWeight = false;
        }
      }
    }
    setGrid(newGrid);
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
    setTimeout(() => {
      clearWallsWeights("");
    });
    visitedNodesRef.current = [];
    shortestPathNodesRef.current = [];
    setIsVisualized(false);
  };

  const updateStartFinishIcons = (startRow, startCol, finishRow, finishCol) => {
    const startNode = document.getElementById(`node-${startRow}-${startCol}`);
    const finishNode = document.getElementById(
      `node-${finishRow}-${finishCol}`
    );

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

  const setAllWalls = () => {
    let newGrid = grid;

    for (let row = 0; row < MAX_ROW_NUM; row++) {
      for (let col = 0; col < MAX_COL_NUM; col++) {
        let node = newGrid[row][col];

        if (node.isStart || node.isFinish) {
        } else {
          node.isWall = true;
          let element = document.getElementById(`node-${row}-${col}`);
          element.classList.add("node-wall");
        }
      }
    }

    return newGrid;
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
    setGrid(newGrid);
    handleMouseUp();
  };

  const animateAlgorithm = (
    validPath,
    visitedNodesInOrder,
    shortestPathNodes
  ) => {
    if (validPath) {
      let newGrid = grid;

      const visitedAnimationTime = visitedNodesInOrder.length * 10;

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
        }, visitedAnimationTime + 50 * index);
      });

      setGrid(newGrid);

      totalAnimationTime = visitedAnimationTime + shortestPathNodes.length * 50;
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

  const animateOrDisplayAlgo = () => {
    const startNode =
      grid[startCoordsRef.current[0]][startCoordsRef.current[1]];
    const finishNode =
      grid[finishCoordsRef.current[0]][finishCoordsRef.current[1]];

    clearPath(visitedNodesRef.current, shortestPathNodesRef.current);
    resetNodeStates();

    let visitedNodesInOrder, validPath;

    if (currentAlgorithm === "Dijkstra") {
      ({ visitedNodesInOrder, validPath } = dijkstra(
        grid,
        startNode,
        finishNode
      ));
    } else if (currentAlgorithm === "Astar") {
      ({ visitedNodesInOrder, validPath } = aStar(grid, startNode, finishNode));
    } else if (currentAlgorithm === "DFS") {
      ({ visitedNodesInOrder, validPath } = depthFirstSearch(
        grid,
        startNode,
        finishNode
      ));
    } else if (currentAlgorithm === "BFS") {
      ({ visitedNodesInOrder, validPath } = breadthFirstSearch(
        grid,
        startNode,
        finishNode
      ));
    }

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
  };

  const visualizeAlgorithm = (currentAlgorithm) => {
    console.log("visualizing algorithm: " + currentAlgorithm);
    isVisualizingRef.current = true;
    isVisualizedRef.current = false;

    animateOrDisplayAlgo();

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

    if (selectedAlgorithm === "BFS" || selectedAlgorithm === "DFS") {
      clearWallsWeights("weight");
      setIsPlacingWalls(true);
      setIsPlacingWeights(false);
    }

    clearPath(visitedNodesRef.current, shortestPathNodesRef.current);
    visitedNodesRef.current = [];
    shortestPathNodesRef.current = [];
    setIsVisualized(false);

    setCurrentAlgorithm(selectedAlgorithm);
  };

  const toggleMousePlacementMode = () => {
    if (currentAlgorithm === "Astar" || currentAlgorithm === "Astar") {
      setIsPlacingWalls(!isPlacingWalls);
      setIsPlacingWeights(!isPlacingWeights);
      console.log(
        "walls: " + !isPlacingWalls + " weights: " + !isPlacingWeights
      );
    }
  };

  const handleMazeChange = (event) => {
    const selectedMaze = event.target.value;
    let newGrid = grid;

    if (selectedMaze === "Recursive") {
      setTimeout(() => {
        resetGrid(
          MAX_ROW_NUM,
          MAX_COL_NUM,
          startCoordsRef.current[0],
          startCoordsRef.current[1],
          finishCoordsRef.current[0],
          finishCoordsRef.current[1]
        );
      }, 10);

      setTimeout(() => {
        newGrid = setAllWalls();
      }, 100);

      let { mazedGrid, pathList } = backtrackDFS(newGrid, 1, 1);
      let counter = 3;

      for (let cell of pathList) {
        let row = cell[0];
        let col = cell[1];
        if (
          !(
            row === startCoordsRef.current[0] &&
            col === startCoordsRef.current[1]
          ) &&
          !(
            row === finishCoordsRef.current[0] &&
            col === finishCoordsRef.current[1]
          )
        ) {
          setTimeout(() => {
            let node = newGrid[row][col];
            node.isWall = false;

            setGrid(newGrid);
            let element = document.getElementById(`node-${row}-${col}`);
            element.classList.remove("node-wall");
            console.log(`node-${row}-${col} is now NOT a wall `);
          }, 50 * counter);
          counter++;
        }
      }

      console.log("sajhd");
    }
  };

  return (
    <>
      <Header
        handleAlgorithmChange={handleAlgorithmChange}
        handleMazeChange={handleMazeChange}
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
              const { row, col } = node;
              return (
                <Node
                  key={`${row}-${col}`}
                  col={col}
                  onMouseDown={() => handleMouseDown(row, col)}
                  onMouseEnter={() => handleMouseEnter(row, col)}
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
