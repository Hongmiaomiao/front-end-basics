// 注意点：
// 1. this指向 2. 传递参数

// 防抖，一段时间内多次触发，变成最后一次再隔wait时间去触发
// 场景： 按钮事件（点赞、登陆、发短信etc）、搜索联想、搜索框输入联想



function debounce(wait, func) {
    let timeout;
    let context = this;
    return (function (...args) {
        if (timeout) {
            clearTimeout(timout)
        }
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    })()
}

// 节流
function throttle(wait, func) {
    let timeout;
    let context = this;
    return (function (...args) {
        if (timeout) {
            return
        }
        timeout = setTimeout(() => {
            func.apply(context, args)
        })
    })
}