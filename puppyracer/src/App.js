import React, { useState, useEffect } from "react";
import "./App.css";
import corgiRun from "./corgi_run.gif";
import corgiSit from "./corgi_sit.gif";

function App() {
  const tasks = ["Task 1", "Task 2", "Task 3", "Task 4", "Task 5"];
  const [currentTask, setCurrentTask] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    if (isMoving) {
      const timer = setTimeout(() => {
        setIsMoving(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isMoving]);

  const handleButtonClick = () => {
    setIsMoving(true);
    setCurrentTask((oldTask) =>
      oldTask + 1 < tasks.length ? oldTask + 1 : oldTask
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="Timeline">
          {tasks.map((task, index) => (
            <div
              key={task}
              className="TimelineNode"
              style={{ left: `${(index / (tasks.length - 1)) * 100}%` }}
            />
          ))}
        </div>
        {!isMoving && currentTask !== 0 && (
          <div
            className="ChatBubble"
            style={{ left: `${(currentTask / (tasks.length - 1)) * 100}%` }}
          >
            Hello!
          </div>
        )}
        <img
          src={isMoving ? corgiRun : corgiSit}
          className="Corgi"
          style={{
            transition: "left 2s",
            left: `${(currentTask / (tasks.length - 1)) * 100}%`,
          }}
          alt="corgi"
        />
        <button onClick={handleButtonClick}>Move Corgi</button>
      </header>
    </div>
  );
}

export default App;
