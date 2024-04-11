import Anchor from "./anchor";

export const initEvent = ({ graph, onAnchorChange }) => {
  const anchor = new Anchor();

  graph.on("mousedown", (evt) => {
    anchor.onMousedown({ evt, graph });
  });

  graph.on("mousemove", (evt) => {
    anchor.onMousemove({ evt, graph, onAnchorChange });
  });

  graph.on("mouseup", (evt) => {
    anchor.onMouseup({ evt, graph });
  });
};
