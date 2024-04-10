import G6 from "@antv/g6";
export const getTooltip = () => {
  return new G6.Tooltip({
    offsetX: 10,
    offsetY: 10,
    // the types of items that allow the tooltip show up
    shouldBegin: (evt) => {
      return true;
    },
    itemTypes: ["node", "edge"],
    // custom the tooltip's content
    // 自定义 tooltip 内容
    getContent: (e) => {
      const tooltipDom = document.getElementsByClassName(
        "g6-component-tooltip"
      )[0];

      if (tooltipDom.innerHTML.length) {
        return tooltipDom.innerHTML;
      }

      return `<div>loading...</div>`;
    },
  });
};
