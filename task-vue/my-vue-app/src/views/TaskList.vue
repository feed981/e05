<script setup>
import { useTask } from "@/composables/useTask.js";

const {
  allTaskCount,
  finishTaskCount,
  urgentTaskCount,
  allTasklist
} = useTask();
</script>


<template>
  <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-folder-tree"></i> All Tasklist!</h1>


  <div class="export-container">
    <div v-for="(dates, category, index) in allTasklist" :key="category"> 
      <div v-if="index !== 0" class="hr"></div>
      <div class="export-category">
        <span>{{ category }}</span>
      </div>
      <div class="export-category">

        <i title="This category task count!" class="font-awesome-i fa-solid fa-list-check"></i> : {{ allTaskCount(category) }}
        , <i title="This category archive task count!" class="font-awesome-i fa-solid fa-flag-checkered"></i> : {{ finishTaskCount(category) }} 
        , <i title="This category urgent task count!" class="font-awesome-i fa-solid fa-jug-detergent"></i> : {{ urgentTaskCount(category) }}
      </div>
        
      <div v-for="(tasks, date) in dates" :key="date" class="post">
        <!-- <span v-if="tasks.length === 0">　(No tasks available.)</span> -->
          <div class="user">
            <span class="time">{{ date }}</span>
          </div>
          
          <div class="content">
            <div v-for="(taskList, isCompleted) in tasks" :key="isCompleted">
              <div v-for="(task, index) in taskList" :key="index"
              class="text-content" :class="{ 'completed': isCompleted === 'true'  }">
              {{ index + 1 }}. {{ task }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div><!-- export-container -->
  

</template>
  

<style scoped>
@import "../assets/styles/export.css";
</style>
  