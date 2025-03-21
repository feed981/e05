<script setup>
import { computed } from 'vue';
import { useTask } from "@/composables/useTask.js";
import TaskMenu from '@/components/TaskMenu.vue'
import TasksNew from '@/components/TasksNew.vue'


const {
  allTaskCount,
  finishTaskCount,
  urgentTaskCount,
  allTasklist,
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
  const filtered = allTasklist.value[category][date];
  return filtered;  // 直接返回任务数组，而不是嵌套对象
});

</script>

<template>
  <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-folder-tree"></i> {{ page }}</h1>
  <TasksNew 
    v-bind:page="categoryName"
    v-bind:categoryName="categoryName"
    v-bind:date="date"
  />
  <br>
  <div class="title-date">{{ date }}</div>

  <div class="export-category">
    <i title="This category task count!" class="fa-solid fa-list-check"></i> : {{
      allTaskCount(categoryName, date) }}
    　<i title="This category archive task count!" class="fa-solid fa-flag-checkered"></i> : {{
      finishTaskCount(categoryName, date) }}
    　<i title="This category urgent task count!" class="fa-solid fa-thumbtack"></i> : {{
      urgentTaskCount(categoryName, date) }}
  </div>

  <div class="export-container">
    <div v-for="task in filteredTasklist" :key="task.updatetime">
      
      <div class="category"
      :class="{ 
                'completed': task.status === 'completed', 
                'urgent': task.status === 'urgent' 
          }">
        <div class="category-name">
          <span class="title">
            <i v-if="task.status === 'completed'" class="fa-solid fa-flag-checkered"></i>
            <i v-if="task.status === 'urgent'" class="fa-solid fa-thumbtack"></i>
          {{ task.text }}</span>
          <!-- <span class="title">{{ task.updatetime }}</span> -->
        </div>
        <TaskMenu 
        v-bind:categoryName="categoryName" 
        v-bind:date="date" 
        v-bind:text="task.text" 
        v-bind:updatetime="task.updatetime" 
        v-bind:taskstatus="task.status" 
      />
      </div>

    </div>
  </div>

</template>
  

<style scoped>
@import "../assets/styles/category.css";

.category-name .title {
    -webkit-line-clamp: 5; /* 顯示2行，超過則顯示省略號 */
}

.category{
  height: auto;
}

.export-container {
    max-height: 35vh;
}  

</style>
  