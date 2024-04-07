import logo from "../../logo.svg";
import "./index.scss";

function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <img src={logo} className="home-logo" alt="logo" />
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

export default Home;
