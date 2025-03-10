<script setup>
import { useMenuStore, useLightStore, useExportMenuStore } from '@/store/useStore';
import { useExport } from "@/composables/useExport.js";

const menuStore = useMenuStore();
const lightStore = useLightStore();
const exportMenuStore = useExportMenuStore();

const {
    viewAs,
    exportAs,   
    resetdata,
} = useExport();
</script>

<template>
    <div @click="menuStore.toggleBars" class="float float-bars">
        <div class="header-container" >
            <div class="hamburger">
                <div class="dropdown">
                    <svg class="vbp-header-menu-button__svg" :class="{ 'header-opend': menuStore.isOpen }">
                        <line x1="0" y1="50%" x2="100%" y2="50%" class="top" shape-rendering="crispEdges" />
                        <line x1="0" y1="50%" x2="100%" y2="50%" class="middle" shape-rendering="crispEdges" />
                        <line x1="0" y1="50%" x2="100%" y2="50%" class="bottom" shape-rendering="crispEdges" />
                    </svg>
                    <ul v-show="menuStore.isOpen" class="dropdown-menu bars">
                        <router-link to="/qrcode">
                            <li>
                                <i class="font-awesome-i fa-solid fa-qrcode"></i>|　QR-Code
                            </li>
                        </router-link>
                        <li @click="lightStore.toggleBars">
                            <i class="font-awesome-i fa-solid" :class="{ 'fa-toggle-on': lightStore.isOpen, 'fa-toggle-off': !lightStore.isOpen }"></i>{{ lightStore.isOpen ? '|　Toggle dark-mode' : '|　Toggle light-mode' }}
                        </li>
                        <router-link to="/feedback">
                            <li>
                                <i class="font-awesome-i fa-solid fa-envelope"></i>|　Feedback
                            </li>
                        </router-link>
                        <!-- todo: close other div-->
                        <li @click="resetdata">
                            <i class="font-awesome-i fa-solid fa-toilet-paper"></i><span>|　Clear all data</span>
                        </li>
                        <li class="dropdown" @click="exportMenuStore.toggleBars">
                            <i class="font-awesome-i fa-solid fa-file-export"></i><span>|　View / Import / Export</span>
                            <ul v-show="exportMenuStore.isOpen" class="dropdown-menu dropdown-menu-sub">
                            <li @click="viewAs('json')"><i class="font-awesome-i fa-solid fa-eye"></i>|　View as JSON</li>
                            <li @click="viewAs('html')"><i class="font-awesome-i fa-solid fa-eye"></i>|　View as HTML</li>
                            <router-link to="/import/as/json">
                                <li><i class="font-awesome-i fa-solid fa-file-import"></i>|　Import as JSON</li>
                            </router-link>
                            <li @click="exportAs('json')"><i class="font-awesome-i fa-solid fa-file-export"></i>|　Export as JSON</li>
                            <li @click="exportAs('html')"><i class="font-awesome-i fa-solid fa-file-export"></i>|　Export as HTML</li>
                            <li @click="exportmenuStore.toggleBars"><i class="font-awesome-i fa-solid fa-xmark"></i>|　Close the menu</li>
                            </ul>
                        </li>
                        <router-link to="/category/list">
                            <li><i class="font-awesome-i fa-solid fa-icons"></i>|　Add new category</li>
                        </router-link>
                        <router-link to="/tasks/new">
                            <li><i class="font-awesome-i fa-solid fa-list-check"></i>|　Add new task</li>
                        </router-link>
                        <router-link to="/">
                            <li><i class="font-awesome-i fa-solid fa-arrow-left"></i>|　Pre page</li>
                        </router-link>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "../assets/styles/header.css";
</style>
  