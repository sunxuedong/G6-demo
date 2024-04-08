import TooltipUtil from "./tooltip";

const handleTooltip = ({ evt, asyncFn, graph }) => {
  // const { item } = evt;

  if (!graph) return;

  // const { x, y } = graph.getClientByPoint(evt.x, evt.y);

  // this.toolTipList = getContent(evt);
  // this.toolTipInfo = {
  //   show: true,
  //   x,
  //   y,
  // };

  requestData({ evt }).then(
    asyncFn((res) => {
      console.log(res);
      // this.toolTipList = content;
      // this.toolTipInfo = { show: true, x, y };
    })
  );
};

const requestData = ({ evt }) => {
  const { item } = evt;
  const model = item.getModel();

  return new Promise((resolve, reject) => {
    console.log("requesting data");
    setTimeout(() => resolve("description: " + model.description), 3000);
  });
};

export const initEvent = ({ graph }) => {
  const showAfterFirstTime = (evt) => {
    // const {x, y} = graph.getClientByPoint(evt.x, evt.y);
    // this.toolTipInfo.x = x;
    // this.toolTipInfo.y = y;
  };

  const showAtFirstTime = (evt, asyncFn) => {
    const { item } = evt;
    const type = item.getType();
    console.log(type);

    if (["node", "edge"].includes(type)) {
      handleTooltip({ graph, evt, asyncFn });
    }
  };

  const tooltipUtil = new TooltipUtil({
    showAtFirstTime,
    showAfterFirstTime,
    wait: 100,
    options: { leading: false, trailing: true },
  });

  // 鼠标点hover事件
  graph.on("node:mouseover", (evt) => {
    tooltipUtil.handleMouseOver(evt);
  });

  graph.on("node:mouseleave", (evt) => {
    tooltipUtil.handleMouseOut(evt);
    // this.toolTipInfo.show = false;
  });

  graph.on("node:mousemove", (evt) => {
    tooltipUtil.handleMouseMove(evt);
  });

  // 鼠标边hover事件
  graph.on("edge:mouseover", (evt) => {
    tooltipUtil.handleMouseOver(evt);
  });

  graph.on("edge:mouseleave", (evt) => {
    tooltipUtil.handleMouseOut(evt);
    // this.toolTipInfo.show = false;
  });

  graph.on("edge:mousemove", (evt) => {
    tooltipUtil.handleMouseMove(evt);
  });
};
