
function curry(func){
    return function curried(...args){
        if(args.length>=func.length){
            return func.apply(this,args)
        }else{
            return function (...args2){
                return curried.apply(this,args.concat(args2))
            }
        }
    }
}



function curry(fun){
    let arr = [];
    let context =this;
    return function curried(...arg){
        arr = arr.concat(arg)
        if(arr.length === fun.length){
            return func.apply(context,arr)
        }else{
            return curried
        }
    }


}