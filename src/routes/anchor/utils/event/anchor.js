import { isPointsNear } from "../point";
import { ANCHOR_RADIUS, ANCHOR_CIRCLE } from "../config";
import { callFn } from "@/utils";

export default class Anchor {
  targetAnchor = null;

  onMousedown = ({ evt, graph }) => {
    const { originalEvent, item: edge } = evt;

    if (originalEvent.button !== 0) return; // 0为鼠标左键

    const model = edge.getModel();
    const controlPoints = model.controlPoints || [];

    for (let k = 0; k < controlPoints.length; k++) {
      const anchor = controlPoints[k];
      const { ifNear } = isPointsNear({
        point1: anchor,
        point2: evt,
        maxDistance: ANCHOR_RADIUS,
      });

      if (ifNear) {
        const group = edge.getContainer();
        const shape = group.getShape(anchor.x, anchor.y);
        const ifAnchorCircle = shape?.cfg?.name === ANCHOR_CIRCLE;

        this.targetAnchor = {
          edge,
          index: k,
          anchorShape: ifAnchorCircle ? shape : void 0,
          ...anchor,
        };

        return;
      }
    }

    this.targetAnchor = null;
  };
  onMousemove = ({ evt, graph, onAnchorChange }) => {
    if (!this.targetAnchor) return;
    const { edge: item, index, anchorShape } = this.targetAnchor;

    if (anchorShape) {
      anchorShape.attr({
        x: evt.x,
        y: evt.y,
      });
    }
    const model = item.get("model");
    model.controlPoints[index].x = evt.x;
    model.controlPoints[index].y = evt.y;

    callFn(onAnchorChange)({ item });

    graph.refreshItem(item);
  };
  onMouseup = ({ evt }) => {
    const { originalEvent } = evt;

    if (originalEvent.button !== 0) return; // 0为鼠标左键

    this.targetAnchor = null;
  };
}
