import { isPointOnSegment } from "./point";

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
    // console.log(evt)
    // const item = graph.get('canvas').getShape(evt.x, evt.y);
    const edgesIns = graph.getEdges();
    let targetEdgeIns = null;

    for (let i = 0; i < edgesIns.length; i++) {
      const item = edgesIns[i];
      const source = item.getSource().getModel();
      const target = item.getTarget().getModel();
      const { ifPointOnSegment } = isPointOnSegment({
        point: evt,
        segment: [source, target],
      });

      if (ifPointOnSegment) {
        targetEdgeIns = item;
        break;
      }
    }

    console.log(targetEdgeIns?.getModel()?.description)

    if (!targetEdgeIns) return;

    const edgeModel = targetEdgeIns.getModel();
    const { controlPoints = [] } = edgeModel;
    const radius = 10;
    const clickedAnchorIndex = controlPoints.findIndex(
      (p) => Math.abs(p.x - evt.x) < radius && Math.abs(p.y - evt.y) < radius
    );
    const ifClickingAnchor = clickedAnchorIndex > -1;
    console.log("ifClickingAnchor", ifClickingAnchor)

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
