<script setup>
import { ref, onMounted } from 'vue';
import emailjs from '@emailjs/browser';
import { useCommon } from "@/composables/useCommon.js";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 初始化 emailjs
onMounted(() => {
  emailjs.init("un2nCxSnYlqZWdgMG");  // 替換為你的 EmailJS 公開 API 金鑰
});

// 定義表單資料
const formData = ref({
  to_email: '',
  from_name: '',
  message: '',
  pageTitle: '',
  currentURL: '',
});

const sending = ref(false);
const status = ref('');
const isError = ref(false);

const { 
    errorNotyftMessage,
} = useCommon();

const handleSubmit = () => {
  sending.value = true;
  status.value = t('feedback.status.sending');
  isError.value = false;

  // 設定當前頁面資訊
  formData.value.pageTitle = document.title;
  formData.value.currentURL = window.location.href;

  emailjs.send(
    "service_qzarp8m",  // 你的 EmailJS 服務 ID
    "template_f3pkjrv", // 你的 EmailJS 模板 ID
    formData.value
  ).then(
    (response) => {
      // console.log('Email sent successfully!', response);
      status.value = t('feedback.status.success');
      sending.value = false;

      // 清空表單
      formData.value = {
        pageTitle: '',
        currentURL: '',
        to_email: '',
        from_name: '',
        message: ''
      };
    },
    (error) => {
      console.error('Error sending email:', error);
      errorNotyftMessage([t('feedback.error.message', { error }), error]);
      status.value = t('feedback.status.error');
      isError.value = true;
      sending.value = false;
    }
  );
};
</script>

<template>
   <div class="card">
      <h1 class="bhutuka-expanded-one-regular">
        <i class="fa-solid fa-envelope"></i> {{ t('feedback.title') }}
      </h1>
      <form @submit.prevent="handleSubmit">
        <div class="input-container">
          <input 
            type="email" 
            v-model="formData.to_email" 
            required 
            :placeholder="t('feedback.form.emailPlaceholder')"
          >
          <input 
            type="text" 
            style="margin-right: 0px;" 
            v-model="formData.from_name" 
            required
            :placeholder="t('feedback.form.namePlaceholder')"
          >
        </div>
        <div class="input-container">
          <textarea 
            v-model="formData.message" 
            required 
            :placeholder="t('feedback.form.messagePlaceholder')"
          ></textarea>
        </div>
        <button class="font-awesome-i-inbutton" type="submit">
          <i :title="t('feedback.form.submitTooltip')" class="fa-solid fa-paper-plane"></i>
        </button>
        <div class="status" :class="{ error: isError }" v-if="status">{{ status }}</div>
      </form>
    </div>
</template>
  
<style scoped>
.error {
  color: red;
}
</style>