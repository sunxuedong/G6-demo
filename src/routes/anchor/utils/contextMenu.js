import G6 from "@antv/g6";
import { points2Segments, findClosestLineSegments } from "./point";

export default function getContextMenu() {
  let event = null;

  const contextMenu = new G6.Menu({
    getContent(evt) {
      event = evt;
      let header;
      let content = "";
      if (evt.target && evt.target.isCanvas && evt.target.isCanvas()) {
        header = "Canvas ContextMenu";
      } else if (evt.item) {
        const itemType = evt.item.getType();
        header = `${itemType.toUpperCase()} ContextMenu`;

        if (itemType === "edge") {
          content = `<li style="cursor: pointer" data-type="edge" data-btn-name="addBtn">添加拐点</li>`;
        }
      }
      return `
      <h3>${header}</h3>
      <ul>${content}</ul>`;
    },
    handleMenuClick: (target, item, graph) => {
      const { type, btnName } = target.dataset;

      if (type === "edge") {
        if (btnName === "addBtn") {
          const edge = item;
          const model = edge.getModel();
          let { controlPoints = [] } = model;
          const point = { x: event.x, y: event.y };
          const sourcePoint = edge.getSource().getModel();
          const targetPoint = edge.getTarget().getModel();

          const sourceToTargetPoints = [
            sourcePoint,
            ...controlPoints,
            targetPoint,
          ];

          const segments = points2Segments(sourceToTargetPoints);
          const { targetSegment } = findClosestLineSegments({
            segments,
            point,
          });

          const insertIndex = sourceToTargetPoints.findIndex((item) => {
            const { x: targetX, y: targetY } = targetSegment[1];
            return item.x === targetX && item.y === targetY;
          });

          sourceToTargetPoints.splice(insertIndex, 0, point);

          const newControlPoints = sourceToTargetPoints.slice(1, -1);

          graph.updateItem(edge, {
            controlPoints: newControlPoints,
          });
        }
      }
    },
    // offsetX and offsetY include the padding of the parent container
    // 需要加上父级容器的 padding-left 16 与自身偏移量 10
    offsetX: 16 + 10,
    // 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
    offsetY: 0,
    // the types of items that allow the menu show up
    // 在哪些类型的元素上响应
    itemTypes: ["edge"],
  });

  return contextMenu;
}
