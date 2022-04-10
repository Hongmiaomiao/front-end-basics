// 判断对象是否存在循环引用
let obj = {
    b: 'test',
    c: 'test',
    d: 'test'
}
obj.a = obj;

let testObj = {test: 'try'}
let obj2 = {
    a: testObj,
    b: testObj
}

function isLoop(target) {
    // 判断是否存在循环引用
    function inLoop(obj, src) {
        // 把当前对象放入源数组种
        let source = src.concat(obj);
        console.log(source,obj)
        // 循环遍历当前对象的属性，看是否属性种存在值是源数组中的值
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                if (source.indexOf(obj[key]) > -1 || inLoop(obj[key], source)) {
                    return true
                }
            }
        }
        return false
    }
    return inLoop(target, [])
}
 
console.log(isLoop(obj));
console.log(isLoop(obj2));
// 大整数相加

// 