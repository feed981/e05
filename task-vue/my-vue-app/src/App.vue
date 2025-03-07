<script setup>
import Header from './components/Header.vue'
import Float from './components/Float.vue'
</script>

<template>
  <div class="app-container">
    <div class="task-container">
      <Header/>
      <Float/>
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
</style>
