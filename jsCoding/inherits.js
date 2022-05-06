// new和类的区别 => new之后得到的是实例化的对象
// 类的继承 => 得到一个子类

// JavaScript的原型继承实现方式就是：
// 定义新的构造函数，并在内部用call()调用希望“继承”的构造函数，并绑定this；
// 借助中间函数F实现原型链继承，最好通过封装的inherits函数完成；
// 继续在新的构造函数的原型上定义新方法



// 实例对象的constructor指向它的构造函数，实力对象的__proto__指向它构造函数的原型prototype
function inherits(Child,Parent){
    // 子类继承某个父类，子类应该也是原型链上的一环，所以子类也有一个原型对象，不能让子类的原型直接等于父亲的原型。
    // 借助一个中间函数来嫁接
    var F = function(){};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
}

function superFather(props){
    Father.call(this,props);
}   

inherits(superFather,father)