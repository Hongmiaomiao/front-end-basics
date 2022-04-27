/**
 * 这里要注意的就是继承不只是父子、还可能是爷孙这些情况
 */

function isInstanceOf(instance,type){
    let proto = instance.__proto__
    let prototype = type.prototype;
    while(true){
        if(proto === null) return false
        if(proto === prototype) return true
        proto = proto.__proto__
    }
}

// 测试
class Parent { }
class Child extends Parent { }
const child = new Child()
console.log(isInstanceOf(child, Parent), isInstanceOf(child, Child), isInstanceOf(child, Array));