// 1. on方法增加对事件的监听
// 2. off方法取消对事件的监听
// 3. emit方法触发事件，分发告知相应回调去执行
// 4. emitOnce只触发回调一次


class EventEmitter {
    constructor() {
        this.cache = {};
    }
    on(name, fn) {
        let callbacks = this.cache[name] || [];
        callbacks.push(fn)
        this.cache[name] = callbacks;

    }
    off(name, fn) {
        let callbacks = this.cache[name] || [];
        let index = callbacks.indexOf(fn);
        if (fn === -1) {
            return
        } else {
            this.cache[name].splice(index, 1)
        }
    }
    emit(name) {
        // 复制出来是为了防止回调函数中如果又注册了相同的事件，会造成死循环
        // fn = eventEmitter.on('A',fn) eventEmitter.on('A',fn) eventEmitter.emit('A')
        // 复制出来执行后，当回调函数中再去注册的时候，改变的是this.cache，不是复制出来的对象
        let callbacks = this.cache[name].slice();
        if (callbacks) {
            callbacks.forEach(fn => {
                fn();
            });
        }
    }
    emitOnce(name,once) {
        this.emit(name);
        if(once){
            delete this.cache[name]
        }
    }


}
