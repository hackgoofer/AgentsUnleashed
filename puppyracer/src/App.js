import React, { useState } from "react";
import "./App.css";
import corgiRun from "./corgi_run.gif";
import corgiSit from "./corgi_sit.gif";

function App() {
  const tasks = ["Task 1", "Task 2", "Task 3", "Task 4", "Task 5"]; // Replace with actual tasks
  const [currentTask, setCurrentTask] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  const handleButtonClick = () => {
    setIsMoving(true);
    setCurrentTask((oldTask) =>
      oldTask + 1 < tasks.length ? oldTask + 1 : oldTask
    );
  };

  const handleTransitionEnd = () => {
    setIsMoving(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="Timeline">
          {tasks.map((task, index) => (
            <div key={task} className="TimelineSegment">
              <div className="TimelineNode" />
              {index < tasks.length - 1 && <div className="TimelineLine" />}
            </div>
          ))}
        </div>
        <img
          src={isMoving ? corgiRun : corgiSit}
          className="Corgi"
          style={{
            transition: "left 2s",
            left: `${(currentTask / tasks.length) * 100}%`,
          }}
          onTransitionEnd={handleTransitionEnd}
          alt="corgi"
        />
        <button onClick={handleButtonClick}>Move Corgi</button>
      </header>
    </div>
  );
}

export default App;
