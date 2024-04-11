import { isPointsNear } from "../point";
import { anchorRadius, ANCHOR_CIRCLE } from "../config";
import { callFn } from "@/utils";

export default class Anchor {
  targetAnchor = null;

  onMousedown = ({ evt, graph }) => {
    const { originalEvent } = evt;

    if (originalEvent.button !== 0) return; // 0为鼠标左键

    const edges = graph.getEdges();
    let targetEdge = null;
    let targetAnchor = null;
    let indexOfAnchor = -1;
    let belongControlPoints = null;

    edgesInsLoop: for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const edgeModel = edge.getModel();
      const controlPoints = edgeModel.controlPoints || [];

      for (let k = 0; k < controlPoints.length; k++) {
        const anchor = controlPoints[k];
        const { ifNear } = isPointsNear({
          point1: anchor,
          point2: evt,
          maxDistance: anchorRadius,
        });

        if (ifNear) {
          targetEdge = edge;
          targetAnchor = anchor;
          indexOfAnchor = k;
          belongControlPoints = controlPoints;
          break edgesInsLoop;
        }
      }
    }

    if (targetEdge) {
      this.targetAnchor = {
        edge: targetEdge,
        targetAnchor,
        index: indexOfAnchor,
        controlPoints: belongControlPoints,
      };

      const group = targetEdge.getContainer();
      const shape = group.getShape(targetAnchor.x, targetAnchor.y);
      const ifAnchorCircle = shape?.cfg?.name === ANCHOR_CIRCLE;

      if (ifAnchorCircle) {
        this.targetAnchor.anchorShape = shape;
      }
    } else {
      this.targetAnchor = null;
    }
  };
  onMousemove = ({ evt, graph, onAnchorChange }) => {
    if (!this.targetAnchor) return;
    const {
      edge: item,
      index,
      anchorShape,
    } = this.targetAnchor;

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
