<script setup>
import { useI18n } from 'vue-i18n'
import { useNavigationMenuStore, useMenuStore } from '@/store/useStore';
import { useCommon } from "@/composables/useCommon.js";

const navigationMenuStore = useNavigationMenuStore();
const { t, locale } = useI18n();
const { hiddenPrepage } = useCommon();  
const menuStore = useMenuStore();
</script>

<template>
    <div class="dropdown">
        <!-- 核心功能 -->
        <ul v-show="navigationMenuStore.isOpen" class="dropdown-menu dropdown-menu-sub">
            <router-link :to="{ name: 'v2.home' }" class="clean-link" v-show="hiddenPrepage">
                <li><i class="fa-solid fa-arrow-left"></i>|　{{ t('header.menu.prePage') }}</li>
            </router-link>
            <li @click="menuStore.toggleBars">
                <i class="fa-solid fa-xmark"></i>|　{{ t('header.menu.close', { section: t('header.sections.navigation') }) }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
@import "../../assets/styles/header.css";
</style>