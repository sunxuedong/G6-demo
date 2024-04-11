import { isPointsNear } from "../point";

export default class Anchor {
  anchor = null;

  constructor() {}

  onMousedown = ({ evt, graph }) => {
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
        const { ifNear } = isPointsNear({ point1: anchor, point2: evt });

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
      const ifAnchorCircle = shape?.cfg?.name === "anchor-circle";

      if (ifAnchorCircle) {
        this.anchor.anchorShape = shape;
      }
    } else {
      this.anchor = null;
    }
  };
  onMousemove = ({ evt, graph }) => {
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
    graph.refreshItem(item);
  };
  onMouseup = () => {
    this.anchor = null;
  };
}
