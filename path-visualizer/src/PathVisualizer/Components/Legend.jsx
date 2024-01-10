import React from "react";

function Legend() {
  return (
    <div className="under-header">
      <div className="legend">
        <div className="section-container">
          <div className="start-legend">
            <div className="description">Start Node</div>
            <div className="image">I</div>
          </div>
          <div className="finish-legend">
            <div className="description">Finish Node</div>
            <div className="image">I</div>
          </div>
        </div>
        <div className="section-container">
          <div className="wall-legend">
            <div className="description">Wall</div>
            <div className="image">I</div>
          </div>
          <div className="weight-legend">
            <div className="description">Weight</div>
            <div className="image">I</div>
          </div>
        </div>
        <div className="section-container">
          <div className="visited-legend">
            <div className="description">Visited Node</div>
            <div className="image">I</div>
          </div>
          <div className="shortest-legend">
            <div className="description">Shortest Path</div>
            <div className="image">I</div>
          </div>
        </div>
      </div>
      <div className="Flow Game Solver">
        <button>Flow Game Solver</button>
      </div>
    </div>
  );
}

export default Legend;
