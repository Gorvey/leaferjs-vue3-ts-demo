<script setup lang="ts">
import { nextTick, onMounted, ref, reactive } from "vue";
import { createLeaferAnnotate } from "./pages/leafer/leafer";
import type { ILeaferAnnotate } from "./pages/leafer/leafer.type";
import { type IUI } from "leafer-ui";
import type { IMark } from "./pages/leafer/leafer.type";
import pageinfo from "./api/pageinfo.json";
import markList from "./api/marklist.json";

let instance = ref<ILeaferAnnotate | null>(null);
let marks = reactive([...markList as IMark[]]);
onMounted(async () => {
    await nextTick();
    instance.value = await createLeaferAnnotate({
        view: "leafer-container",
        pageUrl: pageinfo.url,
        marks: marks,
        onElementAdd: (element: IUI) => {
            console.log("onElementAdd", element);
        },
    });
});
const getAllMarkDatas = () => {
    return instance.value?.leafer.find(".mark").map((item) => item.data);
};
window.getAllMarkDatas = getAllMarkDatas;
const onDel = (item: IMark) => {
    // 先从leafer中删除元素
    instance.value?.delElement(item.id);
    // 再从marks数组中删除
    const index = marks.findIndex(v => v.id === item.id);
    if (index > -1) {
        marks.splice(index, 1);
    }
}

// 测试响应式数据功能
const testReactivity = () => {
    if (marks.length > 0) {
        // 修改第一个元素的 questionID，看是否会同步到 leafer 元素
        const firstMark = marks[0];
        const oldValue = firstMark.questionID;
        if (firstMark.questionID) {
            firstMark.questionID = firstMark.questionID + "_updated_" + Date.now();
            console.log("Vue数据已更新:", { old: oldValue, new: firstMark.questionID });
            
            // 检查 leafer 元素的数据是否也更新了
            setTimeout(() => {
                const leaferElement = instance.value?.pageFrame.find(`[data.id="${firstMark.id}"]`)[0];
                if (leaferElement) {
                    console.log("Leafer元素数据:", leaferElement.data);
                }
            }, 100);
        }
    }
}

// 添加新的标注
const addNewMark = () => {
    const newMark: IMark = {
        id: `mark_${Date.now()}`,
        top: { x: 100, y: 100 },
        bottom: { x: 200, y: 150 },
        PaperType: "test",
        questionID: "new_question",
        childQuestionID: "new_child"
    };
    marks.push(newMark);
    // 同时在 leafer 中创建对应的元素
    instance.value?.addMarkElement(newMark);
}

</script>

<template>
    <div class="wrapper">
        <div class="leafer-container" id="leafer-container"></div>
        <div class="table">
            <div class="controls">
                <button @click="testReactivity">测试响应式</button>
                <button @click="addNewMark">添加新标注</button>
            </div>
            <table>
                <th>
                <td>id</td>
                <td>PaperType</td>
                <td>questionID</td>
                <td>childQuestionID</td>
                </th>
                <tr v-for="value in marks" :key="value.id">
                    <td><input v-model="value.id"></input></td>
                    <td><input v-model="value.PaperType"></input></td>
                    <td><input v-model="value.questionID"></input></td>
                    <td><input v-model="value.childQuestionID"></input></td>
                    <td><button @click="onDel(value)">删除</button></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<style scoped>
.wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;

    .leafer-container {
        width: 600px;
        height: 100%;
    }

    .table {
        flex-grow: 1;
        overflow: auto;
        padding: 10px;

        .controls {
            margin-bottom: 10px;
            
            button {
                margin-right: 10px;
                padding: 8px 16px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                
                &:hover {
                    background: #0056b3;
                }
            }
        }
    }
}
</style>
