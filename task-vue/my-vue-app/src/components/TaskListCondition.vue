<script setup>
import { computed } from 'vue';
import { useTask } from "@/composables/useTask.js";
import TaskMenu from '@/components/TaskMenu.vue'

const {
  allTasklist
} = useTask();

const props = defineProps({
  page: String,
  categoryName: String,
  date: String,
});

// Computed property to filter tasks based on categoryName

const filteredTasklist = computed(() => {
  const category = props.categoryName;
  const date = props.date;
  
  if (!category || !date) {
    return [];  // 如果没有类别或日期，返回空数组
  }
  
  // 确保 allTasklist 存在并且有该类别
  if (!allTasklist.value || !allTasklist.value[category]) {
    return [];
  }
  
  // 尚未完成
  const filtered = allTasklist.value[category][date].false;
  return filtered;  // 直接返回任务数组，而不是嵌套对象
});

</script>

<template>
  <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-folder-tree"></i> {{ page }}</h1>
  
  <span class="title">{{ date }}</span>

  <div class="export-container">
    <div v-for="task in filteredTasklist" :key="task.updatetime">
      <div class="category">
        <div class="category-name">
          <span class="title">{{ task.text }}</span>
          <!-- <span class="title">{{ task.updatetime }}</span> -->
        </div>
        <TaskMenu 
          v-bind:categoryName="categoryName" 
          v-bind:date="date" 
          v-bind:text="task.text" 
          v-bind:updatetime="task.updatetime" 
        />
      </div>
    </div>
  </div>

</template>
  

<style scoped>
@import "../assets/styles/category.css";

.category-name .title {
    -webkit-line-clamp: 2; /* 顯示2行，超過則顯示省略號 */
}

</style>
  