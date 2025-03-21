<script setup>
import { useTask } from "@/composables/useTask.js";
import { useCategory } from "@/composables/useCategory.js";
// import CategoryNew from '@/components/CategoryNew.vue'
import CategoryMenu from '@/components/CategoryMenu.vue'

const {
  categories,
  categoryName,
  newCategoryName,
  createCategory,
  isEdit,
  isClone,
  editCategory,
  copyCategory,
} = useCategory();

const {
  allTaskCount,
  finishTaskCount,
  urgentTaskCount,
} = useTask();

if(!isEdit.value){
  newCategoryName.value = '';
}

</script>


<template>
    <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-icons"></i> All CategoryList!</h1>
    
    <div class="export-container">
      
      <div class="button-container">
        <!-- 先定义一个响应式变量来存储输入值 -->
        <input type="text" v-model="newCategoryName" placeholder="Enter a new category..." required>
        <div class="task-menu">
            <!-- 修复函数调用语法 -->
            <i v-if="isClone" @click="copyCategory(categoryName, newCategoryName)" class="fa-solid fa-clone"></i>
            <i v-if="isEdit" title="As you see is add a new category!" @click="editCategory(categoryName, newCategoryName)" class="fa-solid fa-pen-to-square"></i>
            <i v-if="!isEdit && !isClone" title="As you see is add a new category!" @click="createCategory(newCategoryName)" class="fa-solid fa-paper-plane"></i>
        </div>
      </div>
      <div class="describe" v-if="!isEdit && !isClone">You can create a new category here.</div> 
      <div class="describe" v-if="isEdit">You can edit this category name.</div> 
      <div class="describe" v-if="isClone">You can clone all tasks from an existing category to a new category, but please note that category names cannot be duplicated.</div>
      <div class="describe common-describe" v-if="isHint">if you do not need to perform this action, 
        you can click <router-link :to="{ name: 'v2.home' }" class="clean-link" >home</router-link>
        or the icon in the top right corner <i class="fa-solid fa-arrow-left"></i> to return to the homepage.</div>

      <div v-for="(categoryData, categoryKey) in categories" :key="categoryKey">
        <div class="category" >
        <!-- <div class="category" v-if="refreshKey"> -->
          <div class="category-name" >
            <router-link :to="{ name: 'v2.category.tasks', params: { category: `${categoryData.info.name}` } }" class="clean-link">
              <span class="title">{{ categoryData.info.name }}</span>
            </router-link>
              <i title="This category task count!" class="fa-solid fa-list-check"></i> : {{ allTaskCount(categoryData.info.name) }}
              　<i title="This category archive task count!" class="fa-solid fa-flag-checkered"></i> : {{ finishTaskCount(categoryData.info.name) }} 
              　<i title="This category urgent task count!" class="fa-solid fa-thumbtack"></i> : {{ urgentTaskCount(categoryData.info.name) }} 
          </div>
          <CategoryMenu 
            v-bind:categoryName="categoryData.info.name" 
            v-bind:updatetime="categoryData.info.updatetime"
          />

        </div>
      </div>
    </div>


</template>

<style scoped>
@import "../assets/styles/category.css";
</style>
  