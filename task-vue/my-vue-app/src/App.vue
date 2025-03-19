<script setup>
import Float from './components/Float.vue'
import { useCategory } from "@/composables/useCategory.js";

const {
  refreshKey,
} = useCategory();

</script>

<template>
  <div class="app-container">
    <div class="task-container">
      <Float/>
      <router-view :key="refreshKey"></router-view>
    </div>
  </div>
</template>

<style scoped>
</style>
