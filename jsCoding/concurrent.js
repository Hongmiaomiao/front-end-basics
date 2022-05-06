
// 另一个实现版本
// https://fe.ecool.fun/topic-answer/462ff8a8-29ba-4e49-88ad-d60e7b3f4ee8
async function limit(count, array, iterateFunc) {
    const tasks = []; // 保存所有异步任务
    const doingTasks = []; // 存储正在执行的异步任务欧
    let i = 0; // 记录已经执行的任务数
    const enqueue = () => {
        if (i === array.length) {
            return Promise.resolve();
        }
        // promise.resolve(func)并未执行里面的fun，只是把func转化成了promise,这里的写法是转化并且执行了
        const task = Promise.resolve().then(() => iterateFunc(array[i++]));
        tasks.push(task)
        // 任务执行完成后从doing列表删除
        const doing = task.then(() => doingTasks.splice(doingTasks.indexOf(doing), 1))
        doingTasks.push(doing)
        // 当doingTask存在大于限制的情况，等待第一个执行完的任务，否则递归继续添加到执行队列
        const res = doingTasks.length >= count ? Promise.race(doingTasks) : Promise.resolve();
        return res.then(enqueue)
    };
    // 这个enqueue会一直递归，直到所有的异步执行完（i === array.length）
    // 可以这么写，因为promise结果一旦确立，就不会更改
    return enqueue().then(() => Promise.all(tasks))
}

