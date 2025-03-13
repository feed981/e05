<script setup>
import TaskList from '@/components/TaskList.vue'
</script>

<template>
  <TaskList 
    v-bind:page="'All Tasklist!'" 
    v-bind:categoryName="''" 
  />
</template>

<style scoped>
@import "../assets/styles/export.css";
</style>
  