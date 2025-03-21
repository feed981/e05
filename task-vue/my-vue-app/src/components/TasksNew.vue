<script setup>
import { ref } from "vue";
import { useTask } from "@/composables/useTask.js";
import { useCategory } from "@/composables/useCategory.js";
import { useDate } from "@/composables/useDate.js";
import { useHintStore } from '@/store/useStore';

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


const hideStore = useHintStore();
</script>


<template>
  <h1 v-if="!categoryName" class="bhutuka-expanded-one-regular"><i class="fa-solid fa-list-check"></i> new Task!</h1>

  <div class="button-container">

    <div class="flex-container">
      <select
        title="You can choose your category for your task, if you don't have one you should add a new category first!"
        class="category-select" v-model="selectedCategory">
        <option v-if="!categoryName" value="">Category</option>
        <option v-for="(categoryData, categoryKey) in categories" :key="categoryKey">
          {{ categoryData.info.name }}
        </option>
      </select>
    </div>

    
    <input title="Must set a date for this task!" class="date" type="date" v-model="task.date">
  </div>

  <div class="button-container">

    <input title="Task content bro!" type="text" v-model="task.text" placeholder="Enter a task..." required>
    <div class="task-menu">
      <i v-if="isEdit" title="Edit this task content!" @click="editTaskToCategory(task)" class="fa-solid fa-pen-to-square"></i>
      <i v-if="!isEdit" title="Let's do it bro!" @click="addTaskToCategory(task)" class="fa-solid fa-paper-plane"></i>
    </div>
  </div>
  <div class="describe" v-if="isEdit">You can select a new category or choose the task time or edit the task content.</div>
  <div class="describe" v-if="!isEdit && !isFromTaskListCondition">First, you must select a category, then choose the task time, and enter the task content.</div>
  <div class="describe common-describe" v-if="hideStore.isOpen">if you do not need to perform this action, 
        you can click <router-link :to="{ name: 'v2.home' }" class="clean-link" >home</router-link>
        or the icon in the top right corner <i class="fa-solid fa-arrow-left"></i> to return to the homepage.</div>

</template>

<style scoped>
@import "../assets/styles/tasks2.css";
</style>
  