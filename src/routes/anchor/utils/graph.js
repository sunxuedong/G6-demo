import G6 from "@antv/g6";
import getContextMenu from "./contextMenu";

const getDefaultOptions = () => {
  const defaultOptions = {
    // container: graphContainer.current,
    defaultNode: {
      size: [80, 40],
      shape: "rect",
    },
    defaultEdge: {
      type: "polyline",
      style: {
        lineAppendWidth: 3,
      },
    },
    modes: {
      default: ["drag-node"],
    },
    plugins: [getContextMenu()],
  };

  return defaultOptions;
};

export const initGraph = (options = {}) => {
  const defaultOptions = getDefaultOptions();
  options = Object.assign({}, defaultOptions, options);
  // 在组件挂载时创建图实例
  const graph = new G6.Graph(options);
  return graph;
};
