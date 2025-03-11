<script setup>
import { useExport } from "@/composables/useExport.js";

const {
    handleFileChange,
    handleFileUpload,
} = useExport();

</script>

<template>
    <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-file-import"></i> Import as JSON!</h1>

    <input type="file" @change="handleFileChange" accept=".json">

    <div>
    <i title="Overwrite, everything gone, careful!" @click="handleFileUpload('overwrite')" class="font-awesome-i fa-solid fa-feather"></i>
    <i title="Append, will keep the original, but still can work ha!" @click="handleFileUpload('append')" class="font-awesome-i fa-solid fa-feather-pointed"></i>
    </div>
</template>

<style scoped>
@import "../assets/styles/import-loading.css";
</style>
  