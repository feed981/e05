<script setup>
import { computed } from 'vue';
import { useTask } from "@/composables/useTask.js";

const {
  allTaskCount,
  finishTaskCount,
  urgentTaskCount,
  allTasklist
} = useTask();

const props = defineProps({
  page: String,
  categoryName: String
});

// Computed property to filter tasks based on categoryName

const filteredTasklist = computed(() => {
  const category = props.categoryName;
  if (!category) {
    return allTasklist.value; // Return all tasks if no category specified
  } else {
    // Create a new plain object with just the specific category
    
    // Only return the specific category
    const filtered = {};
    if (allTasklist.value[category]) {
      filtered[category] = {...allTasklist.value[category]};
    }
    return filtered;
  }
});

</script>


<template>
  <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-folder-tree"></i> {{ page }}</h1>

  <div class="export-container">
    <div v-for="(dates, category, index) in filteredTasklist" :key="category"> 
      <div v-if="index !== 0" class="hr"></div>
      <router-link :to="`/${category}/tasks`" class="clean-link">
        <div class="export-category">
          <span>{{ category }}</span>
        </div>
      </router-link>
      <div class="export-category">
        <i title="This category task count!" class="font-awesome-i fa-solid fa-list-check"></i> : {{ allTaskCount(category) }} 
        　<i title="This category archive task count!" class="font-awesome-i fa-solid fa-flag-checkered"></i> : {{ finishTaskCount(category) }} 
        　<i title="This category urgent task count!" class="font-awesome-i fa-solid fa-jug-detergent"></i> : {{ urgentTaskCount(category) }} 
      </div>
        
      <div v-for="(tasks, date) in dates" :key="date" class="post">
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
  