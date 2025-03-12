<script setup>
import { useTask } from "@/composables/useTask.js";

const {
  taskList,
  newTask,
  selectedCategory,
  addTask,
  editTask,
} = useTask();

</script>


<template>
  <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-list-check"></i> new Task!</h1>

  <div class="button-container">

    <div class="flex-container">
      <select
        title="You can choose your category for your task, if you don't have one you should add a new category first!"
        class="category-select" v-model="selectedCategory" :key="categoryKey">
        <option value="">category</option>
        <option v-for="(tasks, category) in taskList" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    
    <input title="Must set a date for this task!" class="date" type="date" v-model="newTask.date">
  </div>

  <div class="button-container">

    <input title="Task content bro!" type="text" v-model="newTask.text" placeholder="Enter a task..." required>
    <div class="task-menu">

      <!-- <i v-if="isEdit" title="Edit this task content!" @click="editTask"
        class="font-awesome-i fa-solid fa-pen-to-square"></i> -->
      <i v-if="!isEdit" title="Let's do it bro!" @click="addTask"
        class="font-awesome-i fa-solid fa-paper-plane"></i>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/styles/tasks2.css";
</style>
  