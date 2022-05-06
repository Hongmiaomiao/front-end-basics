// 这里只写es6思路，普通思路就是递归

//1.普通递归省略

// 2. reduce实现
function flatArr1(arr) {
    return arr.reduce(function (prev, cur) {
        console.log('cur', cur, prev)
        return prev.concat(Array.isArray(cur) ? flatArr1(cur) : cur)
    }, [])
}
// console.log(flatArr1([1,[2,[3,[4]]]]))

function flatArr(arr) {
    return arr.flat(Infinity)
}
console.log(flatArr([1, [2, [3, [4]]]]))
