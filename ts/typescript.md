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
    ```
    let someValue: any = "this is a string";
    let strLength: number = (someValue as string).length;
    ```
6. 只读属性readyonly
    ```js
    interface Point {
    readonly x: number;
    readonly y: number;
    }
    ```
    **Q&A**
    > readonly与const有什么区别
    >
    > 变量使用const、属性使用readonly

    > readyonly和es6类的私有属性有什么区别（_xx）

    > 如何实现readonly?
7. ts的private如何实现
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