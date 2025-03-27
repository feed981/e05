<script setup>
import { useI18n } from 'vue-i18n'
import { useLanguageMenuStore } from '@/store/useStore';

const languageMenuStore = useLanguageMenuStore();
const { t, locale } = useI18n();
</script>

<template>
    <div class="dropdown">
        <ul v-show="languageMenuStore.isOpen" class="dropdown-menu dropdown-menu-sub">
            <li @click="locale = 'zh'">zh　|　{{ t('language.zh') }}</li>
            <li @click="locale = 'en'">en　|　{{ t('language.en') }}</li>
            <li @click="languageMenuStore.toggleBars">
                <i class="fa-solid fa-xmark"></i>|　{{ t('header.menu.close', { section: t('header.sections.language') }) }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
@import "../../assets/styles/header.css";
</style>