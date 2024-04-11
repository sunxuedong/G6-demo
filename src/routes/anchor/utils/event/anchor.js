import { isPointsNear } from "../point";
import { anchorRadius, ANCHOR_CIRCLE } from "../config";
import { callFn } from "../../../../utils";

export default class Anchor {
  anchor = null;

  onMousedown = ({ evt, graph }) => {
    const { originalEvent } = evt;

    if (originalEvent.button !== 0) return; // 0为鼠标左键

    const edgesIns = graph.getEdges();
    let targetEdgeIns = null;
    let targetAnchor = null;
    let indexInControlPoints = -1;
    let targetControlPoints = null;

    edgesInsLoop: for (let i = 0; i < edgesIns.length; i++) {
      const edgeItem = edgesIns[i];
      const edgeModel = edgeItem.getModel();
      const controlPoints = edgeModel.controlPoints || [];

      for (let k = 0; k < controlPoints.length; k++) {
        const anchor = controlPoints[k];
        const { ifNear } = isPointsNear({
          point1: anchor,
          point2: evt,
          maxDistance: anchorRadius,
        });

        if (ifNear) {
          targetEdgeIns = edgeItem;
          targetAnchor = anchor;
          indexInControlPoints = k;
          targetControlPoints = controlPoints;
          break edgesInsLoop;
        }
      }
    }

    if (targetEdgeIns) {
      this.anchor = {
        targetEdgeIns,
        targetAnchor,
        indexInControlPoints,
        targetControlPoints,
      };

      const group = targetEdgeIns.getContainer();
      const shape = group.getShape(targetAnchor.x, targetAnchor.y);
      const ifAnchorCircle = shape?.cfg?.name === ANCHOR_CIRCLE;

      if (ifAnchorCircle) {
        this.anchor.anchorShape = shape;
      }
    } else {
      this.anchor = null;
    }
  };
  onMousemove = ({ evt, graph, onAnchorChange }) => {
    if (!this.anchor) return;
    const {
      targetEdgeIns: item,
      indexInControlPoints,
      anchorShape,
    } = this.anchor;

    if (anchorShape) {
      anchorShape.attr({
        x: evt.x,
        y: evt.y,
      });
    }
    const model = item.get("model");
    model.controlPoints[indexInControlPoints].x = evt.x;
    model.controlPoints[indexInControlPoints].y = evt.y;

    callFn(onAnchorChange)({ item });

    graph.refreshItem(item);
  };
  onMouseup = ({ evt }) => {
    const { originalEvent } = evt;

    if (originalEvent.button !== 0) return; // 0为鼠标左键

    this.anchor = null;
  };
}
