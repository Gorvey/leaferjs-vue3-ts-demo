<template>
  <div>
    <div
      ref="leaferContainer"
      style="width: 800px; height: 600px; border: 1px solid #ccc"
    ></div>

    <!-- 控制面板 -->
    <div style="margin-top: 20px">
      <h3>视频列表控制</h3>
      <div
        v-for="(item, index) in videoList"
        :key="item.id"
        style="margin-bottom: 10px; padding: 10px; border: 1px solid #eee"
      >
        <p>视频 {{ index + 1 }}: {{ item.title }}</p>
        <p>状态: {{ item.status }} | 进度: {{ item.progress }}%</p>
        <button @click="updateVideo(index)">更新视频</button>
        <button @click="removeVideo(index)">删除视频</button>
      </div>
      <button @click="addVideo">添加新视频</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from "vue";
import { Leafer, Rect, UI, defineKey } from "leafer-ui";

// 应用官方 proxyData 实现
// setupProxyData();

const leaferContainer = ref(null);
let leafer = null;
const rectList = ref([]);

// 业务数据列表
const videoList = reactive([
  {
    id: "video_001",
    title: "示例视频1",
    duration: 120,
    status: "playing",
    progress: 45,
    // UI 属性
    x: 50,
    y: 50,
    fill: "#FF6B6B",
    width: 150,
    height: 100,
  },
  {
    id: "video_002",
    title: "示例视频2",
    duration: 180,
    status: "paused",
    progress: 78,
    // UI 属性
    x: 250,
    y: 50,
    fill: "#4ECDC4",
    width: 150,
    height: 100,
  },
  {
    id: "video_003",
    title: "示例视频3",
    duration: 95,
    status: "stopped",
    progress: 0,
    // UI 属性
    x: 450,
    y: 50,
    fill: "#45B7D1",
    width: 150,
    height: 100,
  },
]);

onMounted(async () => {
  await nextTick()
  // 创建 Leafer 实例
  leafer = new Leafer({
    view: leaferContainer.value,
    width: 800,
    height: 600,
  });

  // 渲染初始列表
  renderVideoList();
});

// 渲染视频列表
function renderVideoList() {
  // 清空现有的 rect
  rectList.value.forEach((rect) => {
    leafer.remove(rect);
  });
  rectList.value = [];

  // 为每个视频数据创建 Rect
  videoList.forEach((videoData, index) => {
    const rect = new Rect({
      cornerRadius: 8,
      draggable: true,
      cursor: "pointer",
      x: videoData.x,
      y: videoData.y,
      width: videoData.width,
      height: videoData.height,
      fill: videoData.fill,
      data:videoData
    });


    // 添加到 leafer 和列表中
    leafer.add(rect);
    rectList.value.push(rect);

    // 监听拖拽事件更新位置数据
    rect.on("drag", () => {
      videoData.x = rect.x;
      videoData.y = rect.y;
    });

    // 点击事件
    rect.on("tap", () => {
      console.log("点击了视频:", videoData.title);
      // 切换播放状态
      videoData.status = videoData.status === "playing" ? "paused" : "playing";
    });
  });
}

// 监听 videoList 变化，重新渲染
// watch(
//   videoList,
//   () => {
//     renderVideoList();
//   },
//   { deep: true }
// );

// 添加新视频
function addVideo() {
  const newVideo = {
    id: `video_${Date.now()}`,
    title: `新视频${videoList.length + 1}`,
    duration: Math.floor(Math.random() * 200) + 60,
    status: "stopped",
    progress: 0,
    x: Math.random() * 600,
    y: Math.random() * 400 + 100,
    fill: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    width: 150,
    height: 100,
  };
  videoList.push(newVideo);
}

// 更新视频数据
function updateVideo(index) {
  const video = videoList[index];
  video.progress = Math.floor(Math.random() * 100);
  video.fill = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  video.title = `${video.title} (已更新)`;
}

// 删除视频
function removeVideo(index) {
  videoList.splice(index, 1);
}

// 应用官方 proxyData 实现
function setupProxyData() {
  // 定义 proxyData getter
  defineKey(UI.prototype, "proxyData", {
    get() {
      return this.__proxyData
        ? this.__proxyData
        : (this.__proxyData = this.createProxyData());
    },
    set(value) {
      this.__proxyData = value;
    },
  });

  // 设置元素属性时，内部同步设置代理数据
  UI.prototype.setProxyAttr = function (name, newValue) {
    const data = this.__proxyData;
    if (data[name] !== newValue) data[name] = newValue;
  };

  // 获取元素属性时，内部优先返回代理数据
  UI.prototype.getProxyAttr = function (name) {
    const value = this.__proxyData[name];
    return value === undefined ? this.__.__get(name) : value;
  };

  // 创建响应式数据
  UI.prototype.createProxyData = function () {
    // 1.获取所有样式数据(含默认值)
    const data = this.__.__getData();

    // 2. 生成响应式数据
    const proxyData = shallowReactive(data);

    // 3.观察响应式数据变化，同步更新元素数据
    for (const name in data) {
      watch(
        () => proxyData[name], // source
        (newValue) => {
          if (this.__.__get(name) !== newValue) this[name] = newValue;
        } // callback
      );
    }

    return proxyData;
  };
}
</script>
