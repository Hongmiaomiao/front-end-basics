## 双向数据绑定怎么实现
链接：https://github.com/DMQ/mvvm
实现数据绑定的做法有大致如下几种：

- 发布者-订阅者模式（backbone.js）
一般通过sub, pub的方式实现数据和视图的绑定监听，更新数据方式通常做法是 vm.set('property', value)
<http://www.html-js.com/article/Study-of-twoway-data-binding-JavaScript-talk-about-JavaScript-every-day>
- 脏值检查（angular.js）
angular.js 是通过脏值检测的方式比对数据是否有变更，来决定是否更新视图，最简单的方式就是通过 setInterval() 定时轮询检测数据变动，当然Google不会这么low，angular只有在指定的事件触发时进入脏值检测，大致如下：

DOM事件，譬如用户输入文本，点击按钮等。( ng-click )
XHR响应事件 ( $http )
浏览器Location变更事件 ( $location )
Timer事件( $timeout , $interval )
执行 $digest() 或 $apply()

- 数据劫持（vue.js）
vue.js 则是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。
vue3开始使用proxy替代object.defineProperty