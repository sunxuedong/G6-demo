import { throttle } from "lodash";

export default class tooltip {
  // 鼠标是否在目标上
  ifMouseOver = false;
  // 是否正在展示tooltip
  ifShowingTooltip = false;
  // 时间戳，用于在move时判断曾经注册的move回调是否还需要调用
  ts = null;
  // 初次hover的回调
  showAtFirstTime = () => {};
  // 如果在链路上持续hover，那么不会持续调用showAtFirstTime，而是调用showAfterFirstTime
  showAfterFirstTime = () => {};
  // showAtFirstTime的节流函数，作用：用于滞后判断，场景是快速频繁mouseover然后又mouseout时，不需要显示toolTip
  throttleShowAtFirstTime = () => {};

  constructor(props) {
    const { showAtFirstTime, showAfterFirstTime, wait, options } = props;

    if (typeof showAtFirstTime === "function") {
      this.showAtFirstTime = (...args) => {
        showAtFirstTime(...args);
        // 标记正在显示toolTip
        this.ifShowingTooltip = true;
      };

      this.throttleShowAtFirstTime = throttle(
        (...args) => {
          this.ifMouseOver && this.showAtFirstTime(...args);
        },
        wait,
        options
      );
    }

    if (typeof showAfterFirstTime === "function") {
      this.showAfterFirstTime = (...args) => {
        showAfterFirstTime(...args);
      };
    }
  }

  handleMouseOver = () => {
    this.ifMouseOver = true;
  };

  handleMouseOut = () => {
    this.ifMouseOver = false;
    this.ifShowingTooltip = false;
    this.ts = null;

    if (typeof this.throttleShowAtFirstTime.cancel === "function") {
      this.throttleShowAtFirstTime.cancel();
    }
  };

  handleMouseMove = (evt) => {
    // 当前正在展示tooltip，那么不需要再次调用showAfterFirstTime
    if (this.ifShowingTooltip) {
      this.showAfterFirstTime(evt, this);
    } else {
      // 记录当前时间，const ts 用于闭包使用
      const ts = Date.now();
      // 实时记录最新的ts
      this.ts = ts;
      /**
       * @description 异步函数的回调包装方法，用于在异步场景下，判断是否仍然需要执行hover的回调
       * @description 例如hover到链路上
       * @param {*} fn 回调函数
       */
      const asyncFn = (fn) => {
        // 返回高阶函数
        if (typeof fn === "function") {
          return (...args) => {
            // 判断当前的hover和发起异步之前是否是同一次
            const ifSameTimeHover = this.ts === ts && this.ifMouseOver;
            // 是同一次，那么执行回调
            return ifSameTimeHover && fn(...args);
          };
        }

        // 不传入回调则返回promise
        return new Promise((resolve, reject) => {
          // 判断当前的hover和发起异步之前是否是同一次
          const ifSameTimeHover = this.ts === ts && this.ifMouseOver;
          ifSameTimeHover ? resolve() : reject();
        });
      };

      // 执行showAtFirstTime
      this.throttleShowAtFirstTime(evt, asyncFn);
    }
  };
}
