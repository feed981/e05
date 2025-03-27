<script setup>
import { useCategoryMenuStore } from '@/store/useStore';
import { useCategory } from "@/composables/useCategory.js";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const menuStore = useCategoryMenuStore();

defineProps({
  categoryName: String,
  updatetime: Number,
});

const {
    setEditCategory,
    setCopyCategory,
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
                        <li @click="setCopyCategory(categoryName, updatetime)">
                            <i class="fa-solid fa-clone"></i>|　{{ t('category.copy') }}
                        </li>
                        <li @click="setEditCategory(categoryName, updatetime)">
                            <i class="fa-solid fa-pen-to-square"></i>|　{{ t('category.edit') }}
                        </li>
                        <li @click="clearCategoryTasks(categoryName, updatetime)">
                            <i class="fa-solid fa-toilet-paper"></i>|　{{ t('category.clear') }}
                        </li>
                        <li @click="removeCategory(categoryName, updatetime)">
                            <i class="fa-solid fa-trash"></i>|　{{ t('category.remove') }}
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