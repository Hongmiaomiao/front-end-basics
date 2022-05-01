# 使用hook应当关注的一些点

[toc]

## 官方文档

[官方文档](https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect)
[hook实现原理](https://juejin.cn/post/6891577820821061646)

## react为什么加入hooks?

[官网](https://react.docschina.org/docs/hooks-intro.html)

1. 以往复用状态让代码耦合、形成嵌套地域： 以往复用状态逻辑比较麻烦（高阶组件、render props容易形成嵌套地狱），Hook 使你在无需修改组件结构的情况下复用状态逻辑。
2. 生命周期定义：
编写复杂组件因为牵扯到状态逻辑，以前会让开发者在生命周期里去做一些不相干的逻辑处理，以及为了数据状态管理引入状态管理库，使得复杂组件不好理解。为了解决这个问题，Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据），而并非强制按照生命周期划分。你还可以使用 reducer 来管理组件的内部状态，使其更加可预测。
3. class对开发者要求较高
   1. 以前的class组件对开发者要求比较高，要理解class的this,要绑定事件处理的this
   2. 不同的生命周期会使逻辑变得分散且混乱，不易维护和管理；

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

## Q && A

1. 为什么不能在条件中去定义hooks?
初始化组件的时候，hooks会维护一个链表，对应相应的state和setState方法，如果在条件渲染中使用，会导致重渲染的时候，异常的游标对应，异常的游标对应也会导致调用的setState方法失效。

2.
