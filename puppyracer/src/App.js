import React, { useState } from "react";
import "./App.css";
import corgi from "./corgi.gif"; // Make sure to import your corgi gif

function App() {
  const [position, setPosition] = useState(0); // Initialize position state

  const handleButtonClick = () => {
    setPosition((oldPosition) => oldPosition + 1); // Update position
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={corgi}
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
