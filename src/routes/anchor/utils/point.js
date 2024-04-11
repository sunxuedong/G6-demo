import { getObject, isObject } from "@/utils";

export function getDistance(start, end) {
  const { x: startX, y: startY } = start;
  const { x: endX, y: endY } = end;
  const dx = endX - startX;
  const dy = endY - startY;

  return Math.sqrt(dx ** 2 + dy ** 2);
}

// 计算点到线段的垂足
export function getPerpendicularFoot({ point, start, end }) {
  const { x: px, y: py } = point;
  const { x: x1, y: y1 } = start;
  const { x: x2, y: y2 } = end;
  // 向量 AB 和 AP
  const ABx = x2 - x1;
  const ABy = y2 - y1;
  const APx = px - x1;
  const APy = py - y1;

  // 点 A 到点 P 的向量投影在向量 AB 上的比例 t
  const t = (APx * ABx + APy * ABy) / (ABx * ABx + ABy * ABy);

  // 计算垂足点的坐标
  let footX, footY;
  if (t < 0) {
    // 如果 t < 0，则垂足在点 A 处
    footX = x1;
    footY = y1;
  } else if (t > 1) {
    // 如果 t > 1，则垂足在点 B 处
    footX = x2;
    footY = y2;
  } else {
    // 否则，计算垂足点坐标
    footX = x1 + t * ABx;
    footY = y1 + t * ABy;
  }

  return { x: footX, y: footY };
}

export function getShortestPointInLine(data) {
  const { segment, point } = data;
  let start = null;
  let end = null;
  if (isObject(segment)) {
    start = getObject({ data: segment.start, defaultValue: {} });
    end = getObject({ data: segment.end, defaultValue: {} });
  } else if (Array.isArray(segment)) {
    start = getObject({ data: segment[0], defaultValue: {} });
    end = getObject({ data: segment[1], defaultValue: {} });
  }
  const { x: startX, y: startY } = start;
  const { x: endX, y: endY } = end;
  const { x: pointX, y: pointY } = point;
  let shortestPoint = null;

  // 确定目标点是否在线段的范围内
  if (
    (pointX >= Math.min(startX, endX) && pointX <= Math.max(startX, endX)) ||
    (pointY >= Math.min(startY, endY) && pointY <= Math.max(startY, endY))
  ) {
    shortestPoint = getPerpendicularFoot({ point, start, end });
    shortestPoint.ifPointNearSegment = true;
  } else {
    // 如果目标点在线段的延长线上，则返回线段的端点到目标点的距离
    const distanceFromStart = Math.sqrt(
      (startX - pointX) ** 2 + (startY - pointY) ** 2
    );
    const distanceFromEnd = Math.sqrt(
      (endX - pointX) ** 2 + (endY - pointY) ** 2
    );

    if (distanceFromStart < distanceFromEnd) {
      shortestPoint = { ...start };
    } else {
      shortestPoint = { ...end };
    }

    shortestPoint.ifPointNearSegment = false;
  }

  return shortestPoint;
}

// 寻找离得最近的线段
export function findClosestLineSegments(data = {}) {
  const { segments = [], point = { x: 0, y: 0 } } = data;
  let minDistance = Infinity;
  let closestPoint = null;
  let targetSegment = null;
  let targetSegmentIndex = -1;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const closestPointInSegment = getShortestPointInLine({ segment, point });
    const distance = getDistance(closestPointInSegment, point);
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = closestPointInSegment;
      targetSegment = segment;
      targetSegmentIndex = i;
    }
  }

  return { minDistance, closestPoint, targetSegment, targetSegmentIndex };
}

// points list to segment
export function points2Segments(points) {
  const segments = [];

  for (let i = 0; i < points.length; i++) {
    const startPoint = points[i];
    const endPoint = points[i + 1];

    if (startPoint && endPoint) {
      segments.push([startPoint, endPoint]);
    }
  }

  return segments;
}

export function isPointOnSegment({ point, segment, maxDistance = 5 }) {
  let ifPointOnSegment = false;
  const { ifPointNearSegment, ...closestPoint } = getShortestPointInLine({
    segment,
    point,
  });

  if (ifPointNearSegment) {
    const distance = getDistance(closestPoint, point);
    ifPointOnSegment = distance < maxDistance;
  }

  return { ifPointOnSegment };
}

export function isPointsNear({ point1, point2, maxDistance = 5 } = {}) {
  const distance = getDistance(point1, point2);
  const ifNear = distance <= maxDistance;
  return { ifNear };
}
