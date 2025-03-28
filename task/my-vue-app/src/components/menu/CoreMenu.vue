<script setup>
import { useI18n } from 'vue-i18n'
import { useCoreMenuStore } from '@/store/useStore';
const coreMenuStore = useCoreMenuStore();
const { t, locale } = useI18n();
</script>

<template>
    <div class="dropdown">
        <!-- 核心功能 -->
        <ul v-show="coreMenuStore.isOpen" class="dropdown-menu dropdown-menu-sub">
            <router-link :to="{ name: 'v2.home' }" class="clean-link">
                <li><i class="fa-solid fa-folder-tree"></i>|　{{ t('header.menu.list') }}</li>
            </router-link>
            <router-link :to="{ name: 'v2.calendar' }" class="clean-link">
                <li><i class="fa-solid fa-calendar"></i>|　{{ t('calendar.title') }}</li>
            </router-link>
            <router-link :to="{ name: 'v2.category.list' }" class="clean-link">
                <li><i class="fa-solid fa-icons"></i>|　{{ t('header.menu.addCategory') }}</li>
            </router-link>
            <router-link :to="{ name: 'v2.tasks.new' }" class="clean-link">
                <li><i class="fa-solid fa-rocket"></i>|　{{ t('header.menu.addTask') }}</li>
            </router-link>
            <li @click="coreMenuStore.toggleBars">
                <i class="fa-solid fa-xmark"></i>|　{{ t('header.menu.close', { section: t('header.sections.core') }) }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
@import "../../assets/styles/header.css";
</style>