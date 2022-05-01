# 使用hook应当关注的一些点

## 官方文档

[官方文档](https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect)
[hook实现原理](https://juejin.cn/post/6986177658614710309#heading-4)

## react为什么加入hooks?

[官网](https://react.docschina.org/docs/hooks-intro.html)

1. 之前复用状态逻辑比较麻烦（高阶组件、render props容易形成嵌套地狱），Hook 使你在无需修改组件结构的情况下复用状态逻辑。
2. 复杂组件难以拆分理解
编写复杂组件因为牵扯到状态逻辑，以前会让开发者在生命周期里去做一些不相干的逻辑处理，以及为了数据状态管理引入状态管理库，使得复杂组件不好理解。为了解决这个问题，Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据），而并非强制按照生命周期划分。你还可以使用 reducer 来管理组件的内部状态，使其更加可预测。
3. class对开发者要求较高
   以前的class组件对开发者要求比较高，要理解class的this,要绑定事件处理的this
