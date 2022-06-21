// [不用performance做首屏计算](https://juejin.cn/post/7035647196510814221)
type observerDataType = any[];
/**
 * 通过利用MutationObserver api监听dom 树变化，获取页面的性能数据
 * https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
 */
//
export class MyMutationObserver {
  observerData: observerDataType;
  startTime: number;
  observer!: MutationObserver | null;
  calcFirstScreenTime: "pending" | "finished";
  firstScreenTime?: number;
  constructor() {
    this.observerData = [];
    this.calcFirstScreenTime = "pending";
    // TODO: 起点时间确认是否使用timeOrigin
    this.startTime = window.performance.timeOrigin;
    if (!window.MutationObserver) {
      // 不支持 MutationObserver 的话
      console.warn("MutationObserver 不支持，首屏时间无法被采集");
      return;
    }
    /**
     * 监听dom结构变化、计算每个节点的时间
     */
    this.observer = new window.MutationObserver(() => {
      const time = Date.now() - this.startTime; // 当前时间 - 性能开始计算时间
      console.log("time");
      const body = document.querySelector("body");
      let score = 0;
      if (body) {
        score = this.traverseEl(body, 1, false);
        this.observerData.push({ score, time });
      } else {
        this.observerData.push({ score: 0, time });
      }
    });

    // 设置观察目标，接受两个参数: target：观察目标，options：通过对象成员来设置观察选项
    // 设为 childList: true, subtree: true 表示用来监听 DOM 节点插入、删除和修改时
    this.observer.observe(document, { childList: true, subtree: true });
    if (document.readyState === "complete") {
      // MutationObserver监听的最大时间，10秒，超过 10 秒将强制结束
      this.unmountObserver(10000);
    } else {
      console.log("come to not complete");
      // 监听load时间，页面加载完成
      window.addEventListener(
        "load",
        () => {
          console.log("load callback");
          this.unmountObserver(10000);
        },
        false
      );
    }
    window.addEventListener("beforeunload", this.unmountObserverListener);
  }

  /**
   * 深度遍历 DOM 树
   * 算法分析
   * 首次调用为 traverseEl(body, 1, false);
   * @param element 节点
   * @param layer 层节点编号，从上往下，依次表示层数
   * @param identify 表示每个层次得分是否为 0
   * @returns {number} 当前DOM变化得分
   */
  traverseEl(element: Element, layer: number, identify: boolean) {
    // 窗口可视高度
    const height = window.innerHeight || 0;
    let score = 0;
    const tagName = element.tagName;

    if (
      tagName !== "SCRIPT" &&
      tagName !== "STYLE" &&
      tagName !== "META" &&
      tagName !== "HEAD"
    ) {
      const len = element.children ? element.children.length : 0;

      if (len > 0) {
        for (let children = element.children, i = len - 1; i >= 0; i--) {
          score += this.traverseEl(children[i], layer + 1, score > 0);
        }
      }

      // 如果元素高度超出屏幕可视高度直接返回 0 分
      // if (score <= 0 && !identify) {
      if (score <= 0) {
        if (
          element.getBoundingClientRect &&
          element.getBoundingClientRect().top >= height
        ) {
          return 0;
        }
      }
      score += 1 + 0.5 * layer;
    }
    return score;
  }

  unmountObserverListener() {
    if (this.calcFirstScreenTime === "pending") {
      this.unmountObserver(0, true);
    }

    // TODO: ie不兼容补充
    // if (!isIE()) {
    //     window.removeEventListener('beforeunload', this.unmountObserverListener);
    // }
  }
  /**
   * @param delayTime 延迟的时间
   * @param immediately 指是否立即卸载
   * @returns {number}
   */
  unmountObserver(delayTime: number, immediately = false) {
    if (this.observer) {
      if (immediately || this.compare(delayTime)) {
        // MutationObserver停止观察变动
        this.observer.disconnect();
        this.observer = null;

        this.getFirstScreenTime();

        this.calcFirstScreenTime = "finished";
      } else {
        setTimeout(() => {
          this.unmountObserver(delayTime);
        }, 500);
      }
    }
  }

  /**
   * 去掉dom删除情况的舰艇
   * @param observerData
   * @returns
   */
  removeSmallScore(observerData: observerDataType): observerDataType {
    for (let i = 1; i < observerData.length; i++) {
      if (observerData[i].score < observerData[i - 1].score) {
        observerData.splice(i, 1);
        return this.removeSmallScore(observerData);
      }
    }
    return observerData;
  }

  /**
   * 取dom变化最大的时间点为首屏时间
   */
  getFirstScreenTime() {
    this.observerData = this.removeSmallScore(this.observerData);

    let data = null;
    const { observerData } = this;

    for (let i = 1; i < observerData.length; i++) {
      if (observerData[i].time >= observerData[i - 1].time) {
        const scoreDiffer = observerData[i].score - observerData[i - 1].score;
        if (!data || data.rate <= scoreDiffer) {
          data = { time: observerData[i].time, rate: scoreDiffer };
        }
      }
    }

    // if (data && data.time > 0 && data.time < 3600000) {
    //     // 首屏时间
    this.firstScreenTime = data?.time;
    // }
    console.log("firstScreenTime", this.firstScreenTime);
  }

  // * 如果超过延迟时间 delayTime（默认 10 秒），则返回 true
  // * _time - time > 2 * OBSERVE_TIME; 表示当前时间与最后计算得分的时间相比超过了 1000 毫秒，则说明页面 DOM 不再变化，返回 true
  compare(delayTime: number): boolean {
    // 当前所开销的时间
    const _time = Date.now() - this.startTime;
    // 取最后一个元素时间 time
    const { observerData } = this;
    const time =
      (observerData?.length && observerData[observerData.length - 1].time) || 0;
    return _time > delayTime || _time - time > 2 * 500;
  }
}
