<script setup>
import { useMuteStore } from '@/store/useStore';
import { useCommon } from "@/composables/useCommon.js";
import { useRouter } from 'vue-router';

const muteStore = useMuteStore();
const { 
  hiddenPlus,
  hiddenPrepage,
} = useCommon();

const router = useRouter();

const goBack = () => {
    if (window.history.length > 2) {
        router.go(-1);
    } else {
        // 如果沒有上一頁，則返回首頁
        router.push({ name: 'v2.home' });
    }
};
</script>

<template>
    <div @click="muteStore.toggleSpeak" class="float-speak" :class="{ mute: !muteStore.isSpeakMute }"></div>
    <div @click="muteStore.toggleSound" class="float-sound" :class="{ mute: !muteStore.isSoundMute }"></div>
    <div class="float float-prepage"  @click="goBack">
        <i class="my-float font-awesome-i fa-solid fa-arrow-left"></i>
    </div>
    <router-link :to="{ name: 'v2.tasks.new' }" v-show="hiddenPlus">
        <div class="float float-plus2">
            <i class="my-float font-awesome-i fa-solid fa-plus"></i>
        </div>
    </router-link>
</template>

<style scoped>
@import "../assets/styles/float.css";
</style>

  