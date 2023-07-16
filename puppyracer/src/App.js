import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";
import corgiRun from "./corgi_run.gif";
import corgiSit from "./corgi_sit.gif";

const ENDPOINT = "http://127.0.0.1:8080"; // Replace with your server's address

function App() {
  const [tasks, setTasks] = useState(["Starting my journey!"]);
  const [currentTask, setCurrentTask] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const socketRef = useRef();
  // Generate random positions for nodes
  const [nodePositions, setNodePositions] = useState(
    tasks.map((_, index) => ({
      left: 10 + index * 80, // Calculate segment and add some randomness
      top: 100, // Random value from 10% to 90%
    }))
  );

  useEffect(() => {
    // Connect to the socket
    console.log("tryign to connect");
    socketRef.current = socketIOClient(ENDPOINT);
    console.log("cnnected", socketRef.current);
    // Listen for new tasks
    socketRef.current.on("message", (newTask) => {
      console.log("hello?");
      console.log(newTask);
      setTasks((oldTasks) => [...oldTasks, newTask["current_task"]]);
      setNodePositions((oldPositions) => [
        ...oldPositions,
        {
          left: tasks.length * 10, // Evenly spaced
          top: 100, // Constant vertical position
        },
      ]);
    });
    return () => {
      // Disconnect from the socket when the component unmounts
      socketRef.current.disconnect();
    };
  }, [tasks.length]);

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
      <button onClick={handleButtonClick}>Move Corgi</button>

      <header className="App-header">
        <svg className="SvgBack">
          {nodePositions.slice(0, -1).map((startPos, index) => {
            const endPos = nodePositions[index + 1];
            return (
              <line
                key={index}
                x1={`${startPos.left + 0.5}%`}
                y1={`${startPos.top + 2}%`}
                x2={`${endPos.left + 0}%`}
                y2={`${endPos.top + 2}%`}
                stroke="black"
              />
            );
          })}
        </svg>

        {nodePositions.map((pos, index) => (
          <div
            key={index}
            className="TimelineNode"
            style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
          />
        ))}

        <img
          src={isMoving ? corgiRun : corgiSit}
          className="Corgi"
          style={{
            transition: "left 2s, top 2s",
            left: `${nodePositions[currentTask].left - 5}%`,
            top: `${nodePositions[currentTask].top - 20}%`,
          }}
          onTransitionEnd={handleTransitionEnd}
          alt="corgi"
        />

        {/* Add this to display the chat bubble when the corgi is not moving */}
        {!isMoving && currentTask < tasks.length && (
          <div
            className="ChatBubble"
            style={{
              left: `calc(${nodePositions[currentTask].left - 5}% )`, // Subtract half of the chat bubble's width
              top: `35%`, // Increase the subtraction to move it upwards
            }}
          >
            {tasks[currentTask]}
          </div>
        )}
        {/* button at very bottom of page */}
      </header>
    </div>
  );
}

export default App;
