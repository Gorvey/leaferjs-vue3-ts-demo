<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, shallowRef, ref, reactive, computed, provide } from 'vue'
import Toolbar from './toolbar.vue'
import { createLeaferAnnotate } from './leafer'
import type { ILeaferAnnotate } from './leafer.type'
import { type IUI } from 'leafer-ui'
import type { IMark } from './leafer.type'
import pageinfo from '../../api/pageinfo.json'
import markList from '../../api/marklist.json'
import markList2 from '../../api/marklist2.json'

let instance = shallowRef<ILeaferAnnotate | null>(null)
let manager = shallowRef<{getInstance: () => ILeaferAnnotate | null, destroy: () => Promise<void>}>()
provide('leafer-instance', instance)
let marks = reactive([...(markList as IMark[])])
// 1. 创建一个更新触发器
let listUpdateTrigger = ref(0)

// 辅助函数，用于强制更新 list
const forceUpdateList = () => {
  listUpdateTrigger.value++
}

const list = computed(() => {
  listUpdateTrigger.value
  
  if (!instance.value?.pageFrame) return []
  
  try {
    return instance.value.pageFrame.find('.mark').map((v) => v.proxyData)
  } catch (error) {
    console.error('获取标记列表时出错:', error)
    return []
  }
})

onMounted(async () => {
  try {
    await nextTick()
    manager.value = await createLeaferAnnotate({
      view: 'leafer-container',
      pageUrl: pageinfo.url,
      marks: marks,
      onElementSelect: (element: IUI) => {
        console.log('onElementSelect', element)
      },
      onElementAdd: (element: IUI) => {
        console.log('onElementAdd', element)
        forceUpdateList()
      },
    })
    instance.value = manager.value?.getInstance()
    forceUpdateList()
  } catch (error) {
    console.error('初始化实例时出错:', error)
  }
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
  if (manager.value) {
    try {
      await manager.value.destroy()
      manager.value = undefined
      instance.value = null
      
      await nextTick()
      
      const container = document.querySelector('#leafer-container')
      if (container) {
        container.innerHTML = ''
      }
      
      forceUpdateList()
    } catch (error) {
      console.error('销毁实例时出错:', error)
    }
  }
}

const onSwitchData = async () => {
  try {
    if (instance.value) {
      // 使用新的updateData函数切换数据
      await instance.value.updateData(pageinfo.url, markList2 as IMark[])
      
      // 更新本地marks数组
      marks.length = 0
      marks.push(...(markList2 as IMark[]))
      
      forceUpdateList()
      console.log('数据切换成功')
    }
  } catch (error) {
    console.error('切换数据时出错:', error)
  }
}

const onSet = async () => {
  try {
    await onDestroy()
    await new Promise(resolve => setTimeout(resolve, 100))
    
    manager.value = await createLeaferAnnotate({
      view: 'leafer-container',
      pageUrl: pageinfo.url,
      marks: marks,
      onElementSelect: (element: IUI) => {
        console.log('onElementSelect', element)
      },
      onElementAdd: (element: IUI) => {
        console.log('onElementAdd', element)
        forceUpdateList()
      },
    })
    instance.value = manager.value?.getInstance()
    forceUpdateList()
  } catch (error) {
    console.error('重新创建实例时出错:', error)
  }
}

onUnmounted(async () => {
  try {
    await onDestroy()
  } catch (error) {
    console.error('组件卸载时清理出错:', error)
  }
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
      <div @click="onSwitchData">切换数据</div>
    </div>
      <table>
        <tr v-for="value in list" :key="value!.id">
      <span>ID: {{ value!.id }}</span>
      <input type="number" v-model.number="value!.x" />
      <input type="number" v-model.number="value!.y" />
      <input type="number" v-model.number="value!.width" />
      <input type="number" v-model.number="value!.height" />
      <input type="text" v-model="value!.data!.createTime" />
      </tr>
    </table>
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
  width: 800px;
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
