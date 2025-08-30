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
      <div 
        v-for="shape in shapeList" 
        :key="shape.id"
        class="drag-item" 
        draggable="true" 
        @dragstart="onDragStart($event, shape)"
        @dragend="onDragEnd"
      >
        {{ shape.name }} ({{ shape.width }}x{{ shape.height }})
      </div>
    </div>
    <div>
      <input type="number" v-model="width" placeholder="宽度限制" />
      <input type="number" v-model="height" placeholder="高度限制" />
    </div>
    <div @click="resetView">重置视图</div>
    <div class="silhouette">
      <div id="dragSilhouette"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch  } from 'vue';
import type { ShallowRef } from 'vue'
import type { ILeaferAnnotate, ActiveTool } from './leafer.type'

interface ShapeItem {
  id: string;
  name: string;
  type: string;
  width: number;
  height: number;
}

const instance = inject<ShallowRef<ILeaferAnnotate | null>>('leafer-instance')
const activeTool = ref('rect');
const width = ref(0);
const height = ref(0);
watch(width, (newVal) => {
  if (instance && instance.value) {
  instance.value!.limitWidth = newVal;
  }
});
watch(height, (newVal) => {
  if (instance && instance.value) {
    instance.value!.limitHeight = newVal;
  }
});
const shapeList = ref<ShapeItem[]>([
  { id: 'rect-small', name: '小矩形', type: 'rect', width: 50, height: 50 },
  { id: 'rect-medium', name: '中矩形', type: 'rect', width: 200, height: 100 },
  { id: 'rect-large', name: '大矩形', type: 'rect', width: 300, height: 300 }
]);

const setActiveTool = (tool: ActiveTool) => {
  if(!instance) return
  activeTool.value = tool;
};

/**
 * 处理拖拽开始事件
 * @param event 拖拽事件
 * @param shape 图形对象
 */
const onDragStart = (event: DragEvent, shape: ShapeItem) => {
  if (event.dataTransfer && instance?.value) {
    const shapeData = {
      type: shape.type,
      width: shape.width,
      height: shape.height,
      timestamp: Date.now(),
      source: 'toolbar'
    };

    const dataString = JSON.stringify(shapeData);
    event.dataTransfer.setData('application/json', dataString);
    
    // 隐藏默认拖拽图像
    const empty = new Image();
    empty.src = 'data:image/png;base64,iVBORw0KGgo=';
    event.dataTransfer.setDragImage(empty, 0, 0);

    const scale = instance.value.app?.zoomLayer.scaleX || 1;
    const w = shape.width  * scale;
    const h = shape.height * scale;

    const sil = document.getElementById('dragSilhouette')!;
    Object.assign(sil.style, {
      display: 'block',
      width: `${w}px`,
      height: `${h}px`,
      transform: 'translate(-50%, -50%)'
    });

    // 跟随鼠标
    const onDrag = (ev: DragEvent) => {
      sil.style.left = `${ev.clientX}px`;
      sil.style.top  = `${ev.clientY}px`;
    };
    document.addEventListener('dragover', onDrag);
    (event as any).cleanup = () => document.removeEventListener('dragover', onDrag);

    event.dataTransfer.dropEffect = 'move';
  }
};

/**
 * 处理拖拽结束事件
 * @param event 拖拽事件
 */
const onDragEnd = (event: DragEvent) => {
  // 隐藏拖拽剪影
  const sil = document.getElementById('dragSilhouette')!;
  sil.style.display = 'none';
  sil.style.left = '-999px';
  sil.style.top = '-999px';
  
  // 清理事件监听器
  if ((event as any).cleanup) {
    (event as any).cleanup();
  }
};

const resetView = () => {
  if (instance && instance.value) {
    instance.value.resetView();
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
  box-sizing: border-box;
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
  user-select: none;
}

.drag-item:active {
  cursor: grabbing;
}

.silhouette {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
}

#dragSilhouette {
  position: absolute;
  display: none;
  background-color: rgba(0, 123, 255, 0.3);
  border: 2px dashed #007bff;
  pointer-events: none;
}
</style>
