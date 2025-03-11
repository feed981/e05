<script setup>
import { useTask } from "@/composables/useTask.js";
import { useCategory } from "@/composables/useCategory.js";

const {
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
    <!-- <div v-if="this.selectedCategory" class="selected-category-sub">{{this.selectedCategory}} - sub</div> -->
    <div class="button-container">
    <input type="text" v-model="newCategory" placeholder="Enter a new category..." required>
    <div class="task-menu">
        <i title="As you see is add a new category!" @click="saveCategory" class="font-awesome-i fa-solid fa-paper-plane"></i>
    </div>
    </div>
    <br>

    <div class="export-container">
      <div v-for="(dates, category, index) in allTasklist" :key="category"> 
        <div class="export-category">
          <span>{{ category }}</span>
        </div>
        <div class="export-category">
          <i title="This category task count!" class="font-awesome-i fa-solid fa-list-check"></i> : {{ allTaskCount(category) }}
          , <i title="This category archive task count!" class="font-awesome-i fa-solid fa-flag-checkered"></i> : {{ finishTaskCount(category) }} 
          , <i title="This category urgent task count!" class="font-awesome-i fa-solid fa-jug-detergent"></i> : {{ urgentTaskCount(category) }}
        </div>
        <div v-if="index !== 0" class="hr"></div>
      </div>
    </div>


</template>

<style>
.export-category{
  display: flex;
}
.export-category span{
  white-space: pre-wrap;
    word-wrap: break-word;
}
</style>