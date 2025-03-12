<script setup>
import { useTask } from "@/composables/useTask.js";
import { useCategory } from "@/composables/useCategory.js";

const {
  taskList,
  allTaskCount,
  finishTaskCount,
  urgentTaskCount,
  allTasklist
} = useTask();

console.log(allTasklist.value)

const {
  newCategory,
  saveCategory,
} = useCategory();

</script>


<template>
    <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-icons"></i> new CATEGORY!</h1>
    <div class="export-container">
      <!-- <div v-if="this.selectedCategory" class="selected-category-sub">{{this.selectedCategory}} - sub</div> -->
      <div class="button-container">
      <input type="text" v-model="newCategory" placeholder="Enter a new category..." required>
      <div class="task-menu">
          <i title="As you see is add a new category!" @click="saveCategory" class="font-awesome-i fa-solid fa-paper-plane"></i>
      </div>
      </div>
      <br>

      <div v-for="(tasks, category) in taskList" :key="category">
          <div class="category" :key="categoryKey">
            <div class="category-name">
                <span class="title" title="Can gointo category task list!" @click="viewCategoryTasklist(category)">{{ category }}</span>
                <!-- <span class="icon" v-if="tasks.length === 0">(No tasks available.)</span> -->
                <!-- <span class="icon" v-else> -->
                <i title="This category task count!" class="font-awesome-i fa-solid fa-list-check"></i> : {{ allTaskCount(category) }}
                , <i title="This category archive task count!" class="font-awesome-i fa-solid fa-flag-checkered"></i> : {{ finishTaskCount(category) }} 
                , <i title="This category urgent task count!" class="font-awesome-i fa-solid fa-jug-detergent"></i> : {{ urgentTaskCount(category) }}
              <!-- </span> -->
            </div>
          </div>
      </div>
    </div>


</template>

<style scoped>
@import "../assets/styles/category.css";
</style>
  