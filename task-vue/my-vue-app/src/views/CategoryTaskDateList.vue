<script setup>
import TaskListDate from '@/components/TaskListCondition.vue'
import { useRoute } from 'vue-router';

const route = useRoute();

</script>

<template>
  <TaskListDate 
    v-bind:page="route.params.category" 
    v-bind:categoryName="route.params.category" 
    v-bind:date="route.params.date" 
    v-bind:status="route.params.status" 
  />
</template>

<style scoped>
@import "../assets/styles/export.css";
</style>