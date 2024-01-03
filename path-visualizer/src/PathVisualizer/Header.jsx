import React from "react";
import "./Header.css";

import wallIcon from "./images/wall.png";
import weightIcon from "./images/weight-button.png";

function Header({
  handleAlgorithmChange,
  onVisualize,
  clearGrid,
  clearPath,
  toggleWallWeight,
  isPlacingWalls,
}) {
  let wallImg = <img src={wallIcon} alt="wall" draggable="false" />;
  let weightImg = <img src={weightIcon} alt="weight" draggable="false" />;

  let icon = null;
  if (isPlacingWalls) {
    icon = <img src={wallIcon} alt="Wall" draggable="false" />;
  } else {
    icon = <img src={weightIcon} alt="Weight" draggable="false" />;
  }

  return (
    <div className="header">
      <div className="header-left">
        <select
          id="algorithms"
          className="dropdown"
          onChange={handleAlgorithmChange}
        >
          <option value="Dijkstra">Dijkstra's</option>
          <option value="Astar">A-Star</option>
          <option value="BFS">Breadth-First Search</option>
          <option value="DFS">Depth-First Search</option>
        </select>

        <select id="maze" className="dropdown">
          <option value="maze1">Maze 1</option>
          <option value="maze2">Maze 2</option>
        </select>
      </div>

      <div className="header-center">
        <button className="visualize-button" onClick={onVisualize}>
          Visualize
        </button>
      </div>

      <div className="header-right">
        <button id="clear-grid" className="clear-button" onClick={clearGrid}>
          Clear Grid
        </button>
        <button id="clear-path" className="clear-button" onClick={clearPath}>
          Clear Path
        </button>
        <button
          id="toggle-wall-weight"
          className={`toggle-button ${
            isPlacingWalls ? "walls-active" : "weights-active"
          }`}
          onClick={toggleWallWeight}
        >
          {isPlacingWalls ? "Place Walls" : "Place Weights"}
          {icon}
        </button>
      </div>
    </div>
  );
}

export default Header;
