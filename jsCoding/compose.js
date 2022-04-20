// 实现compose函数，它的功能是将多个函数（至少一个，可以是很多个）串联起来，前面函数的输出是后面函数的输入，最终返回一个新的函数，新函数的执行结果是串联执行的最终结果
// const add5 = num => num + 5
// const multi10 = num => num * 10
// const add2 = num => num + 2
// console.log(compose(add5, multi10)(10)) //结果是(10 + 5) * 10 = 150


function compose(...args){
    return function(num){
        return args.reduce(function(prev,cur){
          return  cur(prev)
        },num)
    }
}

/** test examples */
const add5 = num => num + 5
const multi10 = num => num * 10
const add2 = num => num + 2
console.log(compose(add5, multi10)(10)) //结果是(10 + 5) * 10 = 150
console.log(compose(add5, multi10,add2)(10))
console.log(compose(add5, add2,multi10,add2)(10))

// 不用reduce怎么实现
function compose(...args){
    return function(num){
        return args.reduce(function(prev,cur){
          return  cur(prev)
        },num)
    }
}