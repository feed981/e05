<script setup>
import { ref, computed } from 'vue';
import { useTask } from "@/composables/useTask.js";

const {
  allTaskCount,
  finishTaskCount,
  urgentTaskCount,
  normalTaskCount,
  allTasklist
} = useTask();

const props = defineProps({
  page: String,
  categoryName: String,
  status: String,
});

// console.log('category exists:', props.categoryName === '');
// console.log('category exists:', props.categoryName !== undefined && props.categoryName !== null);

// Computed property to filter tasks based on categoryName
const filteredTasklist = computed(() => {
  const category = props.categoryName;
  const status = props.status;
  if (!category) {
    return allTasklist.value; // Return all tasks if no category specified
  } else {
    // Create a new plain object with just the specific category
    
    // Only return the specific category
    const filtered = {};
    if (allTasklist.value[category]) {
      if(status){
        const filteredTasks = {}; // 儲存篩選結果的新 JSON

        Object.entries(allTasklist.value[category]).forEach(([date, tasks]) => {
          const filtered = tasks.filter(task => task.status === status);
          if (filtered.length > 0) {
            filteredTasks[date] = filtered; // 只存入有符合條件的資料
          }
        });

        filtered[category] = filteredTasks;

        // filtered[category] = { ...allTasklist.value[category]['2025-03-10'].find(task => task.status === props.status) };

      }else{
        filtered[category] = { ...allTasklist.value[category] };
      }
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
      <router-link v-if="props.categoryName === ''"
        :to="{ name: 'v2.category.tasks', params: { category: `${category}` } }" class="clean-link">
        <div class="export-category">
          <span>{{ category }}</span>
        </div>
      </router-link>
      <div class="export-category">
        <router-link :to="{ name: 'v2.category.tasks', params: { category: `${category}`} }" class="clean-link">
          <i class="fa-regular fa-calendar"></i> : {{ allTaskCount(category) }}
        </router-link>

        <router-link :to="{ name: 'v2.category.tasks.status', params: { category: `${category}`,status: 'normal' } }" class="clean-link">
          <i class="fa-solid fa-person-skiing-nordic"></i> : {{ normalTaskCount(category) }}
        </router-link>
        
        <router-link :to="{ name: 'v2.category.tasks.status', params: { category: `${category}`,status: 'completed' } }" class="clean-link">
          <i class="fa-solid fa-font-awesome"></i> : {{ finishTaskCount(category) }}
        </router-link>
        
        <router-link :to="{ name: 'v2.category.tasks.status', params: { category: `${category}`,status: 'urgent' } }" class="clean-link">
          <i class="fa-solid fa-thumbtack"></i> : {{ urgentTaskCount(category) }}
        </router-link>
      </div>

      <div v-for="(tasks, date) in dates" :key="date" class="post">
        <router-link :to="{ name: 'v2.category.tasks.date', params: { category: `${category}`, date: `${date}` } }"
          class="clean-link">
          <div class="user">
            <span class="time">{{ date }}</span>
          </div>

          <div class="content">
            <div v-for="(task, index) in tasks" :key="index"
              class="text-content" 
              :class="{ 
                'completed': task.status === 'completed', 
                'urgent': task.status === 'urgent' 
              }">
              <i v-if="task.status === 'completed'" class="fa-solid fa-font-awesome"></i>
              <i v-if="task.status === 'urgent'" class="fa-solid fa-thumbtack"></i>
              {{ index + 1 }}. {{ task.text }}
            </div>
          </div>

        </router-link>
      </div>
    </div>
  </div><!-- export-container -->


</template>


<style scoped>
@import "../assets/styles/export.css";
</style>