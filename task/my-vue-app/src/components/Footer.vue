<script setup>
import { useCommon } from "@/composables/useCommon.js";
import { useHintStore, useUserStore } from '@/store/useStore';
import { onMounted, ref, watch } from 'vue';

const { 
  hiddenFooter,
  hiddenHint,
} = useCommon();

const hideStore = useHintStore();
const userStore = useUserStore();

// 確保組件掛載時檢查認證狀態
onMounted(async () => {
  await userStore.restoreAuth();
});

// 監聽認證狀態變化
watch(() => userStore.isAuthenticated, (isAuth) => {
  console.log('Auth status:', isAuth);
});

</script>

<template>
    <div class="footer">
        <router-link :to="{ name: 'v2.home' }" class="clean-link">
            <i class="fa-solid fa-folder-tree"></i>
        </router-link>
        <router-link :to="{ name: 'v2.calendar' }" class="clean-link">
          <i class="fa-solid fa-calendar"></i>
        </router-link>
        <router-link :to="{ name: 'v2.category.list' }" v-show="hiddenFooter" class="clean-link">
            <i class="fa-solid fa-icons"></i>
        </router-link>
        <router-link :to="{ name: 'v2.tasks.new' }" v-show="hiddenFooter" class="clean-link">
            <i class="fa-solid fa-rocket"></i>
        </router-link>
        <router-link v-if="!userStore.isAuthenticated && !userStore.user" :to="{ name: 'v2.login' }" class="clean-link">
            <i class="fa-solid fa-arrow-right-to-bracket"></i>
        </router-link>
        <img v-if="userStore.isAuthenticated && userStore.user" :src="userStore.user.picture" alt="User avatar">
        <i class="fa-solid fa-question" @click="hideStore.toggleBars" v-show="hiddenHint" ></i>
    </div>
</template>

<style scoped>
@import "../assets/styles/footer.css";
</style>
