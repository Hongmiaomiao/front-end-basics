# type

## 基本类型

1. 元祖（tuple)与数组类型的区别？
   元祖类型的数组里面可以定义不同的元素类型
2. 枚举类型
   enum Color {Red, Green, Blue}/enum Color {Red = 1, Green, Blue}
3. 空值 void
4. never
    never类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型
5.  类型断言
    尖括号”语法/as语法
    ```js
    let someValue: any = "this is a string";

    let strLength: number = (<string>someValue).length;
    ```
    ```js
    let someValue: any = "this is a string";
    let strLength: number = (someValue as string).length;
    ```
6. 接口类型interface
   只读属性readyonly
    ```js
    interface Point {
    readonly x: number;
    readonly y: number;
    }
    ```
