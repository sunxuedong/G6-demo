import G6 from "@antv/g6";
import { anchorRadius } from "../config";

export const addAnchorShape = ({ group, cp }) => {
  group.addShape("circle", {
    attrs: {
      x: cp.x,
      y: cp.y,
      r: anchorRadius, // 控制点的半径
      fill: "#fff", // 控制点的填充色
      stroke: "#666", // 控制点的边框颜色
      lineWidth: 1, // 控制点的边框宽度
    },
    name: "anchor-circle",
  });
};

export default function CustomEdge() {
  G6.registerEdge(
    "anchorEdge",
    {
      draw(cfg, group) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const controlPoints = cfg.controlPoints;

        // 创建路径对象
        const path = [];
        path.push(["M", startPoint.x, startPoint.y]);

        // 添加直线段和控制点
        if (controlPoints && controlPoints.length > 0) {
          controlPoints.forEach((cp) => {
            path.push(["L", cp.x, cp.y]);
          });
        }

        path.push(["L", endPoint.x, endPoint.y]);

        // 绘制 Polyline 边
        const shape = group.addShape("path", {
          attrs: {
            path: path,
            stroke: "#666", // Polyline 边的颜色
            lineWidth: 2, // Polyline 边的宽度
            endArrow: false, // 是否显示箭头
          },
        });

        // 绘制控制点样式
        if (controlPoints && controlPoints.length > 0) {
          controlPoints.forEach((cp) => addAnchorShape({ cp, group }));
        }

        return shape;
      },
    },
    "polyline"
  );
}
