
// 因为传入的参数个数不固定，所以利用arguments去访问参数比较合理


Function.prototype.myCall = (context,...args)=>{
    const key = Symbol('key');
    context[key] = this;
    if(args.length){
        context[key](...args);

    }else{
        context[key]()
    }
    delete context[key];
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

