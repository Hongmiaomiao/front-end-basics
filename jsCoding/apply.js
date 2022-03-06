// apply接受两个参数，一个是绑定的对象，一个是参数数组

let apply = function(obj,args){
    // this是function,传进来的参数是要绑定的对象
    obj.fn = this;
    if(args.length > 0 ){
        obj.fn([...args]);
    }else{
        obj.fn();
    }
    delete obj.fn;
}

/*
 更优雅的写法
 1. 用原型链写法更优，Function.prototype.apply = xxx
 2. 不存在obj的时候一般默认是window
 3. 可以用context去表示obj更易读，context是上下文的含义
*/



//test.js

let a = 1;
function testApply(c){
    console.log('a',this.a)
    console.log('c',c);
}
console.log('notbind','----')
testApply();
Function.prototype.apply  = apply;
let b = { 
    a: 2
}
console.log('bind','----')
testApply.apply(b,[1,2,3])