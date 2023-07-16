import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";
import corgiRun from "./corgi_run.gif";
import corgiSit from "./corgi_sit.gif";
import corgiBark from "./corgi_bark.gif";

const ENDPOINT = "http://127.0.0.1:8080"; // Replace with your server's address

function FixedTextbox({ data }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        height: "200px",
        width: "100%",
        backgroundColor: "#f0f0f0",
        padding: "10px",
        borderTop: "1px solid #000",
      }}
    >
      {Object.entries(data).map(([key, value], index) => (
        <p key={index}>
          <strong>{key}:</strong> {value}
        </p>
      ))}
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState(["Starting my journey!"]);
  const [isRepating, setIsRepeating] = useState(false);
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
      setIsRepeating(false);
      console.log("hello?");
      console.log(tasks);
      console.log(newTask);
      if (newTask["current_task"] === tasks.slice(-1)["current_task"]) {
        setIsRepeating(true);
      }

      if (!!newTask["current_task"]) {
        setTasks((oldTasks) => [...oldTasks, newTask["current_task"]]);
        setNodePositions((oldPositions) => [
          ...oldPositions,
          {
            left: tasks.length * 10, // Evenly spaced
            top: 100, // Constant vertical position
          },
        ]);
      }
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
          src={isMoving ? corgiRun : isRepating ? corgiBark : corgiSit}
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
      <FixedTextbox data={tasks} />
    </div>
  );
}

export default App;
