
//  [字节异步sum](https://mp.weixin.qq.com/s/KsY8RPgjIlT2_22-G1EipQ)




/**
 * @param {*} options
 * options.fns 任务函数数组
 * options.mode
 *  1. 全部并行执行
 *  2. 逐个串行执行
 *  3. 限制 size 个并行分批执行，执行完一批再到下一批
 *  4. 同时只有 size 个任务执行
 * options.size 执行任务的数量
 * @return {*} value list
 */
 function processConcurrent(options) {}

 const getAsync = param => {
   return () => {
     return new Promise(resolve => {
       setTimeout(() => resolve(param), Math.random() * 100);
     });
   };
 };
 
 // 全部并行执行
 processConcurrent({
   fnc: [1, 2, 3, 4, 5, 6, 7, 8].map(item => getAsync(item)),
   mode: 1,
 }).then(res => {
   console.log('全部并行执行完毕');
   console.log(res);
 });
 
 // 逐个串行执行
 processConcurrent({
   fnc: [1, 2, 3, 4, 5, 6, 7, 8].map(item => getAsync(item)),
   mode: 1,
 }).then(res => {
   console.log('逐个串行执行');
   console.log(res);
 });
 
 // 限制 size 个并行分批执行
 processConcurrent({
   fnc: [1, 2, 3, 4, 5, 6, 7, 8].map(item => getAsync(item)),
   mode: 1,
   size: 3
 }).then(res => {
   console.log('限制 size 个并行分批执行');
   console.log(res);
 });
 
 // 同时只有 size 个任务执行
 processConcurrent({
   fnc: [1, 2, 3, 4, 5, 6, 7, 8].map(item => getAsync(item)),
   mode: 1,
   size: 3
 }).then(res => {
   console.log('同时只有 size 个任务执行');
   console.log(res);
 });