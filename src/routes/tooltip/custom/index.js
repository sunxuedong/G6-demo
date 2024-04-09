import React, { useEffect, useRef, useState } from "react";
import G6 from "@antv/g6";
import { data } from "./utils/data";
import { initEvent } from "./utils/event";
import PositionTooltip from "./components/positionTooltip";
import "./index.scss";

const TooltipCustom = () => {
  const graphContainer = useRef(null);
  const [tooltipShow, setTooltipShow] = useState(false);
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);
  const [tooltipContent, setTooltipContent] = useState("");

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
    });

    // 添加图数据
    graph.data(data);

    // 渲染图
    graph.render();

    initEvent({
      graph,
      setTooltipShow,
      setTooltipX,
      setTooltipY,
      setTooltipContent,
    });

    // 在组件卸载时销毁图实例
    return () => {
      graph.destroy();
    };
  }, []); // 仅在组件挂载和卸载时执行

  return (
    <>
      <div ref={graphContainer} style={{ width: "100%", height: "100%" }} />
      <PositionTooltip show={tooltipShow} x={tooltipX} y={tooltipY}>
        <div className="tooltip-content">{tooltipContent}</div>
      </PositionTooltip>
    </>
  );
};

export default TooltipCustom;
