import React from "react";
import "./Legend.css";

import finishIcon from "../images/node-finish.png";
import startIcon from "../images/node-start.png";

function Legend() {
  return (
    <div className="under-header" selectable="false">
      <div className="legend">
        <div className="section-container">
          <div className="start-legend">
            <div className="description">Start Node</div>
            <div className="image-container">
              <img
                src={startIcon}
                alt="Start"
                className="start-node-img"
                draggable="false"
              />
            </div>
          </div>
          <div className="finish-legend">
            <div className="description">Finish Node</div>
            <div className="image-container">
              <img
                src={finishIcon}
                alt="Finish"
                className="finish-node-img"
                draggable="false"
              />
            </div>
          </div>
        </div>
        <div className="section-container">
          <div className="wall-legend">
            <div className="description">Wall</div>
            <div className="image"></div>
          </div>
          <div className="weight-legend">
            <div className="description">Weight</div>
            <div className="image-container">
              <div className="image"></div>
            </div>
          </div>
        </div>
        <div className="section-container">
          <div className="visited-legend">
            <div className="description">Visited Node</div>
            <div className="image"></div>
          </div>
          <div className="shortest-legend">
            <div className="description">Shortest Path</div>
            <div className="image"></div>
          </div>
        </div>
      </div>
      <div className="Flow-Game-Solver">
        <button className="flow-button">
          <h1>Flow Game Solver</h1>
        </button>
      </div>
    </div>
  );
}

export default Legend;
