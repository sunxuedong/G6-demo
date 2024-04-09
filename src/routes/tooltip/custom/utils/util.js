export const computedStyle = ({
  x,
  y,
  offsetX,
  offsetY,
  zIndex,
  visibility,
  boxWidth,
  boxHeight,
  clientWidth,
  clientHeight,
}) => {
  const style = { visibility, zIndex };
  let left = x + offsetX;
  let top = y + offsetY;

  // 值都大于0时，尽量保证该组件不超出浏览器的可视区域
  if (
    [boxWidth, boxHeight, clientWidth, clientHeight].every((val) => val > 0)
  ) {
    if (left + boxWidth > clientWidth) {
      left = x - offsetX - boxWidth;
    }
    if (top + boxHeight > clientHeight) {
      top = Math.max(y - offsetY - boxHeight, 0);
    }
  }

  style.left = `${left}px`;
  style.top = `${top}px`;

  return style;
};
