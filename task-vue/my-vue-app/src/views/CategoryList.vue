<script setup>
import { useTask } from "@/composables/useTask.js";
import { useCategory } from "@/composables/useCategory.js";
import CategoryNew from '@/components/CategoryNew.vue'
import CategoryMenu from '@/components/CategoryMenu.vue'

const {
  categories,
  // refreshKey,
} = useCategory();

const {
  allTaskCount,
  finishTaskCount,
  urgentTaskCount,
} = useTask();

</script>


<template>
    <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-icons"></i> All CategoryList!</h1>
    
    <div class="export-container">
      <CategoryNew/>
      
      <br>

      <div v-for="(categoryData, categoryKey) in categories" :key="categoryKey">
        <div class="category">
        <!-- <div class="category" :key="refreshKey"> -->
          <div class="category-name">
            <router-link :to="{ name: 'v2.category.tasks', params: { category: `${categoryData.info.name}` } }" class="clean-link">
              <span class="title">{{ categoryData.info.name }}</span>
            </router-link>
              <i title="This category task count!" class="font-awesome-i fa-solid fa-list-check"></i> : {{ allTaskCount(categoryData.info.name) }}
              　<i title="This category archive task count!" class="font-awesome-i fa-solid fa-flag-checkered"></i> : {{ finishTaskCount(categoryData.info.name) }} 
              　<i title="This category urgent task count!" class="font-awesome-i fa-solid fa-thumbtack"></i> : {{ urgentTaskCount(categoryData.info.name) }} 
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
  