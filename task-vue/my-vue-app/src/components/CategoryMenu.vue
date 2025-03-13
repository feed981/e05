<script setup>
import { useCategoryMenuStore } from '@/store/useStore';

const menuStore = useCategoryMenuStore();

defineProps({
  categoryName: String
});

</script>

<template>
    <div @click="menuStore.toggleBars(categoryName)" class="float float-categoryMenu">
        <div class="header-container" >
            <div class="hamburger">
                <div class="dropdown">
                    <i class="fa-solid fa-caret-down"></i>
                    <ul v-if="menuStore.expandedCategories[categoryName]" class="dropdown-menu bars">
                        <li @click="editCategory(categoryName)">
                            <i class="font-awesome-i fa-solid fa-pen-to-square"></i><span>|　Edit category</span>
                        </li>
                        <li @click="removeCategory(categoryName)">
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