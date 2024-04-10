import React, { useEffect, useRef } from "react";
import G6 from "@antv/g6";
import { data } from "./utils/data";
import { getTooltip } from "./utils/tooltip";
import { initEvent } from "./utils/event";
import "./index.scss";

const TooltipPlugin = () => {
  const graphContainer = useRef(null);

  useEffect(() => {
    // 在组件挂载时创建图实例
    const graph = new G6.Graph({
      container: graphContainer.current,
      width: 800,
      height: 600,
      defaultNode: {
        size: [80, 40],
        shape: "rect",
      },
      defaultEdge: {
        style: {
          lineAppendWidth: 3,
        },
      },
      modes: {
        default: [
          "drag-node",
          // {
          //   type: "tooltip",
          //   formatText: function formatText(model) {
          //     var text = "description: " + model.description;
          //     return text;
          //   },

          //   shouldUpdate: function shouldUpdate(e) {
          //     return true;
          //   },
          // },
          {
            type: "edge-tooltip",
            formatText: function formatText(model) {
              var text = "description: " + model.description;
              return text;
            },

            shouldUpdate: function shouldUpdate(e) {
              return true;
            },
          },
        ],
      },
      plugins: [getTooltip()],
    });

    // 添加图数据
    graph.data(data);

    // 渲染图
    graph.render();

    initEvent({ graph });

    // 在组件卸载时销毁图实例
    return () => {
      graph.destroy();
    };
  }, []); // 仅在组件挂载和卸载时执行

  return <div ref={graphContainer} style={{ width: "100%", height: "100%" }} />;
};

export default TooltipPlugin;
