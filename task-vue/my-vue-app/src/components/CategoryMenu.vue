<script setup>
import { useCategoryMenuStore } from '@/store/useStore';
import { useCategory } from "@/composables/useCategory.js";

const menuStore = useCategoryMenuStore();

defineProps({
  categoryName: String,
  updatetime: Number,
});

const {
    setEditCategory,
    clearCategoryTasks,
    removeCategory,
} = useCategory();


</script>

<template>
    <div @click="menuStore.toggleBars(categoryName)" class="float2 float-categoryMenu">
        <div class="header-container" >
            <div class="hamburger">
                <div class="dropdown">
                    <i class="fa-solid fa-caret-down"></i>
                    <ul v-if="menuStore.expandedCategories[categoryName]" class="dropdown-menu bars">
                        <li @click="setEditCategory(categoryName, updatetime)">
                            <i class="font-awesome-i fa-solid fa-pen-to-square"></i><span>|　Edit category</span>
                        </li>
                        <li @click="clearCategoryTasks(categoryName, updatetime)">
                            <i class="font-awesome-i fa-solid fa-toilet-paper"></i><span>|　Clear category tasks</span>
                        </li>
                        <li @click="removeCategory(categoryName, updatetime)">
                            <i class="font-awesome-i fa-solid fa-trash"></i><span>|　Remove category</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "../assets/styles/header.css";
@import "../assets/styles/categoryMenu.css";

</style>