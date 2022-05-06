// new和类的区别 => new之后得到的是实例化的对象
// 类的继承 => 得到一个子类

// new操作符的原理
// 1. 创建一个空对象
// 2. 将空对象的原型对象指向构造函数的原型属性，从而继承原型的方法
// 3. 执行构造函数中的代码，将this指向这个空对象，以获取私有属性
// 4. 如果构造函数返回了一个对象，就知道返回结果，如果返回的不是对象，就把创建的对象返回

function objectFactory(constructor,...args){
    console.log(...args);
    console.log('...args',[...args])
    let obj = {};
    Object.setPrototypeOf(obj,constructor.prototype);
    const res = constructor.apply(obj,[...args]);
    return typeof result === 'object' ? result : obj;

}

// function objectFactory(){
//     let obj = {};
//     // let constructor = [].shift.call(arguments);
//     let [constructor,...args] = arguments; 
//     obj.__proto__ = constructor.prototype;
//     let result = constructor.apply(obj,[...args]);
//     return typeof result === 'object' ? result : obj; 

// }


// test
function Otaku (name, age) {
    this.name = name;
    this.age = age;
    this.color = 'red';
    this.habit = 'Games';
}

Otaku.prototype.strength = 60;

Otaku.prototype.sayYourName = function () {
    console.log('I am ' + this.name);
}

var person = objectFactory(Otaku, 'Kevin', '18')

console.log(person.name) // Kevin
console.log(person.habit) // Games
console.log(person.strength) // 60
console.log(person.color)

person.sayYourName(); // I am Kevin

