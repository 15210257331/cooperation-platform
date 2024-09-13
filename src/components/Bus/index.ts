type BusClass = {
  emit: (name: string, ...args: any[]) => void
  on: (name: string, callback: Function) => void
  off: (name: string, callback: Function) => void
  once: (name: string, callback: Function) => void
}

type ParamsKey = string | number | symbol

type MapObj = {
  [key: ParamsKey]: Array<Function>
}

/** 简单发布订阅模式实现 */
class Bus implements BusClass {
  mapObj: MapObj
  constructor() {
    this.mapObj = {}
  }

  emit(name: string, ...args: any[]) {
    const fnList = this.mapObj[name]
    if (fnList) {
      fnList.forEach(fn => {
        fn.apply(this, args)
      })
    }
  }

  on(name: string, callback: Function) {
    const fnList = this.mapObj[name] || []
    fnList.push(callback)
    this.mapObj[name] = fnList
  }

  off(name: string, fn: Function) {
    const fnList = this.mapObj[name]
    if (name && fn) {
      const index = fnList.findIndex(item => item === fn)
      fnList.splice(index, 1)
    }
  }

  // once 就是存一个临时的函数de 通过on 添加到事件列表 然后 emit 的时候 就调用 de 然后调用完了就执行off删除函数
  once(name: string, fn: Function) {
    const de = (...args: Array<any>) => {
      fn.apply(this, args)
      this.off(name, de)
    }
    this.on(name, de)
  }
}

export default new Bus()
