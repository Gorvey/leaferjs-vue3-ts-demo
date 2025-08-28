<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, shallowRef, ref, reactive, computed, provide } from 'vue'
import Toolbar from './toolbar.vue'
import { createLeaferAnnotate } from './leafer'
import type { ILeaferAnnotate } from './leafer.type'
import { type IUI } from 'leafer-ui'
import type { IMark } from './leafer.type'
import pageinfo from '../../api/pageinfo.json'
import markList from '../../api/marklist.json'

let instance = shallowRef<ILeaferAnnotate | null>(null)
provide('leafer-instance', instance)
let marks = reactive([...(markList as IMark[])])
// 1. 创建一个更新触发器
let listUpdateTrigger = ref(0)

// 辅助函数，用于强制更新 list
const forceUpdateList = () => {
  listUpdateTrigger.value++
}

const list = computed(() => {
  // 2. 让 computed 依赖于触发器
  listUpdateTrigger.value
  console.log('Computed list is recalculating...') // 添加日志方便调试

  if (instance.value === null) return []
  return instance.value.pageFrame.find('.mark').map((v) => v.proxyData)
})

onMounted(async () => {
  await nextTick()
  instance.value = await createLeaferAnnotate({
    view: 'leafer-container',
    pageUrl: pageinfo.url,
    marks: marks,
    onElementSelect: (element: IUI) => {
      console.log('onElementAdd', element)
    },
    onElementAdd: (element: IUI) => {
      console.log('onElementAdd', element)
      // 元素添加后也触发更新
      forceUpdateList()
    },
  })
  // 实例创建完成后，手动触发一次更新以确保初始列表正确
  forceUpdateList()
})

// const onDel = (item: IMark) => {
//   // 先从leafer中删除元素
//   instance.value?.delElement(item.id)
//   // 再从marks数组中删除
//   const index = marks.findIndex((v) => v.id === item.id)
//   if (index > -1) {
//     marks.splice(index, 1)
//   }
//   // 3. 删除元素后，调用触发器
//   forceUpdateList()
// }

const onDestroy = async () => {
  if (instance.value) {
    await instance.value.destroy()
    await nextTick()
    let children = document.querySelector('#leafer-container')?.children
    if (children) {
      for (let i = 0; i < children.length; i++) {
        children[i].remove()
      }
    }
    await nextTick()

    instance.value = null
   
    
    // 重置触发器
    forceUpdateList()
  }
}

const onSet = async () => {
  await onDestroy()
  // 等待一小段时间确保销毁完成
  await new Promise(resolve => setTimeout(resolve, 100))
  
  instance.value = await createLeaferAnnotate({
    view: 'leafer-container',
    pageUrl: pageinfo.url,
    marks: marks,
    onElementSelect: (element: IUI) => {
      console.log('onElementAdd', element)
    },
    onElementAdd: (element: IUI) => {
      console.log('onElementAdd', element)
      // 元素添加后也触发更新
      forceUpdateList()
    },
  })
  // 重新创建后触发更新
  forceUpdateList()
}

// 组件卸载时清理
onUnmounted( () => {
   onDestroy()
})
</script>

<template>
  <div class="wrapper">
    <div class="main-content">
      <div class="leafer-container" id="leafer-container"></div>
      <Toolbar />
      
    </div>
    <div class="table">
      <div @click="onDestroy">销毁</div>
      <div @click="onSet">设置</div>

      <div v-for="value in list" :key="value!.id">
        <span>ID: {{ value!.id }}</span>
        <input type="number" v-model.number="value!.x" />
        <input type="number" v-model.number="value!.y" />
        <input type="number" v-model.number="value!.width" />
        <input type="number" v-model.number="value!.height" />
        <input type="text" v-model="value!.data!.createTime" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
}

.main-content {
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 100%;
}

.leafer-container {
  flex-grow: 1;
  /* 移除固定的宽度，因为它现在由父容器.main-content控制 */
  overflow: hidden; /* 确保leafer画布不会溢出其容器 */
}

.table {
  flex-grow: 1;
  overflow: auto;
  padding: 10px;
}

.controls {
  margin-bottom: 10px;
}

.controls button {
  margin-right: 10px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:hover {
  background: #0056b3;
}

.table > div {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 10px;
}

.table input {
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
