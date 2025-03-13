<script setup>
import TaskList from '@/components/TaskList.vue'
import { useRoute } from 'vue-router';

const route = useRoute();

</script>

<template>
  <TaskList v-bind:page="route.params.category" v-bind:categoryName="route.params.category" />
</template>

<style scoped>
@import "../assets/styles/export.css";
</style>
  