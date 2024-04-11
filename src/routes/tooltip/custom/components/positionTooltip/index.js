import { useState, useEffect, useRef } from "react";
import Portal from "@/components/protal";
import usePrevious from "@/hooks/usePrevious";
import { computedStyle } from "../../utils/util";
import "./index.scss";

const htmlElem = document.documentElement;

const PositionTooltip = (props) => {
  props = Object.assign(
    {
      show: false,
      x: 0,
      y: 0,
      offsetX: 20,
      offsetY: 20,
      zIndex: 1500,
    },
    props
  );

  const { show, x, y, offsetX, offsetY, zIndex, children } = props;
  const prevShow = usePrevious(show);
  const boxRef = useRef();
  const [visibility, setVisibility] = useState("hidden");
  const [boxWidth, setBoxWidth] = useState(0);
  const [boxHeight, setBoxHeight] = useState(0);
  const [clientWidth, setClientWidth] = useState(htmlElem.clientWidth);
  const [clientHeight, setClientHeight] = useState(htmlElem.clientHeight);
  const styleParams = {
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
  };

  const setClientWidthAndHeight = () => {
    const { clientWidth, clientHeight } = htmlElem;
    setClientWidth(clientWidth);
    setClientHeight(clientHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", setClientWidthAndHeight);
    return () => {
      window.removeEventListener("resize", setClientWidthAndHeight);
    };
  }, []);

  const setBoxWidthAndHeight = () => {
    // 使用宏任务，在下个事件循环获取已渲染好的dom
    setTimeout(() => {
      if (boxRef && show) {
        setBoxWidth(boxRef.offsetWidth);
        setBoxHeight(boxRef.offsetHeight);
        // 获取到宽高后，将box显示出来
        setVisibility("visible");
      }
    }, 0);
  };

  useEffect(() => {
    if (show) {
      // 此次设置为显示
      if (!prevShow) {
        // 但是上次没显示
        setBoxWidthAndHeight();
      }
    } else {
      setVisibility("hidden");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, prevShow]);

  return (
    <Portal id="portal-root">
      {show && (
        <div
          ref={boxRef}
          className="position-tooltip"
          style={computedStyle(styleParams)}
        >
          {children}
        </div>
      )}
    </Portal>
  );
};

export default PositionTooltip;
