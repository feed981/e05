<script setup>
import Header from '../components/Header.vue'
import { useMuteStore } from '@/store/useStore';
const muteStore = useMuteStore();
</script>

<template>
    <Header/>
    <div @click="muteStore.toggleSpeak" class="float-speak" :class="{ mute: !muteStore.isSpeakMute }"></div>
    <div @click="muteStore.toggleSound" class="float-sound" :class="{ mute: !muteStore.isSoundMute }"></div>
    <router-link to="/">
        <div class="float float-prepage">
            <i class="my-float font-awesome-i fa-solid fa-arrow-left"></i>
        </div>
    </router-link>
    <router-link to="/tasks/new">
        <div class="float float-plus">
            <i class="my-float font-awesome-i fa-solid fa-plus"></i>
        </div>
    </router-link>
</template>

<style scoped>
@import "../assets/styles/float.css";
</style>
  