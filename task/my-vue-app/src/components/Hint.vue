<script setup>
import { useHintStore } from '@/store/useStore';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const hideStore = useHintStore();
</script>

<template>
    <div class="modal" v-if="hideStore.isOpen">
        <div @click="hideStore.toggleBars" class="close-btn">&times;</div>
        <div class="describe common-describe">
            {{ t('hint.returnMessage.before') }}
            <router-link :to="{ name: 'v2.home' }" class="clean-link">{{ t('common.home') }}</router-link>
            {{ t('hint.returnMessage.middle') }}
            <i class="fa-solid fa-arrow-left"></i>
            {{ t('hint.returnMessage.after') }}
        </div>
    </div>
</template>

<style scoped>
@import "../assets/styles/ExportModal.css";
.modal {
    background: #222;
    box-shadow: rgb(8 9 10 / 44%) 3px 3px 6px 0px inset, rgb(29 29 29 / 50%) -3px -3px 6px 1px inset, rgb(43 43 43 / 20%) 0px 0px 10px;
    border-radius: 15px;
}

.light-mode .close-btn {
    color: #b9b9b9;
}

.light-mode .modal {
    background: #fff;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
}

.clean-link {
    color: inherit;
    text-decoration: underline;
    text-decoration: none;
    color: #1287ca;
}

i {
    margin: 0 4px;
}
</style>