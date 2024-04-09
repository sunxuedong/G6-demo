import { Menu } from "antd";
import { Outlet } from "react-router-dom";
import { menu } from "./utils/config";
import "./index.scss";

function Frame() {
  const pathname = window.location.pathname;
  const defaultSelectedKeys = pathname;
  const defaultOpenKeys = pathname.slice(1).split("/");
  const clickMenu = ({ item }) => {
    const { path } = item.props;
    window.open(path, "_self");
  };

  return (
    <div className="frame">
      <Menu
        onClick={clickMenu}
        style={{ width: 256 }}
        mode="inline"
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={defaultOpenKeys}
        items={menu}
      />
      <div className="content">
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default Frame;
