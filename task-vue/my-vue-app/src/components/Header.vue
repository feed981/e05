<script setup>
import { useBarStore } from '@/store/useStore';
const barStore = useBarStore();
</script>

<template>
    <div class="header-container">
        <div class="hamburger">
        <div class="dropdown">
            <svg class="vbp-header-menu-button__svg" @click="barStore.toggleBars" :class="{ 'header-opend': barStore.isBarOpen }">
                <line x1="0" y1="50%" x2="100%" y2="50%" class="top" shape-rendering="crispEdges" />
                <line x1="0" y1="50%" x2="100%" y2="50%" class="middle" shape-rendering="crispEdges" />
                <line x1="0" y1="50%" x2="100%" y2="50%" class="bottom" shape-rendering="crispEdges" />
            </svg>
            <ul v-show="barStore.isBarOpen" class="dropdown-menu bars">
                <router-link to="/qrcode">
                    <li>
                        <i class="font-awesome-i fa-solid fa-qrcode"></i>|　QR-Code
                    </li>
                </router-link>
                <li v-if="isLight" @click="toggleLight(fasle)">
                    <i class="font-awesome-i fa-solid fa-toggle-on"></i><span>|　Toggle dark-mode</span>
                </li>
                <li v-if="!isLight" @click="toggleLight(true)">
                    <i class="font-awesome-i fa-solid fa-toggle-off"></i><span>|　Toggle light-mode</span>
                </li>
                <router-link to="/feedback">
                    <li>
                        <i class="font-awesome-i fa-solid fa-envelope"></i>|　Feedback
                    </li>
                </router-link>
                <!-- todo: close other div-->
                <li v-if="!isSendEmail" @click="resetdata()">
                    <i class="font-awesome-i fa-solid fa-toilet-paper"></i><span>|　Clear all data</span>
                </li>
                <li v-if="!isSendEmail" class="dropdown" @click="toggleDropdown">
                    <i class="font-awesome-i fa-solid fa-file-export"></i><span>|　View / Import / Export</span>
                    <ul v-show="dropdownviewExport" class="dropdown-menu dropdown-menu-sub">
                    <li @click="viewAs('json')"><i class="font-awesome-i fa-solid fa-eye"></i>|　View as JSON</li>
                    <li @click="viewAs('html')"><i class="font-awesome-i fa-solid fa-eye"></i>|　View as HTML</li>
                    <router-link to="/import/as/json">
                        <li><i class="font-awesome-i fa-solid fa-file-import"></i>|　Import as JSON</li>
                    </router-link>
                    <li @click="exportAs('json')"><i class="font-awesome-i fa-solid fa-file-export"></i>|　Export as JSON</li>
                    <li @click="exportAs('html')"><i class="font-awesome-i fa-solid fa-file-export"></i>|　Export as HTML</li>
                    <li @click="dropdownviewExport = true"><i class="font-awesome-i fa-solid fa-xmark"></i>|　Close the menu</li>
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
        <router-link to="/">
            <div title="Close this page and go back to alltasklist!" class="closeicon">
                <i class="font-awesome-i fa-regular fa-circle-xmark"></i>
            </div>
        </router-link>
    </div>
</template>

<style scoped>
@import "../assets/styles/header.css";
</style>
  