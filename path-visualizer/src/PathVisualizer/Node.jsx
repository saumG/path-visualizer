// Importing React and CSS for the Node component
import React, { Component } from "react";
import "./Node.css";

import finishIcon from "./images/node-finish.png";
import startIcon from "./images/node-start.png";
import weightIcon from "./images/weight.png";

// Definition of the Node class component
export default class Node extends Component {
  render() {
    // Destructuring props to get individual properties passed to Node
    const {
      col, // Column index of the node
      isFinish, // Boolean to indicate if this node is the finish node
      isStart, // Boolean to indicate if this node is the start node
      isWall, // Boolean to indicate if this node is a wall
      isWeight, // Boolean to indicate if this node is a weight
      onMouseDown, // Function to handle mouse down event
      onMouseEnter, // Function to handle mouse enter event
      onMouseUp, // Function to handle mouse up event
      row, // Row index of the node
      isVisited,
      isInShortestPath,
      distance, // Distance value of the node (not used in rendering)
      isVisualized,
      isVisualizing,
    } = this.props;

    // Determining the additional class name based on node properties
    const nodeClassifier = isFinish
      ? "node-finish" // Class for finish node
      : isStart
      ? "node-start" // Class for start node
      : isWall
      ? "node-wall" // Class for wall node
      : isWeight
      ? "node-weight" // Class for weight node
      : "";

    let icon = null;
    if (isStart) {
      icon = (
        <img
          src={startIcon}
          alt="Start"
          className="node-start node-icon"
          draggable="false"
        />
      );
    } else if (isFinish) {
      icon = (
        <img
          src={finishIcon}
          alt="Finish"
          className="node-finish node-icon"
          draggable="false"
        />
      );
    } else if (isWeight) {
      icon = (
        <img
          src={weightIcon}
          alt="Weight"
          className="node-weight node-icon"
          draggable="false"
        />
      );
    }

    let pathClasses = "";

    if (isVisualizing) {
      // if (row === 10 && col >= 8 && col <= 20) {
      //   console.log(
      //     `isvisualizing is true, adding visualization classes for node ${row} ${col}`
      //   );
      // }

      // Classes for animating
      pathClasses = isInShortestPath
        ? "node-shortest-path"
        : isVisited
        ? "node-visited"
        : "";
    } else if (isVisualized) {
      // if (row === 10 && col >= 8 && col <= 20) {
      //   console.log(
      //     `isvisualized is true, adding visualization classes for node ${row} ${col}`
      //   );
      // }

      // Classes for final display
      pathClasses = isInShortestPath
        ? "node-shortest-path-final"
        : isVisited
        ? "node-visited-final"
        : "";
    }

    // Rendering the node element
    return (
      <div
        id={`node-${row}-${col}`} // Setting the ID for the node div
        className={`node ${nodeClassifier} ${pathClasses}`} // Applying base and additional class names
        onMouseDown={() => onMouseDown(row, col)} // Handling mouse down event
        onMouseEnter={() => onMouseEnter(row, col)} // Handling mouse enter event
        onMouseUp={() => onMouseUp()} // Handling mouse up event
      >
        <div className="icon-container">{icon}</div>
      </div>
    );
  }
}
