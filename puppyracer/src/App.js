import React, { useState } from "react";
import "./App.css";
import corgiRun from "./corgi_run.gif";
import corgiSit from "./corgi_sit.gif";

function App() {
  const [position, setPosition] = useState(0);
  const [corgiGif, setCorgiGif] = useState(corgiSit);

  const handleButtonClick = () => {
    setCorgiGif(corgiRun);
    setPosition((oldPosition) => oldPosition + 100); // Update position
  };

  const handleTransitionEnd = () => {
    setCorgiGif(corgiSit);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={corgiGif}
          className="Corgi"
          style={{ transition: "left 2s", left: `${position}px` }}
          onTransitionEnd={handleTransitionEnd}
          alt="corgi"
        />
        <button onClick={handleButtonClick}>Move Corgi</button>
      </header>
    </div>
  );
}

export default App;
