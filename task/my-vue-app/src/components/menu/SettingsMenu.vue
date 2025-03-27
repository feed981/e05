<script setup>
import { useI18n } from 'vue-i18n'
import { useSettingsMenuStore, useLightStore, useLanguageMenuStore } from '@/store/useStore';
import LanguageSwitcher from '@/components/menu/LanguageSwitcher.vue';

const lightStore = useLightStore();
const settingsMenuStore = useSettingsMenuStore();
const languageMenuStore = useLanguageMenuStore();
const { t, locale } = useI18n();
</script>

<template>
    <div class="dropdown">
        <!-- 設定 -->
        <ul v-show="settingsMenuStore.isOpen" class="dropdown-menu dropdown-menu-sub">
            <router-link :to="{ name: 'v2.login' }" class="clean-link">
                <li><i class="fa-solid fa-arrow-right-to-bracket"></i>|　{{ t('header.menu.login') }}</li>
            </router-link>
            <li @click="languageMenuStore.toggleBars">
                <i class="fa-solid fa-language"></i>|　{{ t('header.menu.language') }}
            </li>
            <LanguageSwitcher/>
            <li @click="lightStore.toggleBars">
                <i class="fa-solid" :class="{ 'fa-toggle-on': lightStore.isOpen, 'fa-toggle-off': !lightStore.isOpen }"></i>|　{{ lightStore.isOpen ? t('header.menu.darkMode') : t('header.menu.lightMode') }}
            </li>
            <router-link :to="{ name: 'v2.qrcode' }" class="clean-link">
                <li><i class="fa-solid fa-qrcode"></i>|　{{ t('header.menu.qrcode') }}</li>
            </router-link>
            <router-link :to="{ name: 'v2.feedback' }" class="clean-link">
                <li><i class="fa-solid fa-envelope"></i>|　{{ t('header.menu.feedback') }}</li>
            </router-link>
            <li @click="settingsMenuStore.toggleBars">
                <i class="fa-solid fa-xmark"></i>|　    {{ t('header.menu.close', { section: t('header.sections.settings') }) }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
@import "../../assets/styles/header.css";
</style>