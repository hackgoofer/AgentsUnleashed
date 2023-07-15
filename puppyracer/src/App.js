import React, { useState } from "react";
import "./App.css";
import corgiRun from "./corgi_run.gif";
import corgiSit from "./corgi_sit.gif";

function App() {
  const [position, setPosition] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  const handleButtonClick = () => {
    setIsMoving(true);
    setPosition((oldPosition) => oldPosition + 1); // Update position

    // After a delay, stop moving
    setTimeout(() => {
      setIsMoving(false);
    }, 500); // Adjust this delay as necessary
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={isMoving ? corgiRun : corgiSit}
          className="Corgi"
          style={{ left: `${position * 50}px` }} // Adjust as necessary
          alt="corgi"
        />
        <button onClick={handleButtonClick}>Move Corgi</button>
      </header>
    </div>
  );
}

export default App;
