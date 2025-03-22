<script setup>
import { computed } from 'vue';
import { useTask } from "@/composables/useTask.js";
import TaskMenu from '@/components/TaskMenu.vue'
import TasksNew from '@/components/TasksNew.vue'


const {
  allTaskCount,
  finishTaskCount,
  urgentTaskCount,
  normalTaskCount,
  allTasklist,
} = useTask();

const props = defineProps({
  page: String,
  categoryName: String,
  date: String,
  status: String,
});

// Computed property to filter tasks based on categoryName

const filteredTasklist = computed(() => {
  const category = props.categoryName;
  const date = props.date;
  const status = props.status;
  
  if (!category || !date) {
    return [];  // 如果没有类别或日期，返回空数组
  }
  
  // 确保 allTasklist 存在并且有该类别
  if (!allTasklist.value || !allTasklist.value[category]) {
    return [];
  }
  // console.log('status:',status)
  if(status){
    return allTasklist.value[category][date].filter(
      task => task.status === status
    );
  }
  return allTasklist.value[category][date]; // 直接返回任务数组，而不是嵌套对象
});

</script>

<template>
  <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-folder-tree"></i> {{ page + ' ' + date}}</h1>
  <TasksNew 
    v-bind:page="categoryName"
    v-bind:categoryName="categoryName"
    v-bind:date="date"
  />
  <br>

  <div class="export-category">
    <router-link :to="{ name: 'v2.category.tasks.date', params: { category: `${categoryName}`} }" class="clean-link">
      <i class="fa-regular fa-calendar"></i> : {{ allTaskCount(categoryName, date) }}
    </router-link>

    <router-link :to="{ name: 'v2.category.tasks.date.status', params: { category: `${categoryName}`,status: 'normal' } }" class="clean-link">
      <i class="fa-solid fa-person-skiing-nordic"></i> : {{ normalTaskCount(categoryName, date) }}
    </router-link>
    
    <router-link :to="{ name: 'v2.category.tasks.date.status', params: { category: `${categoryName}`,status: 'completed' } }" class="clean-link">
      <i class="fa-solid fa-font-awesome"></i> : {{ finishTaskCount(categoryName, date) }}
    </router-link>
    
    <router-link :to="{ name: 'v2.category.tasks.date.status', params: { category: `${categoryName}`,status: 'urgent' } }" class="clean-link">
      <i class="fa-solid fa-thumbtack"></i> : {{ urgentTaskCount(categoryName, date) }}
    </router-link>
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

.export-category .clean-link{
    font-size: 14px;
    margin-right: 10px;
  }
</style>
  