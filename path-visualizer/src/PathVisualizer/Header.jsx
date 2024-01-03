import React from "react";
import "./Header.css";

function Header({ handleAlgorithmChange, onVisualize, clearGrid, clearPath }) {
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
          {/* Add more algorithm options here */}
        </select>

        <select id="maze" className="dropdown">
          <option value="maze1">Maze 1</option>
          <option value="maze2">Maze 2</option>
          {/* Add more maze options here */}
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
      </div>
    </div>
  );
}

export default Header;
