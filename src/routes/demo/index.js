import React, { useEffect, useRef } from "react";
import G6 from "@antv/g6";
import "./index.scss";

const data = {
  nodes: [
    { id: "node1", x: 100, y: 100 },
    { id: "node2", x: 300, y: 100 },
  ],
  edges: [
    {
      id: "edge1",
      source: "node1",
      target: "node2",
      startPoint: { x: 150, y: 100 },
      endPoint: { x: 250, y: 100 },
    },
  ],
};

const Demo = () => {
  const graphContainer = useRef(null);

  useEffect(() => {
    let graph = new G6.Graph({
      container: graphContainer.current,
      width: 500,
      height: 300,
      defaultEdge: {
        type: "polyline",
      },
    });

    // 添加图数据
    graph.data(data);
    // 渲染图
    graph.render();

    // 启用节点和边的拖拽功能
    graph.get("canvas").set("draggable", true);

    // 监听节点的拖拽事件，更新锚点位置
    graph.on("node:drag", (evt) => {
      const node = evt.item;
      const model = node.getModel();

      // 更新与该节点相关的边的锚点位置
      graph.updateItem(node);

      // 更新连接到该节点的边的锚点位置
      const edges = graph.getEdges();
      edges.forEach((edge) => {
        const edgeModel = edge.getModel();
        if (edgeModel.source === model.id || edgeModel.target === model.id) {
          // 更新边的锚点位置
          graph.updateItem(edge);
        }
      });
    });

    // 监听画布上的鼠标按下事件，判断是否点击到锚点
    graph.on("canvas:mousedown", (evt) => {
      const { target } = evt;
      if (target && target.get("isAnchor")) {
        const anchorPoint = target.get("originPoint"); // 获取锚点的起始位置
        const anchorId = target.get("anchorId"); // 获取锚点的 ID
        const nodeId = target.get("nodeId"); // 获取锚点所属节点的 ID

        // 启用锚点的拖动
        graph.setMode("edit"); // 切换到编辑模式，启用拖动锚点
        graph.updateItem(target, {
          type: "circle", // 锚点的形状
          anchorDragging: true, // 标记锚点正在拖动
        });

        // 监听画布上的鼠标移动事件，更新锚点位置
        graph.on("canvas:mousemove", (moveEvt) => {
          const canvasPoint = graph.getPointByClient(
            moveEvt.clientX,
            moveEvt.clientY
          );
          graph.updateItem(target, {
            x: canvasPoint.x,
            y: canvasPoint.y,
          });

          // 更新连接到该锚点的边的位置
          const relatedEdges = graph.getEdges().filter((edge) => {
            const edgeModel = edge.getModel();
            return (
              (edgeModel.source === nodeId &&
                edgeModel.startAnchor === anchorId) ||
              (edgeModel.target === nodeId && edgeModel.endAnchor === anchorId)
            );
          });

          relatedEdges.forEach((edge) => {
            graph.updateItem(edge);
          });
        });

        // 监听画布上的鼠标松开事件，完成锚点拖动
        graph.on("canvas:mouseup", () => {
          graph.updateItem(target, {
            anchorDragging: false, // 标记锚点拖动结束
          });
          graph.off("canvas:mousemove"); // 移除鼠标移动事件监听器
          graph.off("canvas:mouseup"); // 移除鼠标松开事件监听器
        });
      }
    });

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

  return <div ref={graphContainer} className="demo-page" />;
};

export default Demo;
