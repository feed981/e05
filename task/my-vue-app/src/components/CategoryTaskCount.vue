<script setup>
import { useTask } from "@/composables/useTask.js";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  category: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: ''
  }
});
const {
  allTaskCount,
  finishTaskCount,
  urgentTaskCount,
  normalTaskCount,
} = useTask();

</script>

<template>
  <router-link 
    :to="{ 
      name: date ? 'v2.category.tasks.date' : 'v2.category.tasks', 
      params: { 
        category: `${category}`,
        ...(date ? { date } : {})
      }
    }" 
    class="clean-link"
  >
    <i class="fa-solid fa-rocket"></i> : {{ allTaskCount(category, date) }}
  </router-link>

  <router-link 
    :to="{ 
      name: date ? 'v2.category.tasks.date.status' : 'v2.category.tasks.status', 
      params: { 
        category: `${category}`,
        ...(date ? { date } : {}),
        status: 'normal'
      }
    }" 
    class="clean-link"
  >
    <i class="fa-solid fa-person-skiing-nordic"></i> : {{ normalTaskCount(category, date) }}
  </router-link>
  
  <router-link 
    :to="{ 
      name: date ? 'v2.category.tasks.date.status' : 'v2.category.tasks.status', 
      params: { 
        category: `${category}`,
        ...(date ? { date } : {}),
        status: 'completed'
      }
    }" 
    class="clean-link"
  >
    <i class="fa-solid fa-font-awesome"></i> : {{ finishTaskCount(category, date) }}
  </router-link>
  
  <router-link 
    :to="{ 
      name: date ? 'v2.category.tasks.date.status' : 'v2.category.tasks.status', 
      params: { 
        category: `${category}`,
        ...(date ? { date } : {}),
        status: 'urgent'
      }
    }" 
    class="clean-link"
  >
    <i class="fa-solid fa-thumbtack"></i> : {{ urgentTaskCount(category, date) }}
  </router-link>
</template>

<style scoped>
i{
    font-size: 14px;
    margin-left: 6px;
}
</style> 