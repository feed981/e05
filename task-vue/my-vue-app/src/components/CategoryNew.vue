<script setup>
import { useCategory } from "@/composables/useCategory.js";

const {
  categoryName,
  newCategoryName,
  createCategory,
  isEdit,
  editCategory,
} = useCategory();

</script>

<template>
    <div class="button-container">
        <!-- 先定义一个响应式变量来存储输入值 -->
        <input type="text" v-model="newCategoryName" placeholder="Enter a new category..." required>
        <div class="task-menu">
            <!-- 修复函数调用语法 -->
            <i v-if="!isEdit" title="As you see is add a new category!" @click="createCategory(newCategoryName)" class="font-awesome-i fa-solid fa-paper-plane"></i>
            <i v-if="isEdit" title="As you see is add a new category!" @click="editCategory(categoryName, newCategoryName)" class="font-awesome-i fa-solid fa-pen-to-square"></i>
        </div>
      </div>
</template>

<style scoped>
@import "../assets/styles/category.css";
</style>
  