import { shallowReactive, reactive, watch } from "vue";

import { UI, defineKey } from "leafer-ui";

// 定义proxyData

defineKey(UI.prototype, "proxyData", {
  get() {
    return this.__proxyData
      ? this.__proxyData
      : (this.__proxyData = this.createProxyData());
  },
});

// 设置元素属性时，内部同步设置代理数据

UI.prototype.setProxyAttr = function (name: string, newValue: unknown): void {
  const data = this.__proxyData as any;
  if (data[name] !== newValue) data[name] = newValue;
};

// 获取元素属性时，内部优先返回代理数据

UI.prototype.getProxyAttr = function (name: string): any {
  const value = (this.__proxyData as any)[name];
  return value === undefined ? this.__.__get(name) : value;
};

// 创建响应式数据

UI.prototype.createProxyData = function () {
  // 1.获取所有样式数据(含默认值)
  const data = this.__.__getData();

  // 2. 生成响应式数据
  const proxyData = shallowReactive(data);
  
  // 对 data 字段单独进行深度响应式处理
  if (data.data && typeof data.data === 'object') {
    proxyData.data = reactive(data.data);
  }

  // 3.观察响应式数据变化，同步更新元素数据
  for (const name in data) {
      if (name === 'data') {
        // 对 data 字段进行深度监听
        watch(
          () => proxyData[name], // source
          (newValue) => {
            console.log(name,'change',newValue)
            if (this.__.__get(name) !== newValue) (this as any)[name] = newValue;
          }, 
          { deep: true } // 仅对 data 字段深度监听
        );
      } else {
        // 其他字段浅层监听
        watch(
          () => proxyData[name], // source
          (newValue) => {
            console.log(name,'change',newValue)
            if (this.__.__get(name) !== newValue) (this as any)[name] = newValue;
          } 
        );
      }
  }

  return proxyData;
};
