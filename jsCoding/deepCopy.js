// 深拷贝
// 1. 递归的去遍历数组的属性（存在obj的
// 2. 循环引用问题
function deepCopy(obj, cache = new weakMap()) {
    if (!obj instanceof Object) {
        return obj;
    }
    // 防止循环引用
    if (cache.get(obj)) return cache.get(obj);
    // 支持函数
    if (obj instanceof Function) {
        return function () {
            return obj.apply(this)
        }
    }
    // 支持日期
    if (obj instanceof Date) {
        return new Date(obj)
    }
    // 支持正则对象
    if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags)
    }
    const res = Array.isArray(obj) ? [] : {}
    // 缓存copy的对象，用于处理循环引用的情况
    cache.set(obj, res)
    Object.keys(obj).forEach((key) => {
        if (obj[key] instanceof Object) {
            res[key] = deepCopy(res[key])
        } else {
            res[key] = obj[key]
        }
    })
    return res;
}
