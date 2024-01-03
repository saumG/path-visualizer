import React, { useEffect, useRef, useState } from "react";
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
  displayDijkstra,
} from "./utils/animationUtils.jsx";
import {
  clearPath,
  createInitialGrid,
  updateGridState,
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

  const [isMovingStartNode, setIsMovingStartNode] = useState(false);
  const [isMovingFinishNode, setIsMovingFinishNode] = useState(false);

  const [visitedNodes, setVisitedNodes] = useState([]);
  const [shortestPathNodes, setShortestPathNodes] = useState([]);

  const [isVisualized, setIsVisualized] = useState(false);

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

  // Initialize the grid on component mount
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
    clearPath(visitedNodes, shortestPathNodes);

    // let options = {
    //   movingStartNode: true,
    //   movingFinishNode: false,
    //   toggleWall: false,
    //   toggleWeight: false,
    // };

    // let { newGrid } = updateGridState(
    //   initialGrid,
    //   startCoordsRef.current,
    //   finishCoordsRef.current, //irrelevant
    //   START_NODE_ROW,
    //   START_NODE_COL,
    //   options
    // );

    // options = {
    //   movingStartNode: false,
    //   movingFinishNode: true,
    //   toggleWall: false,
    //   toggleWeight: false,
    // };

    // let { finalGrid } = updateGridState(
    //   newGrid,
    //   startCoordsRef.current, //irrelevant
    //   finishCoordsRef.current,
    //   FINISH_NODE_ROW,
    //   FINISH_NODE_COL,
    //   options
    // );

    updateCoords([startRow, startCol], [finishRow, finishCol]);

    setGrid(initialGrid);
    setVisitedNodes([]);
    setShortestPathNodes([]);
    setIsVisualized(false);
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
  }, []);

  const isStartNode = (row, col) => {
    return grid[row][col].isStart;
  };

  const isFinishNode = (row, col) => {
    return grid[row][col].isFinish;
  };

  // Handle mouse down event on grid nodes
  const handleMouseDown = (row, col) => {
    if (!isVisualizing) {
      if (isStartNode(row, col)) {
        setIsMovingStartNode(true);
      } else if (isFinishNode(row, col)) {
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

  // Handle mouse enter event for drag functionality
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
  };

  // Reset mouse press state on mouse up
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

  // Function to visualize Dijkstra's algorithm
  const visualizeDijkstra = () => {
    const startNode =
      grid[startCoordsRef.current[0]][startCoordsRef.current[1]];
    const finishNode =
      grid[finishCoordsRef.current[0]][finishCoordsRef.current[1]];

    clearPath(visitedNodes, shortestPathNodes);
    console.log("CLEARED old path");
    resetNodeStates();

    // Run Dijkstra's algorithm and get the path
    const { visitedNodesInOrder, validPath } = dijkstra(
      grid,
      startNode,
      finishNode
    );
    setVisitedNodes(visitedNodesInOrder);
    console.log("valid path?: " + validPath);

    // Get nodes in the shortest path order
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    setShortestPathNodes(nodesInShortestPathOrder);

    if (isVisualized) {
      console.log("DISPLAYING new path");
      displayDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, validPath);
      totalAnimationTime = 0;
    } else {
      console.log("ANIMATING new path");
      animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, validPath);
      totalAnimationTime =
        visitedNodesInOrder.length * 10 + nodesInShortestPathOrder.length * 50;
      console.log("total animation time is " + totalAnimationTime);
    }
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

    setIsVisualized(true);
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
          clearPath(visitedNodes, shortestPathNodes);
          setVisitedNodes([]);
          setShortestPathNodes([]);
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
