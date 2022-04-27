[外网实现你自己的react，很不错的文章](https://pomb.us/build-your-own-react/)
km文章： <https://km.woa.com/group/22651/articles/show/441548>
为什么用函数式组件？ https://www.zhihu.com/question/343314784 （感觉最大好处就是优雅的逻辑复用方式
网上都说操作真实 DOM 慢，但测试结果却比 React 更快，为什么？ - 尤雨溪的回答 - 知乎
https://www.zhihu.com/question/31809713/answer/53544875

[hook实现原理](https://juejin.cn/post/6986177658614710309#heading-4)
## 两个核心： jsx语法、函数式组件、hooks、dom

### Start a EsayReact

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

以上的流程都是在递归的解析生成dom挂载 => 如果不做处理，这里流程可能会阻塞主线程，当浏览器有高优的其他事件如动画及输入响应，这些应该优秀处理 => 措施：拆分可执行的最小单元，在每次执行完一个最小单元的时候如果浏览器有其他更高优先级的事情，就先暂停这里。直到浏览器处理完成。

- 浏览器有一个新的api规范可以在  浏览器空闲下来后触发回调
https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback


截至19年react中这块循环还不是很稳定，但相对稳定版本如下：
（step4开始讲每一个单元的具体实现--每次执行unit最小单元的逻辑且还会返回下一次执行的最小单元）
```
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
1.  添加元素到dom
2. 为 element 的 chilren 创建 fibers
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
#### Step5 Commit阶段

当没有nextUnitWork了，认为dom构建完整，提交dom变更

#### Step6 调和阶段（dom修改、虚拟dom的比对）
render时会获取到新的dom树结构，我们会拿保存的旧的虚拟dom的对象和它比较。

**比较方法**（react提供key键，通过key我们可以方便地做节点比对）

1. 如果类型相同，可以保持 dom 节点，使用新的属性替换。
2. 如果类型不同并且为新element（根据key来辅助判断），则需要创建一个新的dom节点；
3. 如果类型不同且为旧fiber的话（根据key来判断），需要删除
2、3点中key属性可以帮助react判断是否原来的节点，如果类型改变但非原来节点，原来节点在另一个位置，那只需要进行位置的交换就可以。


#### Step7 函数式组件

function组件和class组件区别在于：

1. Functional组件的fiber没有dom节点
2. children是通过直接运行函数得到的，而不是通过children属性
在 performUnitOfWork 中判断是否是函数式组件，是的话执行updateFunctionComponent更新，否执行原来的更新方式

### 虚拟dom

React文档中提到，即使最前沿的算法，将前后两棵树完全比对的算法的复杂程度为O(n3)，其中 n 是树中元素的数量。
如果在 React 中使用了该算法，那么展示 1000个元素所需要执行的计算量将在十亿的量级范围。这个开销实在是太过高昂。
为了降低算法复杂度，React的diff会预设三个限制：
- 只对同级元素进行Diff。如果一个DOM节点在前后两次更新中跨越了层级，那么React不会尝试复用它。
- 两个不同类型的元素会产生出不同的树。如果元素由div变为p，React会销毁div及其子孙节点，并新建p及其子孙节点。
- React会通过开发者提供的key,作为判断dom的依据。

### Hooks
####  react为什么加入hooks?
官网： https://react.docschina.org/docs/hooks-intro.html
1. 之前复用状态逻辑比较麻烦（高阶组件、render props容易形成嵌套地狱），Hook 使你在无需修改组件结构的情况下复用状态逻辑。
2. 复杂组件难以拆分理解
编写复杂组件因为牵扯到状态逻辑，以前会让开发者在生命周期里去做一些不相干的逻辑处理，以及为了数据状态管理引入状态管理库，使得复杂组件不好理解。为了解决这个问题，Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据），而并非强制按照生命周期划分。你还可以使用 reducer 来管理组件的内部状态，使其更加可预测。
3. class对开发者要求较高
   以前的class组件对开发者要求比较高，要理解class的this,要绑定事件处理的this
### redux

### react合成事件

