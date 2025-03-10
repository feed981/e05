<script setup>
import Float from './components/Float.vue'
</script>

<template>
  <div class="app-container">
    <div class="task-container">
      <Float/>
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
</style>
