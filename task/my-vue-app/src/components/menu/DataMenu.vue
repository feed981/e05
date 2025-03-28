<script setup>
import { watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n'
import { useDataMenuStore, useUserStore } from '@/store/useStore';
import { useExport } from "@/composables/useExport.js";
import { useCategory } from "@/composables/useCategory.js";

const dataMenuStore = useDataMenuStore();
const { t, locale } = useI18n();

const {
    resetdata,
} = useExport();

const {
    saveCategories,
    loadCategories,
} = useCategory();

const userStore = useUserStore();

// 確保組件掛載時檢查認證狀態
onMounted(async () => {
  await userStore.restoreAuth();
});

// 監聽認證狀態變化
watch(() => userStore.isAuthenticated, (isAuth) => {
  console.log('Auth status:', isAuth);
});

</script>

<template>
    <div class="dropdown">
        <!-- 資料管理 -->
        <ul v-show="dataMenuStore.isOpen" class="dropdown-menu dropdown-menu-sub">
            <li v-if="userStore.isAuthenticated && userStore.user" @click="saveCategories">
                <i class="fa-solid fa-database"></i>|　{{ t('header.menu.database') }}
            </li>
            <li v-if="userStore.isAuthenticated && userStore.user" @click="loadCategories">
                <i class="fa-solid fa-window-restore"></i>|　{{ t('header.menu.restore') }}
            </li>
            <router-link :to="{ name: 'v2.import.json' }" class="clean-link">
                <li><i class="fa-solid fa-file-import"></i>|　{{ t('header.menu.import') }}</li>
            </router-link>
            <router-link :to="{ name: 'v2.export' }" class="clean-link">
                <li><i class="fa-solid fa-file-export"></i>|　{{ t('header.menu.export') }}</li>
            </router-link>
            <li @click="resetdata">
                <i class="fa-solid fa-toilet-paper"></i>|　{{ t('header.menu.clearData') }}
            </li>
            <li @click="dataMenuStore.toggleBars">
                <i class="fa-solid fa-xmark"></i>|　{{ t('header.menu.close', { section: t('header.sections.data') }) }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
@import "../../assets/styles/header.css";
</style>