
// 因为传入的参数个数不固定，所以利用arguments去访问参数比较合理

Function.prototype.call = function(context,...args){
    let obj = context;
    obj.fn = this;
    if(args.length>0){
        obj.fn(...args);
    }else{
        obj.fn()
    }
    delete obj.fn;
}

// 测试一下
var value = 2;

var test = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}
console.log(bar.call(test, 'kevin', 18));

