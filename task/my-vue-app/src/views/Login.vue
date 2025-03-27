<script setup>
import { useLogin } from "@/composables/useLogin.js";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const {
  triggerGoogleLogin,
  triggerGoogleLogin2,
  logout,
} = useLogin();
</script>

<template>
  <div class="margin-top"></div>

  <div @click="triggerGoogleLogin" class="login-with-google-btn">
    {{ t('login.actions.signInWithGoogle') }}
  </div>
  <!-- <div @click="triggerGoogleLogin2" class="login-with-google-btn">
    {{ t('login.actions.signInWithGoogleOAuth') }}
  </div> -->
  <div @click="logout" class="login-with-google-btn">
    {{ t('login.actions.logout') }}
  </div>
</template>

<style scoped>
@import "../assets/styles/login.css";
</style>