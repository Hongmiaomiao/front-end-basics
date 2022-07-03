
# 类型

## 1. 基本类型

JavaScript 的类型分为两种：原始数据类型（[Primitive data types](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)）和对象类型（Object types）。

原始数据类型包括：布尔值、数值、字符串、`null`、`undefined` 以及 ES6 中的新类型 [`Symbol`](http://es6.ruanyifeng.com/#docs/symbol) 和 ES10 中的新类型 [`BigInt`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)。

TypeScript支持与JavaScript几乎相同的数据类型，此外还提供了实用的枚举类型方便我们使用。

### 1.1 布尔值 boolean
在 TypeScript 中，`boolean` 是 JavaScript 中的基本类型，而 `Boolean` 是 JavaScript 中的构造函数。其他基本类型（除了 `null` 和 `undefined`）一样，不再赘述。
```ts
let isDone: boolean = false;

// 编译通过
// 后面约定，未强调编译错误的代码片段，默认为编译通过
```

注意，使用构造函数 `Boolean` 创造的对象**不是**布尔值：

```ts
let createdByNewBoolean: boolean = new Boolean(1);

// Type 'Boolean' is not assignable to type 'boolean'.
//   'boolean' is a primitive, but 'Boolean' is a wrapper object. Prefer using 'boolean' when
```
 ### 1.2  数值 nunber
 ### 1.3 字符串 string
 ### 1.4 Null 和 undefiened
 #### 1.4.1 空值 void
 JavaScript 没有空值（Void）的概念，在 TypeScript 中，可以用 `void` 表示没有任何返回值的函数：

```ts
function alertName(): void {
    alert('My name is Tom');
}
```
与 `void` 的区别是，`undefined` 和 `null` 是所有类型的子类型。也就是说 `undefined` 类型的变量，可以赋值给 `number` 类型的变量：

```ts
// 这样不会报错
let num: number = undefined;
```

```ts
// 这样也不会报错
let u: undefined;
let num: number = u;
```

而 `void` 类型的变量不能赋值给 `number` 类型的变量：

```ts
let u: void;
let num: number = u;

// Type 'void' is not assignable to type 'number'.
```

#### 1.4.2 never类型
    never类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型

### 1.5 枚举类型 enum

枚举类型提供的一个便利是你可以由枚举的值得到它的名字。 例如，我们知道数值为2，但是不确定它映射到Color里的哪个名字，我们可以查找相应的名字：

```
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];

alert(colorName);  // 显示'Green'因为上面代码里它的值是2
```

默认情况下，从`0`开始为元素编号。 你也可以手动的指定成员的数值。 例如，我们将上面的例子改成从`1`开始编号：

```
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;
```

或者，全部都采用手动赋值：

```
enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;
```

### 1.6 数组类型
两种声明方式。
第一种，可以在元素类型后面接上`[]`，表示由此类型元素组成的一个数组：

```
let list: number[] = [1, 2, 3];
```

第二种方式是使用数组泛型，`Array<元素类型>`：

```
let list: number[] = [1, 2, 3];
```

### 1.7 元组类型
元组类型表示一个已知元素数量和类型的数组，各元素的类型不必相同。

```
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error
```

当访问一个已知索引的元素，ts会用声明的类型判断

```
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
```

#### 越界情况
当访问一个越界的元素，ts会使用联合类型替代判断：

```
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型

console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString

x[6] = true; // Error, 布尔不是(string | number)类型
```

### 1.8 类型断言 
    类型断言是在调用某个变量的时候为了告诉ts类型合法，再调用时的开发者声明
    尖括号”语法/as语法
    
    ```ts
    let someValue: any = "this is a string";

    let strLength: number = (<string>someValue).length;
    ```
    ```ts
    let someValue: any = "this is a string";
    let strLength: number = (someValue as string).length;
    ```

## 2. 接口类型

### 2.1 接口类型的未知类型

-  类型断言
     
   ```ts
    interface SquareConfig {
    color?: string;
    width?: number;
    } 
    function createSquare(config: SquareConfig): { color: string; area: number } {
    // ...
    }
    let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```

- 定义额外未知的属性
  
    ```ts
        interface SquareConfig{
            color?: string;
            width?: number;
            [propName: string]: any;
        }
    ```

需要注意的是，一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集：

```ts
     interface Person {
         name: string;
         age?: number;
         [propName: string]: string;
         }

     let tom: Person = {
        name: 'Tom',
        age: 25,
        gender: 'male'
};

// index.ts(3,5): error TS2411: Property 'age' of type 'number' is not assignable to string index type 'string'.
// index.ts(7,5): error TS2322: Type '{ [x: string]: string | number; name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Index signatures are incompatible.
//     Type 'string | number' is not assignable to type 'string'.
//       Type 'number' is not assignable to type 'string'.

```

上述代码因为定义任意类型为string，导致age定义的类型冲突，这种时候可以用联合类型解决

```ts
	interface Person {
		age?: number;
		[prop: string]: string | number;
	}
```

### 2.2 只读属性readonly

```ts
    interface Point {
	    readonly x: number;
	    readonly y: number;
    }
```

 **注意，只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候**：
 
 ```ts
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
};

tom.id = 89757;

// index.ts(8,5): error TS2322: Type '{ name: string; gender: string; }' is not assignable to type 'Person'.
//   Property 'id' is missing in type '{ name: string; gender: string; }'.
// index.ts(13,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
```

上例中，报错信息有两处，第一处是在对 `tom` 进行赋值的时候，没有给 `id` 赋值。

第二处是在给 `tom.id` 赋值的时候，由于它是只读属性，所以报错了。

 #### Q&A
 
- 1. readonly与const有什么区别
     变量使用const、属性使用readonly
- 2. readonly和es6类的私有属性有什么区别（_xx）
     如何实现readonly?


3. ts的private如何实现
[实现私有属性](https://juejin.cn/post/7080131411503972366#heading-3)
7. 接口类型interface

8. interface和type的区别？
   [interface、type区别](https://github.com/SunshowerC/blog/issues/7)
   相同点
   - 都可以描述对象/函数
   - 都可以extends，写法不同（interface用extends、type用&
   不同点®
   - interface不能声明基本类型、元祖类型这些
   - type 可以用 typeof 获取类型用于后续类型生命
   - interface可以合并（分开声明同一个对象，可以被合并起来）


TODO: readonly ts实现的源码