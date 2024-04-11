import Anchor from "./anchor";

export const initEvent = ({ graph }) => {
  const anchor = new Anchor();

  graph.on("mousedown", (evt) => {
    anchor.onMousedown({ evt, graph });
  });

  graph.on("mousemove", (evt) => {
    anchor.onMousemove({ evt, graph });
  });

  graph.on("mouseup", (evt) => {
    anchor.onMouseup({ evt, graph });
  });
};
