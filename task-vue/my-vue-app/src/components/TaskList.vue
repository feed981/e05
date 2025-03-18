<script setup>
import { ref, computed } from 'vue';
import { useTask } from "@/composables/useTask.js";

const {
  allTaskCount,
  finishTaskCount,
  urgentTaskCount,
  allTasklist
} = useTask();

const props = defineProps({
  page: String,
  categoryName: String,
});

// console.log('category exists:', props.categoryName === '');
// console.log('category exists:', props.categoryName !== undefined && props.categoryName !== null);

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
      filtered[category] = { ...allTasklist.value[category] };
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
        <i title="This category task count!" class="font-awesome-i fa-solid fa-list-check"></i> : {{
          allTaskCount(category) }}
        　<i title="This category archive task count!" class="font-awesome-i fa-solid fa-flag-checkered"></i> : {{
          finishTaskCount(category) }}
        　<i title="This category urgent task count!" class="font-awesome-i fa-solid fa-thumbtack"></i> : {{
          urgentTaskCount(category) }}
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
              <i v-if="task.status === 'completed'" class="font-awesome-i fa-solid fa-flag-checkered"></i>
              <i v-if="task.status === 'urgent'" class="font-awesome-i fa-solid fa-thumbtack"></i>
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