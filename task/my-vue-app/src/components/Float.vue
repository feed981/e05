<script setup>
import { useMuteStore } from '@/store/useStore';
import { useCommon } from "@/composables/useCommon.js";

const muteStore = useMuteStore();
const { 
  goBack
} = useCommon();


</script>

<template>
    <div @click="muteStore.toggleSpeak" class="float-speak" :class="{ mute: !muteStore.isSpeakMute }"></div>
    <div @click="muteStore.toggleSound" class="float-sound" :class="{ mute: !muteStore.isSoundMute }"></div>
    <div class="float float-prepage"  @click="goBack">
        <i class="my-float font-awesome-i fa-solid fa-arrow-left"></i>
    </div>
</template>

<style scoped>
@import "../assets/styles/float.css";
</style>

  