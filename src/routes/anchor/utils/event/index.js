import Anchor from "./anchor";

export const initEvent = ({ graph, onAnchorChange }) => {
  const anchor = new Anchor();

  graph.on("edge:mousedown", (evt) => {
    anchor.onMousedown({ evt, graph });
  });

  graph.on("mousemove", (evt) => {
    anchor.onMousemove({ evt, graph, onAnchorChange });
  });

  graph.on("edge:mouseup", (evt) => {
    anchor.onMouseup({ evt, graph });
  });
};
