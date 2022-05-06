
# 事件循环

## 事件循环与页面渲染影响 => 事件循环去谈论性能优化

node官方文档的解释是最佳的
https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
前端进阶之道： https://yuchengkai.cn/docs/frontend/browser.html#idle-prepare
知乎详细解析： https://zhuanlan.zhihu.com/p/33058983

谈事件循环

### 单线程+事件循环达成非阻塞

1. js是单线程的语言
   单线程就会涉及到如果异步事件它一直在等待，就会造成浏览器的卡顿
2. 事件循环机制让js实现非阻塞  （script其实是宏任务，最开始会执行一个宏任务的）
   1. js中有执行栈，顺序执行，遇到异步的会挂起到task队列，继续执行执行栈的，异步的返回后会加上另一个队列，这个队列就是事件队列
   2. 当执行栈清空后，会去执行事件队列，事件队列分微任务（es6叫jobs）、宏任务（es6叫task）
      - 微任务包括 process.nextTick ，promise ，Object.observe ，MutationObserver
      - 宏任务包括 script ， setTimeout ，setInterval ，setImmediate ，I/O ，UI rendering
   3. 每次先清空微任务，然后把宏任务中的第一个加入执行栈，然后回到1循环

### Node.js的libuv引擎中的事件循环的模型

┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     pending callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<──connections───     │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘

看inConming,第一次执行开始的是poll阶段

1. timers: 执行定时器的回调如setTimeout() 和 setInterval()。
2. pending callbacks: 为某些系统操作（例如 TCP 错误类型）执行回调。
3. idle, prepare: 这个阶段仅在内部使用，可以不必理会。
4. poll: 等待新的I/O事件，node在一些特殊情况下会阻塞在这里。
5. check: setImmediate()的回调会在这个阶段执行。
6. close callbacks: 例如socket.on('close', ...)这种close事件的回调

#### 自述回答

v8引擎将js代码解析后传入libuv引擎后，循环首先进入poll阶段。
- 外部输入数据-->轮询阶段(poll)-->检查阶段(check)-->关闭事件回调阶段(close callback)-->定时器检测阶段(timer)-->I/O事件回调阶段(I/O callbacks)-->闲置阶段(idle, prepare)-->轮询阶段...
1. 外部输入，进入poll阶段
   1. 如果有定时器的回调需要执行会加入timer队列，然后马上去执行timer
   2. 执行poll queue中的事件
   3. 清空完队列后判断是否有setImmediate()的回调用，有的话进入check阶段执行其回调。
（整个过程收到定时器的回调的话，有的话按顺序放入timer中，然后进入timer阶段。）
   4. 如果两者的queue都是空的，那么loop会在poll阶段停留，直到有一个i/o事件返回，循环会进入i/o callback阶段并立即执行这个事件的callback
   5. 值得注意的是，poll阶段在执行poll queue中的回调时实际上不会无限的执行下去。有两种情况poll阶段会终止执行poll queue中的下一个回调：1.所有回调执行完毕。2.执行数超过了node的限制。
   6. 在poll队列为空的时候会去检查是否有到点的计时器，如果一个或多个计时器准备就绪，事件循环将返回到计时器阶段以执行这些计时器的回调

### 常见困惑

process.nextTick()对比setImmediate()
就用户而言，我们有两个类似的调用，但它们的名称令人困惑。

process.nextTick()在同一阶段立即触发
setImmediate()在事件循环的下一次迭代或“滴答”时触发
本质上，名称应该互换。process.nextTick()比 触发得更快setImmediate()，但这是过去的产物，不太可能改变。进行此切换会破坏 npm 上的大部分软件包。每天都有更多的新模块被添加，这意味着我们等待的每一天，都会发生更多潜在的损坏。虽然它们令人困惑，但名称本身不会改变。

### 当次事件循环，比如在执行微任务的时候解析到新的微任务，是在当前事件循环执行吗

