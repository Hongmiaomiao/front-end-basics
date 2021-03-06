# url加载 => 渲染整个流程

[好文、详细](http://www.dailichun.com/2018/03/12/whenyouenteraurl.html)
[渲染过程详解](https://juejin.cn/post/6844903476506394638)
[mdn文档，看下对重排、绘、合成的描述](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#%E6%B8%B2%E6%9F%93)

## dns解析

1. DNS查询顺序：浏览器缓存→系统缓存→路由器缓存→ISP DNS 缓存→递归搜索（系统缓存，本地的host文件）
2. 没有的话做解析
要点： 1. 跨域场景才会用到 2. 可以搭配preConnect（需要建立的链接不多的话采用）
[dns解析预加载最佳实践](https://developer.mozilla.org/zh-CN/docs/Web/Performance/dns-prefetch)
[浏览器dns的查看和清除](https://www.cnblogs.com/shengulong/p/7443806.html)
3. 域名解析一个dns服务器解析一个域名可能会对应不同的ip地址（即后台可能设置了负载均衡），用户被解析到的具体ip地址一般是根据用户的地域对应到更近的（不同地域的ip有不同的分段号）

![avatar](/js面试理解题/http-time.jpg)
看到没缓存的话dns查询时间可以达到100ms,有浏览器缓存的话是
![avatar](/性能优化.jpg)
看到没缓存的话dns查询时间可以达到100ms,有浏览器缓存的话是

## 渲染过程

1. 可以延伸的一些点 => 从渲染过程讲注意重绘重排之类的
2. 除了layout重排，paint重绘，还有composite合成阶段，比如css3动画就是在合成阶段。animation、transform这些，这个阶段

## Q && A

> defer和async的区别？
> 普通脚本、模块脚本 => 默认是普通脚本，模块脚本声明type="module".模块脚本