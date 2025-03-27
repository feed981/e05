<script setup>
import { useI18n } from 'vue-i18n'
import { useDataMenuStore } from '@/store/useStore';
import { useExport } from "@/composables/useExport.js";

const dataMenuStore = useDataMenuStore();
const { t, locale } = useI18n();

const {
    resetdata,
} = useExport();
</script>

<template>
    <div class="dropdown">
        <!-- 資料管理 -->
        <ul v-show="dataMenuStore.isOpen" class="dropdown-menu dropdown-menu-sub">
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