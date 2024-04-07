import logo from "../../logo.svg";
import "./index.scss";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          demo of G6.
        </p>
        <a
          
          href="/tooltip"
          rel="noopener noreferrer"
        >
          Tooltip
        </a>
      </header>
    </div>
  );
}

export default App;
