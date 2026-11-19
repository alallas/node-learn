// 观察者模式就是把状态变化和发布绑定在一起，外部的人控制的是状态，用控制状态替代发布
// 订阅的时候只需要订阅对象，订阅之后要干嘛是写在内部函数里面的，外部无法改
// 适用于更具体细化的相互依赖关系


// 被观察者，需要绑定观察者
class Subject {
    state = undefined
    observers = []

    // 订阅
    attach(observer) {
        this.observers.push(observer.update)
    }

    // 状态变更，带来发布行为
    setState(newState) {
        this.state = newState
        this.observers.forEach(fn=>fn(newState))
    }

}


// 观察者，需要被绑定到被观察者上，其依赖的对象是被观察者
class Observer {
    // 当订阅的对象的状态变更，需要执行的函数
    update(newState) {
        // 拿到依赖对象的新值，用来做一些逻辑
        console.log('执行update', newState)
    }
}

const baby = new Subject()
const mom = new Observer()
const dad = new Observer()

// 先订阅
baby.attach(mom)
baby.attach(dad)

// 状态变化等同于发布，自动执行之前订阅的对象的update函数
baby.setState('新状态')




