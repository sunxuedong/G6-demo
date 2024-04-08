const requestData = ({ evt }) => {
  const { item } = evt;
  const model = item.getModel();

  return new Promise((resolve, reject) => {
    console.log("requesting data");
    setTimeout(() => resolve("description: " + model.description), 3000);
  });
};

export const initEvent = ({ graph }) => {
  let id = 0;
  const tooltipDom = document.getElementsByClassName("g6-component-tooltip")[0];

  graph.on("node:mouseenter", (evt) => {
    const innerId = ++id;
    console.log("node:mouseenter");

    requestData({ evt }).then((innerHTML) => {
      if (innerId !== id) return;
      tooltipDom.innerHTML = `<div>${innerHTML}</div>`;
    });
  });

  graph.on("node:mouseleave", (evt) => {
    tooltipDom.innerHTML = ``;
  });
};
