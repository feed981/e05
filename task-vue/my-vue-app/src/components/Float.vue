<script setup>
import Header from '../components/Header.vue'
import { useMuteStore } from '@/store/useStore';
import { useCommon } from "@/composables/useCommon.js";
const muteStore = useMuteStore();
const { 
  hiddenPlus,
  hiddenPrepage,
} = useCommon();

</script>

<template>
    <Header/>
    <div @click="muteStore.toggleSpeak" class="float-speak" :class="{ mute: !muteStore.isSpeakMute }"></div>
    <div @click="muteStore.toggleSound" class="float-sound" :class="{ mute: !muteStore.isSoundMute }"></div>
    <router-link :to="{ name: 'v2.home' }" v-show="hiddenPrepage">
        <div class="float float-prepage">
            <i class="my-float font-awesome-i fa-solid fa-arrow-left"></i>
        </div>
    </router-link>
    <router-link :to="{ name: 'v2.tasks.new' }" v-show="hiddenPlus">
        <div class="float float-plus2">
            <i class="my-float font-awesome-i fa-solid fa-plus"></i>
        </div>
    </router-link>
</template>

<style scoped>
@import "../assets/styles/float.css";
</style>

  