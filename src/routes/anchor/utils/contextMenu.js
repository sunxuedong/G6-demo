import G6 from "@antv/g6";
import { getObject, callFn } from "@/utils";
import { isPointsNear } from "./point";
import { ANCHOR_RADIUS } from "./config";
import { points2Segments, findClosestLineSegments } from "./point";
import { addAnchorShape, deleteAnchorShape } from "./register/edge";

export default function getContextMenu(params) {
  params = getObject({ data: params });
  const { onAnchorChange } = params;
  let event = null;
  let deletingAnchor = null;

  const contextMenu = new G6.Menu({
    getContent(evt) {
      event = evt;
      deletingAnchor = null;
      let header;
      let content = "";
      if (evt.target && evt.target.isCanvas && evt.target.isCanvas()) {
        header = "Canvas ContextMenu";
      } else if (evt.item) {
        const itemType = evt.item.getType();
        header = `${itemType.toUpperCase()} ContextMenu`;

        if (itemType === "edge") {
          const edgeModel = evt.item.getModel();
          const controlPoints = edgeModel.controlPoints || [];
          let ifNearAnchor = false;

          for (let k = 0; k < controlPoints.length; k++) {
            const anchor = controlPoints[k];
            const { ifNear } = isPointsNear({
              point1: anchor,
              point2: evt,
              maxDistance: ANCHOR_RADIUS,
            });

            if (ifNear) {
              ifNearAnchor = true;
              deletingAnchor = {
                index: k,
              };
              break;
            }
          }

          if (ifNearAnchor) {
            content += `<li style="cursor: pointer" data-type="edge" data-btn-name="deleteAnchor">删除拐点</li>`;
          } else {
            content += `<li style="cursor: pointer" data-type="edge" data-btn-name="addAnchor">添加拐点</li>`;
          }
        }
      }
      return `
      <h3>${header}</h3>
      <ul class="menu">${content}</ul>`;
    },
    handleMenuClick: (target, item, graph) => {
      const { type, btnName } = target.dataset;

      if (type === "edge") {
        if (btnName === "addAnchor") {
          const edge = item;
          const group = edge.getContainer();
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

          addAnchorShape({ group, cp: point });

          graph.updateItem(edge, {
            controlPoints: newControlPoints,
          });

          callFn(onAnchorChange)({ item: edge });
        } else if (btnName === "deleteAnchor") {
          if (deletingAnchor) {
            const edge = item;
            const group = edge.getContainer();
            const model = edge.getModel();
            const { controlPoints = [] } = model;
            const deletedControlPoint = controlPoints[deletingAnchor.index];

            controlPoints.splice(deletingAnchor.index, 1);

            deleteAnchorShape({ group, cp: deletedControlPoint });

            graph.updateItem(edge, {
              controlPoints,
            });

            callFn(onAnchorChange)({ item: edge });
          }
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
