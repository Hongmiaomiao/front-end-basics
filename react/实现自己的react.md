# 实现一个自己的react

本文是对以下文章的翻译
[实现你自己的react](https://pomb.us/build-your-own-react/)
[其中的代码实例](https://codesandbox.io/s/didact-8-21ost)

[toc]
[为什么用函数式组件](https://www.zhihu.com/question/343314784) （感觉最大好处就是优雅的逻辑复用方式）
[网上都说操作真实 DOM 慢，但测试结果却比 React 更快，为什么？ - 尤雨溪的回答 - 知乎](https://www.zhihu.com/question/31809713/answer/53544875)

## 两个核心： jsx语法、函数式组件、hooks、dom

### Start a Easy React

- Step I: The createElement Function
- Step II: The render Function
- Step III: Concurrent Mode
- Step IV: Fibers
- Step V: Render and Commit Phases
- Step VI: Reconciliation
- Step VII: Function Components
- Step VIII: Hooks

#### Step1

 jsx语法会被babel等转译工具转移成js代码，这里转移主要是通过调用react的createElement(type,props,chidlren)方法。
jsx可以理解是react crateElement的语法糖。

```js
// 转译前：
const App = () => <div>你好，世界</div>
//转译后：
var App = function App() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "你好,世界");
};
```

createElement的实现，主要是把入参 => 类似dom的对象（对children处理要注意区分是文本内容还是子元素(obj)）,

```js
 { type: '元素名称'， props: { ...props,children:[]}}
 // ex step1中的返回结果
 { type: 'div', props: { children:[], nodeValue: '你好，世界' }}
 ```

详细的解读见链接文章，大致实现如下

```js
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
       children: children.map(child =>
        typeof child === "object"
          ? child
          : createTextElement(child)
      ),
    },
  }
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    }
  }
}
```

#### Step2

把createElement返回的类似dom的obj转化为真实dom元素添加到dom树上
原理： 一般节点利用document.createElement(),文本节点document.createTextNode()

```js
function render(element, container) {
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);
  const isProperty = key => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name];
    });
  element.props.children.forEach(child => render(child, dom));
  container.appendChild(dom);
}
```

#### Step3 并发模式（优化循环模式）

- *16中的重要优化：在16之前，react做页面更新的时候先要去做虚拟dom的比对，之前因为这里的流程是同步的，原本是栈形式存储节点关系，递归地去比对， 但是带来的问题就是在dom复杂的时候，js线程阻塞了u线程，可能会让用户感觉页面卡顿。
- 以上的流程都是在递归的解析生成dom挂载 => 如果不做处理，这里流程可能会阻塞主线程，当浏览器有高优的其他事件如动画及输入响应，这些应该优先处理 => 措施：拆分可执行的最小单元，在每次执行完一个最小单元的时候如果浏览器有其他更高优先级的事情，就先暂停这里。直到浏览器处理完成。

- 为了做这种优化，react引入了fiber机制（纤维/单元化过程），通过每次执行完一个单元任务，再闲时调用的api回调中去执行下一个单元任务（通过队列存储节点关系。）
如何实现闲时调用？ [参阅浏览器这个api](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback),不过因为兼容性问题，react是自己实现了一个类似该api的效果。

截至19年react中这块循环还不是很稳定，但相对稳定版本如下：
（step4开始讲每一个单元的具体实现--每次执行unit最小单元的逻辑且还会返回下一次执行的最小单元）

```js
function workLoop() {
  // 使用 requestIdleCallback 实现调度
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}
```

#### Step4 Fiber(纤维 -- 个人理解为单元)

render阶段，首先要找到root节点作为第一个工作单元也即第一个（nextUnitWork），然后递归执行performUnitWork（其会返回nextUnitWork）,每个单元做3件事情

1. 添加元素到dom。
2. 为 element 的 children 创建 fibers
3. 选择 nextUnitOfWork

为了方便实现上边的工作，采用树结构(dom也是树结构)，所以每个fiber 节点都会有指向第一个子节点、父节点、兄弟节点的指针。寻找下一个工作fiber的顺序：子节点 -> 兄弟节点 -> 父节点的兄弟节点（若无，一直向上找直到root）

```js
function createDom(fiber) {
  // 创建真实Dom节点
}
function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  }
}
let nextUnitOfWork = null
function workLoop() {
  // 使用 requestIdleCallback 实现调度
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}
function performUnitOfWork(fiber) {
  // add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }
  // create new fibers
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null

  while (index < elements.length) {
    const element = elements[index]
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }
  }
  
   if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber
    index++
  // return next unit of work
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
```

#### Step5 Render and Commit Phases

当没有nextUnitWork了，认为dom构建完整，提交dom变更

#### Step6 调和阶段（dom修改、虚拟dom的比对）

前面我们讲的主要是在初始化的时候根据jsx语法生成fiber树，生成dom树的过程，那react的更新是怎么做的？

**diff方法**（react提供key键，通过key我们可以方便地做节点比对）=> 这里还需再进一步补充

React文档中提到，即使最前沿的算法，将前后两棵树完全比对的算法的复杂程度为O(n3)，其中 n 是树中元素的数量。
如果在 React 中使用了该算法，那么展示 1000个元素所需要执行的计算量将在十亿的量级范围。这个开销实在是太过高昂。
为了降低算法复杂度，React的diff会预设三个限制：

- 只对同级元素进行Diff。如果一个DOM节点在前后两次更新中跨越了层级，那么React不会尝试复用它。
- 两个不同类型的元素会产生出不同的树。如果元素由div变为p，React会销毁div及其子孙节点，并新建p及其子孙节点。如果类型相同，只是属性改变，那么保留dom只对属性做替换。
- React会通过开发者提供的key,作为判断dom的依据。
这里要注意有一个预提交的阶段，在对所有节点没有diff对比完之前，如果就提交了fiber树的变更 => 那页面将显示部分变化、多次变化的情况
=> 这是我们不想看到的，所以会等到整颗fiber树diff完后才去一起提交更新真正的dom。

#### Step7 函数式组件

function组件和class组件区别在于：

1. Functional组件的fiber没有dom节点
2. children是通过直接运行函数得到的，而不是通过props属性
在 performUnitOfWork 中判断是否是函数式组件，是的话执行updateFunctionComponent更新，否执行原来的更新方式

#### Step8 实现hooks

在组件的fiber中维护了一个hooks数组，通过初始化一个全局索引index,在每次新增hooks的时候自增索引的值来映射新的state对应在hooks数组中的位置。对应的更新state的回调也是在初始化的时候按照index去追加到hook队列中。

```js

let wipFiber = null;
let hookIndex = null;

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    hook.state = action(hook.state);
  });

  const setState = action => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

```

### 虚拟dom

### redux

### react合成事件
