function instanceOf(instance,type){
    let proto = instance._proto_
    let prototype = type.prototype
    if(!proto || !prototype){
        return false
    }
    return proto  === prototype
}