<script setup>
import { useHintStore } from '@/store/useStore';
const hideStore = useHintStore();
</script>

<template>

    <div class="modal" v-if="hideStore.isOpen">
    <!-- <div class="modal-backdrop" v-if="hideStore.isOpen"> -->
        <div @click="hideStore.toggleBars" class="close-btn">&times;</div>
        <div class="describe common-describe">
            if you do not need to perform this action,  
            you can click <router-link :to="{ name: 'v2.home' }" class="clean-link" >home</router-link>
            or the icon in the top right corner <i class="fa-solid fa-arrow-left"></i> to return to the homepage.
        </div>
    </div>

</template>



<style scoped>
@import "../assets/styles/ExportModal.css";
.modal{
    background: #222;
    box-shadow: rgb(8 9 10 / 44%) 3px 3px 6px 0px inset, rgb(29 29 29 / 50%) -3px -3px 6px 1px inset, rgb(43 43 43 / 20%) 0px 0px 10px;
    border-radius: 15px;
}
</style>