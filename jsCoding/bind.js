//  1. bind返回一个新函数，函数的this指向传入的对象
//  2. bind返回的新函数支持new调用,且使用new关键字创建实例，这种时候this指向会失效
//  (针对第二点处理思路是在 1.返回的新函数中，判断当前对象是否的原型是否指向构造函数（通过instanceof）是的话this就返回新函数本身的this，不是的话就绑定传入的obj
//   2. )
//  参考文档： 
// 1. javascript深入： https://github.com/mqyqingfeng/Blog/issues/12 
// 2. 掘金： https://juejin.cn/post/6844903633067180039
// 3. 

Function.prototype.bind  = (context,args)=>{
    const fn = this;
  function newF(args){
      return  fn.apply(this instanceof newF ? this : context,[...args])
  }
  newF.prototype = this.prototype;
  return newFunc
}