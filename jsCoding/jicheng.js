// es5实现继承，思路是依赖原型链。创建函数，将函数的原型指向要继承的对象
// 参考：https://segmentfault.com/a/1190000040733538
// 思路：寄生组合式继承，借用构造函数来继承属性，使用混合式原型继承方法（Object.create复制父类的原型,将子类的原型指向副本）。

function inheritPrototype(subType,superType){
    var prototype = Object.create(superType.prototype);
    prototype.constructor = subType; // 增强对象
    subType.prototype = prototype;  // 这样subtype就可以通过new去调用
}

function subType(superType,...args){
    superType.apply(this,args)
    // subType的一些私有属性
}

// Parent
function Parent(name) {
    this.name = name
  }
  
  Parent.prototype.sayName = function () {
    console.log(this.name)
  };

  const child = subType(Parent,'test');
  