<script setup>
import { useTaskMenuStore } from '@/store/useStore';
import { useTask } from "@/composables/useTask.js";

const menuStore = useTaskMenuStore();

const props = defineProps({
    categoryName: String,
    date: String,
    text: String,
    updatetime: Number,  // 使用 Number 类型来接收时间戳
    taskstatus: String,
});


// console.log(
//     'categoryName:',props.categoryName,
//     'date:',props.date,
//     'updatetime:',props.updatetime,
// )

const {
    setUrgentTask,
    setEditTask,
    finishTask,
    copyTask,
    removeTask,
} = useTask();

</script>

<template>
    <div @click="menuStore.toggleBars(categoryName, date, updatetime)" class="float2 float-categoryMenu"
    :class="{ 
            'completed': taskstatus === 'completed', 
            'urgent': taskstatus === 'urgent' 
        }"
    >
        <div class="header-container" >
            <div class="hamburger">
                <div class="dropdown">
                    <i class="fa-solid fa-caret-down"></i>
                    <ul v-if="menuStore.expandedTasks[categoryName] && 
                    menuStore.expandedTasks[categoryName][date] && 
                    menuStore.expandedTasks[categoryName][date][String(updatetime)]" 
                    class="dropdown-menu bars">
                        <!-- <li @click="archiveTask(categoryName, updatetime)" >
                            <i class="font-awesome-i fa-solid fa-boxes-packing"></i><span>|　Archive task</span>
                        </li> -->
                        <li @click="copyTask(categoryName, date, text)">
                            <i class="font-awesome-i fa-solid fa-clone"></i><span>|　Copy task text</span>
                        </li>
                        <li @click="setEditTask(categoryName, date, updatetime, text)">
                            <i class="font-awesome-i fa-solid fa-pen-to-square"></i><span>|　Edit task</span>
                        </li>
                        <li @click="setUrgentTask(categoryName, date, updatetime)">
                            <i class="font-awesome-i fa-solid fa-jug-detergent"></i><span>|　Set urgent task</span>
                        </li>
                        <li @click="finishTask(categoryName, date, updatetime)">
                            <i class="font-awesome-i fa-solid fa-flag-checkered"></i><span>|　Finish task</span>
                        </li>
                        <li @click="removeTask(categoryName, date, updatetime, text)" >
                            <i class="font-awesome-i fa-solid fa-trash"></i><span>|　Remove task</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "../assets/styles/header.css";
@import "../assets/styles/categoryMenu.css";
</style>