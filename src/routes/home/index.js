import { Menu } from "antd";
import logo from "../../logo.svg";
import { menu } from "./utils/config";
import "./index.scss";

function Home() {
  const clickMenu = ({ item }) => {
    const { path } = item.props;
    window.open(path, "_self");
  };

  return (
    <div className="home">
      <header className="home-header">
        <img src={logo} className="home-logo" alt="logo" />
        <p>demo of G6.</p>
        <Menu
          onClick={clickMenu}
          style={{ width: 256 }}
          mode="vertical"
          items={menu}
        />
      </header>
    </div>
  );
}

export default Home;
