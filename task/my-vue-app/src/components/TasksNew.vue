<script setup>
import { ref } from "vue";
import { useTask } from "@/composables/useTask.js";
import { useCategory } from "@/composables/useCategory.js";
import { useDate } from "@/composables/useDate.js";
import { useI18n } from 'vue-i18n';
import Hint from '@/components/Hint.vue'

const { t } = useI18n();

const {
  categories,
} = useCategory();

const {
  task,
  selectedCategory,
  addTaskToCategory,
  isEdit,
  editTaskToCategory,
} = useTask();

const { 
  setDate,
} = useDate();

const props = defineProps({
  page: String,
  categoryName: String,
  date: String,
});

if(!isEdit.value){
  task.value.text = '';
  task.value.date = setDate();
  selectedCategory.value = '';
}

const isFromTaskListCondition = ref(false);

if(props.page){
  selectedCategory.value = props.categoryName;
  task.value.date = props.date;
  isFromTaskListCondition.value = true;
}

// console.log(
//   'selectedCategory.value:',props.categoryName,
//   'task.value.date:',props.date,
// )


</script>


<template>
  <h1 v-if="!categoryName" class="bhutuka-expanded-one-regular">
    <i class="fa-solid fa-rocket"></i> {{ t('task.new.title') }}
  </h1>
    <div class="describe" v-if="isEdit">{{ t('task.new.editHint') }}</div>
    <div class="describe" v-if="!isEdit && !isFromTaskListCondition">{{ t('task.new.newHint') }}</div>
  <Hint/>

  <div class="button-container">
    <div class="flex-container">
      <select
        :title="t('task.new.categoryPlaceholder')"
        class="category-select" 
        v-model="selectedCategory">
        <option v-if="!categoryName" value="">{{ t('task.new.category') }}</option>
        <option v-for="(categoryData, categoryKey) in categories" :key="categoryKey">
          {{ categoryData.info.name }}
        </option>
      </select>
    </div>
    
    <input :title="t('task.new.datePlaceholder')" class="date" type="date" v-model="task.date">
  </div>

  <div class="button-container">
    <textarea 
      v-model="task.text" 
      :placeholder="t('task.new.textPlaceholder')" 
      required
    ></textarea>
    <div class="task-menu">
      <i v-if="isEdit" 
         :title="t('task.new.editTooltip')" 
         @click="editTaskToCategory(task)" 
         class="fa-solid fa-pen-to-square"></i>
      <i v-if="!isEdit" 
         :title="t('task.new.addTooltip')" 
         @click="addTaskToCategory(task)" 
         class="fa-solid fa-paper-plane"></i>
    </div>
  </div>

</template>

<style scoped>
@import "../assets/styles/tasks2.css";
</style>
  