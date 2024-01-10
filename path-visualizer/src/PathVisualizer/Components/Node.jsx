// Importing React and CSS for the Node component
import React, { Component } from "react";
import "./Node.css";

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
      // isVisited,
      // isInShortestPath,
      // distance, // Distance value of the node (not used in rendering)
      // nodeClassifier,
      // nodePathClassifier,
    } = this.props;

    // Rendering the node element
    return (
      <div
        id={`node-${row}-${col}`} // Setting the ID for the node div
        className={`node`} // Applying base and additional class names
        onMouseDown={() => onMouseDown(row, col)} // Handling mouse down event
        onMouseEnter={() => onMouseEnter(row, col)} // Handling mouse enter event
        onMouseUp={() => onMouseUp()} // Handling mouse up event
      >
        <div
          className="icon-container"
          id={`icon-container-${row}-${col}`}
        ></div>
      </div>
    );
  }
}
