<template>
  <div class="toolbar">
    <div class="tool-buttons">
      <!-- <button
        :class="{ active: activeTool === 'move' }"
        @click="setActiveTool('move')"
      >
        移动
      </button> -->
      <button
        :class="{ active: activeTool === 'rect' }"
        @click="setActiveTool('rect')"
      >
        框选
      </button>
    </div>
    <div class="draggable-items">
      <div class="drag-item" draggable="true" @dragstart="onDragStart($event, 'rect')">
        矩形
      </div>
  
    </div>
    <button @click="instance!.fillColor = 'transparent'">transparent</button>
    <div>| </div>
    <button @click="instance!.fillColor = ''">''</button>
  </div>
</template>

<script setup lang="ts">
import { ref, inject,  } from 'vue';
import type { ShallowRef } from 'vue'
import type { ILeaferAnnotate, ActiveTool } from './leafer.type'

const instance = inject<ShallowRef<ILeaferAnnotate | null>>('leafer-instance')
const activeTool = ref('rect'); // 默认激活移动工具

const setActiveTool = (tool: ActiveTool) => {
  if(!instance) return
  activeTool.value = tool;
  instance?.value?.setActiveTool(tool)
};

/**
 * 处理拖拽开始事件
 * @param event 拖拽事件
 * @param shapeType 图形类型：'rect' 
 */
const onDragStart = (event: DragEvent, shapeType: string) => {
  if (event.dataTransfer) {
    const shapeData = {
      type: shapeType,
      width: 60,
      height: 60,
      timestamp: Date.now(),
      source: 'toolbar'
    };

    const dataString = JSON.stringify(shapeData);
    event.dataTransfer.setData('application/json', dataString);
    console.log(`拖拽 ${shapeType} 数据:`, dataString);
  }
};


</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.tool-buttons {
  margin-right: 20px;
}

.tool-buttons button {
  margin-right: 10px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
}

.tool-buttons button.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.draggable-items {
  display: flex;
}

.drag-item {
  padding: 8px 12px;
  margin-right: 10px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: grab;
  user-select: none; /* 防止拖拽时选中文本 */
}

.drag-item:active {
  cursor: grabbing;
}
</style>
