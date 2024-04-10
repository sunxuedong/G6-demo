function isObject(data) {
  return Object.prototype.toString.call(data) === "[object Object]";
}

function getObject({ data, defaultValue = {} }) {
  return isObject(data) ? data : defaultValue;
}

export function getDistance(start, end) {
  const { x: startX, y: startY } = start;
  const { x: endX, y: endY } = end;
  const dx = endX - startX;
  const dy = endY - startY;

  return Math.sqrt(dx ** 2 + dy ** 2);
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

  // 特殊情况处理：如果线段是垂直线
  if (startX === endX) {
    // 垂直线的情况下，垂直距离就是水平距离
    return Math.abs(pointX - startX);
  }

  const dx = endX - startX;
  const dy = endY - startY;
  const slope = dy / dx;
  // const intercept = startY - slope * startX;
  // 计算目标点到线段的垂直距离
  // const perpendicularDistance =
  //   Math.abs(-slope * pointX + pointY - intercept) /
  //   Math.sqrt(slope * slope + 1);
  // 确定目标点是否在线段的范围内
  if (
    pointX >= Math.min(startX, endX) &&
    pointX <= Math.max(startX, endX) &&
    pointY >= Math.min(startY, endY) &&
    pointY <= Math.max(startY, endY)
  ) {
    // 计算垂足的坐标
    let footX =
      (slope * pointY + pointX / slope + startY - slope * startX) /
      (slope + 1 / slope);
    let footY = slope * (footX - startX) + startY;
    // return Math.sqrt((footX - pointX) ** 2 + (footY - pointY) ** 2);
    return { x: footX, y: footY };
  } else {
    // 如果目标点在线段的延长线上，则返回线段的端点到目标点的距离
    const distanceFromStart = Math.sqrt(
      (startX - pointX) ** 2 + (startY - pointY) ** 2
    );
    const distanceFromEnd = Math.sqrt(
      (endX - pointX) ** 2 + (endY - pointY) ** 2
    );

    if (distanceFromStart < distanceFromEnd) {
      return start;
    } else {
      return end;
    }
  }
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
