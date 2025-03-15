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
        
      <div class="flex-container">
        
        <div class="form">
          <div class="seleet-container">

          <select title="You can choose your category for your task, if you don't have one you should add a new category first!" v-model="selectedCategory">
            <option v-for="(tasks, category) in taskList" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <div>　　　</div>
          <input title="Must set a date for this task!"  class="date" type="date" v-model="newTask.date">
          
        </div>
          
          <div class="addtaskicon" @click="addTask">+</div>
          <!-- <i title="Let's do it bro!" @click="addTask" class="font-awesome-i fa-solid fa-paper-plane"></i> -->
          <!-- <i title="Edit this task content!" @click="editTask" class="font-awesome-i fa-solid fa-pen-to-square"></i> -->
          
          <input title="Task content bro!" type="text" v-model="newTask.text" placeholder="Enter a task..." required>

        </div>

      </div>
</template>

<style scoped>
@import "../assets/styles/tasks.css";
</style>
  