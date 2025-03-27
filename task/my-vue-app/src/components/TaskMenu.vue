<script setup>
import { useTaskMenuStore } from '@/store/useStore';
import { useTask } from "@/composables/useTask.js";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
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
            'completed': taskstatus === t('task.status.completed'), 
            'urgent': taskstatus === t('task.status.urgent') 
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
                            <i class="fa-solid fa-boxes-packing"></i>|　{{ t('task.menu.archive') }}
                        </li> -->
                        <li @click="copyTask(categoryName, date, text)">
                            <i class="fa-solid fa-clone"></i>|　{{ t('task.menu.copy') }}
                        </li>
                        <li @click="setEditTask(categoryName, date, updatetime, text)">
                            <i class="fa-solid fa-pen-to-square"></i>|　{{ t('task.menu.edit') }}
                        </li>
                        <li @click="setUrgentTask(categoryName, date, updatetime)">
                            <i class="fa-solid fa-jug-detergent"></i>|　{{ t('task.menu.urgent') }}
                        </li>
                        <li @click="finishTask(categoryName, date, updatetime)">
                            <i class="fa-solid fa-flag-checkered"></i>|　{{ t('task.menu.finish') }}
                        </li>
                        <li @click="removeTask(categoryName, date, updatetime, text)" >
                            <i class="fa-solid fa-trash"></i>|　{{ t('task.menu.remove') }}
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