// Importing React and CSS for the Node component
import React, { Component } from "react";
import "./Node.css";

import finishIcon from "./images/node-finish.png";
import startIcon from "./images/node-start.png";

// Definition of the Node class component
export default class Node extends Component {
  render() {
    // Destructuring props to get individual properties passed to Node
    const {
      col, // Column index of the node
      isFinish, // Boolean to indicate if this node is the finish node
      isStart, // Boolean to indicate if this node is the start node
      isWall, // Boolean to indicate if this node is a wall
      onMouseDown, // Function to handle mouse down event
      onMouseEnter, // Function to handle mouse enter event
      onMouseUp, // Function to handle mouse up event
      onMouseLeave,
      row, // Row index of the node
      distance, // Distance value of the node (not used in rendering)
      isVisualizing,
    } = this.props;

    // Determining the additional class name based on node properties
    const extraClassName = isFinish
      ? "node-finish" // Class for finish node
      : isStart
      ? "node-start" // Class for start node
      : isWall
      ? "node-wall" // Class for wall node
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
    }

    // Rendering the node element
    return (
      <div
        id={`node-${row}-${col}`} // Setting the ID for the node div
        className={`node ${extraClassName}`} // Applying base and additional class names
        onMouseDown={() => onMouseDown(row, col)} // Handling mouse down event
        onMouseEnter={() => onMouseEnter(row, col)} // Handling mouse enter event
        onMouseUp={() => onMouseUp()} // Handling mouse up event
        onMouseLeave={() => onMouseLeave(row, col)}
      >
        <div className="icon-container">{icon}</div>
      </div>
    );
  }
}
