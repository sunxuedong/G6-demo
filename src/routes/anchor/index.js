import React, { useEffect, useRef } from "react";
import { data } from "./utils/data";
import { initGraph } from "./utils/graph";
import { initEvent } from "./utils/event";
import "./index.scss";

const TooltipPlugin = () => {
  const graphContainer = useRef(null);

  useEffect(() => {
    let graph = initGraph({
      container: graphContainer.current,
    });

    // 添加图数据
    graph.data(data);
    // 渲染图
    graph.render();

    initEvent({ graph });

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

export default TooltipPlugin;
