import React, { useEffect, useRef } from "react";
import { debounce } from "lodash";
import { data } from "./utils/data";
import { initGraph } from "./utils/graph";
import { initEvent } from "./utils/event";
import register from "./utils/register";
import getContextMenu from "./utils/contextMenu";
import "./index.scss";

const Anchor = () => {
  const graphContainer = useRef(null);

  useEffect(() => {
    register();
    const onAnchorChange = debounce(function ({ item }) {
      const model = item.getModel();
      const { controlPoints } = model;

      console.log(controlPoints);
    }, 300);

    let graph = initGraph({
      options: {
        container: graphContainer.current,
        width: 800,
        height: 600,
        plugins: [getContextMenu({ onAnchorChange })],
      },
    });

    // 添加图数据
    graph.data(data);
    // 渲染图
    graph.render();

    initEvent({ graph, onAnchorChange });

    // 在组件卸载时销毁图实例
    return () => {
      graph.destroy();
      graph = null;
    };
  }, []); // 仅在组件挂载和卸载时执行

  // handle context menu events
  useEffect(() => {
    const handleContextMenu = (e) => {
      //取消默认的浏览器自带右键 很重要！！
      e.preventDefault();
    };

    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return <div ref={graphContainer} className="anchor-demo" />;
};

export default Anchor;
