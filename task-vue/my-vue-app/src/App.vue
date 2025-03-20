<script setup>
import Header from '@/components/Header.vue'
import Float from './components/Float.vue'
import Footer from '@/components/Footer.vue'
import { useCategory } from "@/composables/useCategory.js";

const {
  refreshKey,
} = useCategory();

</script>

<template>
  <div class="app-container">
    <div class="task-container">
      <Header/>
      <Float/>
      <router-view :key="refreshKey"></router-view>
      <Footer/>
    </div>
  </div>
</template>

<style scoped>
</style>
