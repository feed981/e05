<script setup>
import { useMuteStore } from '@/store/useStore';
const muteStore = useMuteStore();
</script>

<template>
    <div @click="muteStore.toggleSpeak" class="speak-float" :class="{ mute: !muteStore.isSpeakMute }"></div>
    <div @click="muteStore.toggleSound" class="sound-float" :class="{ mute: !muteStore.isSoundMute }"></div>
    <router-link to="/tasks/new">
        <div class="float">
            <i class="my-float font-awesome-i fa-solid fa-plus"></i>
        </div>
    </router-link>
</template>

<style scoped>
@import "../assets/styles/float.css";
</style>
  