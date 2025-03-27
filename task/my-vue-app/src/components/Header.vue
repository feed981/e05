<script setup>
import { useMenuStore, 
    useCoreMenuStore, 
    useDataMenuStore, 
    useSettingsMenuStore, 
    useNavigationMenuStore
} from '@/store/useStore';

import { useI18n } from 'vue-i18n';
import CoreMenu from '@/components/menu/CoreMenu.vue'
import DataMenu from '@/components/menu/DataMenu.vue'
import SettingsMenu from '@/components/menu/SettingsMenu.vue'
import NavigationMenu from '@/components/menu/NavigationMenu.vue'

const { t } = useI18n();
const menuStore = useMenuStore();
const coreMenuStore = useCoreMenuStore();
const dataMenuStore = useDataMenuStore();
const settingsMenuStore = useSettingsMenuStore();
const navigationMenuStore = useNavigationMenuStore();

</script>

<template>
    <div class="float float-bars">
        <div class="header-container">
            <div class="hamburger">
                <div class="dropdown">
                    <svg @click="menuStore.toggleBars"
                    class="vbp-header-menu-button__svg" :class="{ 'header-opend': menuStore.isOpen }">
                        <line x1="0" y1="50%" x2="100%" y2="50%" class="top" shape-rendering="crispEdges" />
                        <line x1="0" y1="50%" x2="100%" y2="50%" class="middle" shape-rendering="crispEdges" />
                        <line x1="0" y1="50%" x2="100%" y2="50%" class="bottom" shape-rendering="crispEdges" />
                    </svg>
                    <ul v-show="menuStore.isOpen" class="dropdown-menu bars">
                        <li @click="settingsMenuStore.toggleBars"><i class="fa-solid fa-gear"></i>|　{{ t('header.sections.settings') }}</li>
                        <SettingsMenu />
                        <li @click="coreMenuStore.toggleBars"><i class="fa-brands fa-creative-commons-zero"></i>|　{{ t('header.sections.core') }}</li>
                        <CoreMenu />
                        <li @click="dataMenuStore.toggleBars"><i class="fa-solid fa-database"></i>|　{{ t('header.sections.data') }}</li>
                        <DataMenu />
                        <li @click="navigationMenuStore.toggleBars"><i class="fa-solid fa-location-crosshairs"></i>|　{{ t('header.sections.navigation') }}</li>
                        <NavigationMenu />
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "../assets/styles/header.css";
</style>