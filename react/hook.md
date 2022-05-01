# 使用hook应当关注的一些点

[toc]

## 官方文档

[官方文档](https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect)
[hook实现原理](https://juejin.cn/post/6891577820821061646)
[很全易懂的hook讲解](https://juejin.cn/post/6844903985338400782#heading-24)

## react为什么加入hooks?

[官网](https://react.docschina.org/docs/hooks-intro.html)

类组件的不足：

- 状态逻辑难复用： 在组件之间复用状态逻辑很难，可能要用到 render props （渲染属性）或者 HOC（高阶组件），但无论是渲染属性，还是高阶组件，都会在原先的组件外包裹一层父容器（一般都是 div 元素），导致层级冗余，容易形成嵌套地域
- 趋向复杂难以维护： 生命周期函数中混杂不相干的逻辑（如：在 componentDidMount 中注册事件以及其他的逻辑，在 componentWillUnmount 中卸载事件，这样分散不集中的写法，很容易写出 bug ）
类组件中到处都是对状态的访问和处理，导致组件难以拆分成更小的组件
- 复杂的this指向。

## hook实现原理

### 模拟实现hook主要是两点

1. Hooks的第一个核心原理：闭包，是的Hooks返回的state和setState方法，在hooks内部都是利用闭包实现的
2. 初始化组件的时候，hooks会维护一个链表，对应相应的state和setState方法，在更新的时候，会去根据这个顺序调用相应的更新方法做变更。
 模拟实现：
   第一次渲染时候，根据 useState 顺序，逐个声明 state 并且将其放入全局 Array 中。每次声明 state，都要将 cursor 增加 1。更新 state，触发再次渲染的时候。cursor 被重置为 0。按照 useState 的声明顺序，依次拿出最新的 state 的值，视图更新。

结合fiber看：

1. Hook数据结构中和fiber数据结构中都有memoizedState字段，但是表达的意义不同，Hook中是作为缓存的state值，但是fiber中是指向的当前fiber下的hooks队列的首个hook（hook是链表结构，指向首个，就意味着可以访问整个hooks队列）
2. fiber中调用hook的时候，会先调用一个前置函数，将当前渲染的fiber和当前执行的hooks队列的首个hook赋值给了当前的全局变量currentlyRenderingFiber和firstCurrentHook
3. fiber调用hooks结束的时候，会调用finishHooks方法，可以看到，会将当前fiber的memoizedState字段存入firstWorkInProgressHook，也就是将hooks队列的首个hook存入，然后将currentlyRenderingFiber字段置为null

### 代码模拟实现

模拟setState的实现

```js
function render() {
  ReactDOM.render(<App />, document.getElementById("root"));
}

let state;

function useState(initialState){
  state = state || initialState;

  function setState(newState) {
    state = newState;
    render();
  }

  return [state, setState];
}

render(); // 首次渲染
```

模拟更新的过程（通过链表去查找要更新的变量）

```js
const states = [];
let cursor = 0;

function useState(initialState) {
  const currenCursor = cursor;
  states[currenCursor] = states[currenCursor] || initialState; // 检查是否渲染过

  function setState(newState) {
    states[currenCursor] = newState;
    render();
  }

  cursor+=1; // 更新游标
  return [states[currenCursor], setState];
}
```

## hooks常用的一些场景

1. useState(存变量状态、根据变量状态刷新)
2. useReducer(useState升级版，可以定义多种action,比如 + 、-、*、/这种状态变更场景比较复杂的类似情况)
3. useEffect(useDidUpdate) => 1. 注意第二个参数传依赖值避免每次都触发 2. 可以分离声明多个useEffect，避免依赖影响 3. useLayoutEffect在渲染前去执行里面的逻辑
4. useRef => 比如对input、表单这些有时候需要用ref去获取相应的dom对象。
5. forwardRef => 接受一个ref，转发到另一个组件中。
6. useImperativeHandle  => 子组件把自身的ref对象暴露给父组件(但配forwardRef使用)
  
```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);

```

在本例中，渲染 <FancyInput ref={inputRef} /> 的父组件可以调用 inputRef.current.focus()。
7. react18中useDeferredValue、useTrainsition、useId

## Q && A

1. 为什么不能在条件中去定义hooks?
初始化组件的时候，hooks会维护一个链表，对应相应的state和setState方法，如果在条件渲染中使用，会导致重渲染的时候，异常的游标对应，异常的游标对应也会导致调用的setState方法失效。
2. shouldComponentUpdate如何用hook实现？

```js
const Button = React.memo((props) => {
  // 你的组件
});
```

这不是一个 Hook 因为它的写法和 Hook 不同。React.memo 等效于 PureComponent，但它只比较 props。（你也可以通过第二个参数指定一个自定义的比较函数来比较新旧 props。如果函数返回 true，就会跳过更新。）
React.memo 不比较 state，因为没有单一的 state 对象可供比较。但你也可以让子节点变为纯组件，或者 用 useMemo 优化每一个具体的子节点。
4. 原来生命周期的方法对应如何实现？
componentDidMount => useLayoutEffect
3. useEffect、useLayoutEffect?
（比如state给了一个初始值、useEffect改变了state） => 使用useEffect会出现ui闪烁一下
useEffect 是异步执行的，而useLayoutEffect是同步执行的。
useEffect 的执行时机是浏览器完成渲染之后，而 useLayoutEffect 的执行时机是浏览器layout后，paint前执行。浏览器把内容真正渲染到界面之前，和 componentDidMount 等价。

## 由hook延伸的与性能优化/用户体验优化相关的一些点

1. 利用React.memo缓存组件
 父组件更新 => 引发子组件更新，为了避免这样的情况。
