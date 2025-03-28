<script setup>
import { useLogin } from "@/composables/useLogin.js";
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';

const { t } = useI18n();

const {
  triggerGoogleLogin,
  triggerGoogleLogin2,
  logout,
  handleOAuthCallback,
} = useLogin();

onMounted(() => {
    // 檢查是否有 token 參數，如果有則處理 OAuth 回調
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('token')) {
        handleOAuthCallback(urlParams);
    }
});
</script>

<template>
  <div class="margin-top"></div>

  <!-- <div @click="triggerGoogleLogin" class="login-with-google-btn">
    {{ t('login.actions.signInWithGoogle') }}
  </div> -->
  <div @click="triggerGoogleLogin2" class="login-with-google-btn">
    {{ t('login.actions.signInWithGoogle') }}
  </div>
  <div @click="logout" class="login-with-google-btn">
    {{ t('login.actions.logout') }}
  </div>
</template>

<style scoped>
@import "../assets/styles/login.css";
</style>