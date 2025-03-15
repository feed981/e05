<script setup>
import { useTask } from "@/composables/useTask.js";
import { useCategory } from "@/composables/useCategory.js";
import { useDate } from "@/composables/useDate.js";

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

if(props.page){
  selectedCategory.value = props.categoryName;
  task.value.date = props.date;
}

// console.log(
//   'selectedCategory.value:',props.categoryName,
//   'task.value.date:',props.date,
// )

</script>


<template>
  <h1 v-if="!categoryName" class="bhutuka-expanded-one-regular"><i class="fa-solid fa-list-check"></i> new Task!</h1>

  <div class="button-container">

    <div class="flex-container">
      <select
        title="You can choose your category for your task, if you don't have one you should add a new category first!"
        class="category-select" v-model="selectedCategory">
        <option v-if="!categoryName" value="">Category</option>
        <option v-for="(categoryData, categoryKey) in categories" :key="categoryKey" :value="categoryKey">
          {{ categoryData.info.name }}
        </option>
      </select>
    </div>

    
    <input title="Must set a date for this task!" class="date" type="date" v-model="task.date">
  </div>

  <div class="button-container">

    <input title="Task content bro!" type="text" v-model="task.text" placeholder="Enter a task..." required>
    <div class="task-menu">
      <i v-if="isEdit" title="Edit this task content!" @click="editTaskToCategory(task)" class="font-awesome-i fa-solid fa-pen-to-square"></i>
      <i v-if="!isEdit" title="Let's do it bro!" @click="addTaskToCategory(task)" class="font-awesome-i fa-solid fa-paper-plane"></i>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/styles/tasks2.css";
</style>
  