import "./App.css";
import corgi from "./corgi.gif"; // Make sure to import your corgi gif

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={corgi} className="Corgi" alt="corgi" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
