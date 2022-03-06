function objectFactory(){
    let obj = {};
    // let constructor = [].shift.call(arguments);
    let [constructor,...args] = arguments; 
    obj.__proto__ = constructor.prototype;
    let result = constructor.apply(obj,[...args]);
    return typeof result === 'object' ? result : obj; 

}

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