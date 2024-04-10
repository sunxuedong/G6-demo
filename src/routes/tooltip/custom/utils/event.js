import TooltipUtil from "./tooltip";

const handleTooltip = ({
  evt,
  asyncFn,
  graph,
  setTooltipShow,
  setTooltipX,
  setTooltipY,
  setTooltipContent,
}) => {
  const { x, y } = graph.getClientByPoint(evt.x, evt.y);
  setTooltipShow(true);
  setTooltipX(x);
  setTooltipY(y);
  setTooltipContent("loading...");

  requestData({ evt }).then(
    asyncFn((res) => {
      setTooltipContent(res);
    })
  );
};

const requestData = ({ evt }) => {
  const { item } = evt;
  const model = item.getModel();

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("description: " + model.description), 3000);
  });
};

export const initEvent = ({
  graph,
  setTooltipShow,
  setTooltipX,
  setTooltipY,
  setTooltipContent,
}) => {
  const showAfterFirstTime = (evt) => {
    const { x, y } = graph.getClientByPoint(evt.x, evt.y);
    setTooltipX(x);
    setTooltipY(y);
  };

  const showAtFirstTime = (evt, asyncFn) => {
    const { item } = evt;
    const type = item.getType();

    if (["node", "edge"].includes(type)) {
      handleTooltip({
        graph,
        evt,
        asyncFn,
        setTooltipShow,
        setTooltipX,
        setTooltipY,
        setTooltipContent,
      });
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
    setTooltipShow(false);
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
    setTooltipShow(false);
  });

  graph.on("edge:mousemove", (evt) => {
    tooltipUtil.handleMouseMove(evt);
  });
};
