import { shallowReactive, watch, reactive } from 'vue'
import { UI, defineKey } from 'leafer-ui'

// 扩展 UI 类型声明
declare module 'leafer-ui' {
  interface UI {
    __proxyBusinessData?: any;
    createProxyBusinessData(): any;
    bindExternalData(externalData: any): void;
  }
}

// 定义proxyData
defineKey(UI.prototype, 'proxyData', {
  get() {
    return this.__proxyData
      ? this.__proxyData
      : (this.__proxyData = this.createProxyData())
  },
})

// 定义proxyBusinessData，专门用于业务数据的响应式绑定
defineKey(UI.prototype, 'proxyBusinessData', {
  get() {
    return this.__proxyBusinessData
      ? this.__proxyBusinessData
      : (this.__proxyBusinessData = this.createProxyBusinessData())
  },
})

// 设置元素属性时，内部同步设置代理数据
UI.prototype.setProxyAttr = function (name: string, newValue: unknown): void {
  const data = this.__proxyData as any
  if (data[name] !== newValue) data[name] = newValue
}

// 获取元素属性时，内部优先返回代理数据
UI.prototype.getProxyAttr = function (name: string): any {
  const value = (this.__proxyData as any)[name]
  return value === undefined ? this.__.__get(name) : value
}

// 创建响应式数据
UI.prototype.createProxyData = function () {
  // 1.获取所有样式数据(含默认值)
  const data = this.__.__getData()

  // 2. 生成响应式数据
  const proxyData = shallowReactive(data)

  // 3.观察响应式数据变化，同步更新元素数据
  for (const name in data) {
    watch(
      () => proxyData[name],
      (newValue) => {
        if (this.__.__get(name) !== newValue) (this as any)[name] = newValue
      }
    )
  }

  return proxyData
}

/**
 * 创建业务数据的响应式代理
 */
UI.prototype.createProxyBusinessData = function () {
  // 1. 获取当前的 data 属性，如果没有则创建空对象
  const originalData = this.data || {}
  
  // 2. 创建响应式数据
  const proxyBusinessData = reactive({ ...originalData })
  
  // 3. 监听响应式数据变化，同步更新元素的 data 属性
  watch(
    () => proxyBusinessData,
    (newData) => {
      // 更新元素的 data 属性
      this.data = { ...newData }
    },
    { deep: true }
  )
  
  // 4. 监听元素 data 属性变化，同步更新响应式数据
  watch(
    () => this.data,
    (newData) => {
      if (newData && typeof newData === 'object') {
        // 更新响应式数据，但要避免循环更新
        Object.keys(newData).forEach(key => {
          if (proxyBusinessData[key] !== newData[key]) {
            proxyBusinessData[key] = newData[key]
          }
        })
        
        // 删除响应式数据中不存在于新数据的属性
        Object.keys(proxyBusinessData).forEach(key => {
          if (!(key in newData)) {
            delete proxyBusinessData[key]
          }
        })
      }
    },
    { deep: true }
  )
  
  return proxyBusinessData
}

/**
 * 绑定外部数据源到元素的业务数据
 * @param externalData 外部响应式数据源（如 Vue 的 reactive 数据）
 */
UI.prototype.bindExternalData = function (externalData: any) {
  // 初始化元素的 data 属性
  this.data = { ...externalData }
  
  // 监听外部数据变化，同步到元素
  watch(
    () => externalData,
    (newData) => {
      this.data = { ...newData }
    },
    { deep: true }
  )
  
  // 监听元素 data 变化，同步到外部数据
  watch(
    () => this.data,
    (newData) => {
      if (newData && typeof newData === 'object') {
        Object.keys(newData).forEach(key => {
          if (externalData[key] !== newData[key]) {
            externalData[key] = newData[key]
          }
        })
      }
    },
    { deep: true }
  )
}