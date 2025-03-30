<script setup>
import { useCategory } from "@/composables/useCategory.js";
import CategoryTaskCount from '@/components/CategoryTaskCount.vue'
import CategoryMenu from '@/components/CategoryMenu.vue'
import Hint from '@/components/Hint.vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();  

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



if(!isEdit.value){
  newCategoryName.value = '';
}

</script>


<template>
    <h1 class="bhutuka-expanded-one-regular">
      <i class="fa-solid fa-icons"></i> {{ t('category.title') }}
    </h1>
    <div class="export-container">

      <div class="describe" v-if="!isEdit && !isClone">
          {{ t('category.hints.create') }}
        </div> 
        <div class="describe" v-if="isEdit">
          {{ t('category.hints.edit') }}
        </div> 
        <div class="describe" v-if="isClone">
          {{ t('category.hints.clone') }}
        </div>
        <Hint/>

      <div class="button-container">
        <!-- 先定义一个响应式变量来存储输入值 -->
        <input 
          type="text" 
          v-model="newCategoryName" 
          :placeholder="t('category.input.placeholder')" 
          required
        >
        <div class="task-menu">
            <!-- 修复函数调用语法 -->
            <i v-if="isClone" 
               @click="copyCategory(categoryName, newCategoryName)" 
               class="fa-solid fa-clone"
               :title="t('category.actions.clone')"
            ></i>
            <i v-if="isEdit" 
               :title="t('category.actions.edit')" 
               @click="editCategory(categoryName, newCategoryName)" 
               class="fa-solid fa-pen-to-square"
            ></i>
            <i v-if="!isEdit && !isClone" 
               :title="t('category.actions.create')" 
               @click="createCategory(newCategoryName)" 
               class="fa-solid fa-paper-plane"
            ></i>
        </div>
      </div>
      <br>
      

      <div v-for="(categoryData, categoryKey) in categories" :key="categoryKey">
        <div class="category" >
        <!-- <div class="category" v-if="refreshKey"> -->
          <div class="category-name" >

            <router-link :to="{ name: 'v2.category.tasks', params: { category: `${categoryData.info.name}` } }" class="clean-link">
              <span class="title">{{ categoryData.info.name }}</span>
            </router-link>

            <CategoryTaskCount 
            :category="categoryData.info.name" 
          />

              <!-- <i :title="t('category.counts.tasks')" class="fa-solid fa-list-check"></i> : {{ allTaskCount(categoryData.info.name) }} -->
            <!-- 　<i :title="t('category.counts.completed')" class="fa-solid fa-font-awesome"></i> : {{ finishTaskCount(categoryData.info.name) }}  -->
            <!-- 　<i :title="t('category.counts.urgent')" class="fa-solid fa-thumbtack"></i> : {{ urgentTaskCount(categoryData.info.name) }}  -->
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
.describe{
  margin: 0px;
}

</style>
  