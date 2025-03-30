<script setup>
import { ref, computed } from 'vue';
import { useTask } from "@/composables/useTask.js";
import { useI18n } from 'vue-i18n';
import TasksNew from '@/components/TasksNew.vue'
import CategoryTaskCount from '@/components/CategoryTaskCount.vue'
import { usePlusStore } from '@/store/useStore.js';

const { t } = useI18n();

const plusStore = usePlusStore();

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
  date: String,
  status: {
    type: String,
    default: ''
  },
});

// console.log('props.categoryName:', props.categoryName);
// Computed property to filter tasks based on categoryName and date
const filteredTasklist = computed(() => {
  const category = props.categoryName;

  const date = props.date;
  const status = props.status;
  // 如果有指定日期，過濾所有類別的該日期任務
  if (date) {
    const filteredTasks = {};
    Object.entries(allTasklist.value).forEach(([cat, dates]) => {
      // 檢查該類別下是否有符合 date 的日期
      if (dates[date]) {
        // 創建一個新的日期對象，保持原有的數據結構
        filteredTasks[cat] = {
          [date]: dates[date]
        };
      }
    });

    return filteredTasks;
  }

  // 如果沒有指定日期，使用原有的類別過濾邏輯
  if (!category) {
    return allTasklist.value;
  } else {
    const filtered = {};
    if (allTasklist.value[category]) {
      if (status) {
        console.log('status:', status);
        const filteredTasks = {};
        Object.entries(allTasklist.value[category]).forEach(([date, tasks]) => {
          const filtered = tasks.filter(task => task.status === status);
          if (filtered.length > 0) {
            filteredTasks[date] = filtered;
          }
        });
        filtered[category] = filteredTasks;
      } else {
        filtered[category] = { ...allTasklist.value[category] };
      }
    }
    return filtered;
  }
});

console.log('filteredTasklist:',filteredTasklist.value)
</script>


<template>
  <h1 class="bhutuka-expanded-one-regular">
    <i class="fa-solid fa-folder-tree"></i> 
    {{ page }}
    <span v-if="date" class="date-label">
      {{ date }}
    </span>
  </h1>

  <div v-if="!plusStore.isOpen" class="describe">{{ t('task.new.clickHint') }}</div>
  <div class="float-plus-container" v-if="categoryName !== undefined">
    <div class="float float-plus2" @click="plusStore.toggleBars">
      <i class="my-float font-awesome-i fa-solid fa-plus"></i>
    </div>
    <TasksNew v-if="plusStore.isOpen"
      v-bind:page="categoryName"
      v-bind:categoryName="categoryName"
      v-bind:date="date"
    />
  </div>

  <div class="export-container">

    <div v-for="(dates, category, index) in filteredTasklist" :key="category">
      <div v-if="index !== 0" class="hr"></div>
      <router-link v-if="categoryName === undefined || date"
        :to="{ name: 'v2.category.tasks', params: { category: `${category}` } }" class="clean-link">
        <div class="export-category">
          <span>{{ category }}</span>
        </div>
      </router-link>

      

      <div class="export-category">
        
        <CategoryTaskCount 
          :category="category" 
          :date="date"
        />
        

        <div class="empty-message-container">
          <div v-if="props.status === 'normal' && normalTaskCount(category, date) === 0">
            <div class="empty-message">{{ t('task.empty.normal') }}</div>
          </div>
          <div v-if="props.status === 'urgent' && urgentTaskCount(category, date) === 0">
            <div class="empty-message">{{ t('task.empty.urgent') }}</div>
          </div>
          <div v-if="props.status === 'completed' && finishTaskCount(category, date) === 0">
            <div class="empty-message">{{ t('task.empty.completed') }}</div>
          </div>
        </div>
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

.date-label {
  font-size: 0.8em;
  color: var(--text-muted);
  margin-left: 10px;
}
.empty-message-container div{
  margin-top: 150px;
}
.float-plus-container{
  margin-bottom: 10px;
}
</style>