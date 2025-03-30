<script setup>
import { useExport } from "@/composables/useExport.js";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const {
  isLoading,
  handleFileChange,
  handleFileUpload,
} = useExport();

</script>

<template>
    <h1 class="bhutuka-expanded-one-regular">
      <i class="fa-solid fa-file-import"></i> {{ t('import.title') }}
    </h1>
    <div>
        <input 
          type="file" 
          @change="handleFileChange" 
          accept=".json"
          :title="t('import.fileInput.title')"
        >
        <i 
          :title="t('import.actions.overwrite')" 
          @click="handleFileUpload('overwrite')" 
          class="fa-solid fa-file-import"
        ></i>

        <!-- <i title="Append, will keep the original, but still can work ha!" @click="handleFileUpload('append')" class="fa-solid fa-feather-pointed"></i> -->
    </div>
    
    <div class="loading-container">
        <div v-if="isLoading" class="loading">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    <div class="describe">{{ t('import.hints.overwrite') }}</div>

</template>

<style scoped>
@import "../assets/styles/import-loading.css";
input[type="file"] {
  /* font-family: "Unbounded", sans-serif; */
  /* font-optical-sizing: auto; */
  /* font-style: normal; */
  /* font-weight: 800; */
  box-shadow: none;
  border: none;
  border-radius: 0px;
}
</style>
  