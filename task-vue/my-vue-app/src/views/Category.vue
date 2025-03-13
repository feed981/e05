<script setup>
import { useTask } from "@/composables/useTask.js";
import { useCategory } from "@/composables/useCategory.js";
import CategoryMenu from '@/components/CategoryMenu.vue'

const {
  newCategoryName,
  categories,
  createCategory,
} = useCategory();

const {
  allTaskCount,
  finishTaskCount,
  urgentTaskCount,
} = useTask();

</script>


<template>
    <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-icons"></i> new CATEGORY!</h1>
    <div class="export-container">
      <!-- <div v-if="this.selectedCategory" class="selected-category-sub">{{this.selectedCategory}} - sub</div> -->
      <div class="button-container">
        <!-- 先定义一个响应式变量来存储输入值 -->
        <input type="text" v-model="newCategoryName" placeholder="Enter a new category..." required>
        <div class="task-menu">
            <!-- 修复函数调用语法 -->
            <i title="As you see is add a new category!" @click="createCategory(newCategoryName)" class="font-awesome-i fa-solid fa-paper-plane"></i>
        </div>
      </div>
      <br>

      <div v-for="(categoryData, categoryKey) in categories" :key="categoryKey">
        <div class="category">
          <div class="category-name">
            <span class="title">{{ categoryData.info.name }}</span>
            <!-- <span class="title" title="Can gointo category task list!" @click="viewCategoryTasklist(category)">{{ category }}</span> -->
            <!-- <span class="icon" v-if="tasks.length === 0">(No tasks available.)</span> -->
            <!-- <span class="icon" v-else> -->
              <i title="This category task count!" class="font-awesome-i fa-solid fa-list-check"></i> : {{ allTaskCount(categoryData.info.name) }}
              　<i title="This category archive task count!" class="font-awesome-i fa-solid fa-flag-checkered"></i> : {{ finishTaskCount(categoryData.info.name) }} 
              　<i title="This category urgent task count!" class="font-awesome-i fa-solid fa-jug-detergent"></i> : {{ urgentTaskCount(categoryData.info.name) }} 
            <!-- </span> -->
          </div>
          <CategoryMenu v-bind:categoryName="categoryData.info.name" />

        </div>
      </div>
    </div>


</template>

<style scoped>
@import "../assets/styles/category.css";
</style>
  