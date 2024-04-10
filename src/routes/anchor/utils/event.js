import { isPointsNear } from "./point";

export const initEvent = ({ graph }) => {
  // 监听边的点击事件
  // graph.on("edge:mousedown", (evt) => {
  //   // 手动触发画布上的 mousedown 事件
  //   const canvasElement = graph.get("canvas").get("el");
  //   const canvasMouseDownEvent = new MouseEvent("mousedown", {
  //     clientX: evt.clientX,
  //     clientY: evt.clientY,
  //   });
  //   canvasElement.dispatchEvent(canvasMouseDownEvent);

  //   // 在这里可以添加其他处理逻辑
  // });

  graph.on("mousedown", (evt) => {
    const edgesIns = graph.getEdges();
    let targetEdgeIns = null;
    let targetAnchor = null;

    edgesInsLoop: for (let i = 0; i < edgesIns.length; i++) {
      const edgeItem = edgesIns[i];
      const edgeModel = edgeItem.getModel();
      const controlPoints = edgeModel.controlPoints || [];

      for (let k = 0; k < controlPoints.length; k++) {
        const anchor = controlPoints[k];
        const { ifNear } = isPointsNear({ point1: anchor, point2: evt });

        if (ifNear) {
          targetEdgeIns = edgeItem;
          targetAnchor = anchor;
          break edgesInsLoop;
        }
      }
    }

    if (!targetEdgeIns) return;
    console.log(targetEdgeIns?.getModel()?.description);
    console.log(targetAnchor);
    // const item = graph.find("edge", (item) => {
    //   const point = graph.getCanvasByPoint(evt.x, evt.y);
    //   const source = item.getSource().getModel();
    //   const target = item.getTarget().getModel();
    //   const { ifPointOnSegment } = isPointOnSegment({ point, segment: [source, target] });

    //   console.log(ifPointOnSegment)

    //   return ifPointOnSegment;
    // });

    // console.log(item?.getModel()?.description)

    // console.log(items)
    // if (!item) return;
    // console.log(item.get("type"));
    // const radius = 10;
    // const edge = evt.item;
    // const model = edge.getModel();
    // const { controlPoints = [] } = model;
    // const clickedAnchorIndex = controlPoints.findIndex(
    //   (p) => Math.abs(p.x - evt.x) < radius && Math.abs(p.y - evt.y) < radius
    // );
    // const ifClickingAnchor = clickedAnchorIndex > -1;

    // console.log("ifClickingAnchor", ifClickingAnchor);

    // if (!ifClickingAnchor) return;
  });

  graph.on("edge:mouseleave", (evt) => {});
};
