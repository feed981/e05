<script setup>
import { useCommon } from "@/composables/useCommon.js";
import { useHintStore } from '@/store/useStore';

const { 
  hiddenFooter,
  hiddenHint,
} = useCommon();

const hideStore = useHintStore();
</script>

<template>
    <div class="footer">
        <router-link :to="{ name: 'v2.tasks.new' }" v-show="hiddenFooter" class="clean-link">
            <i class="fa-regular fa-calendar"></i>
        </router-link>
        <router-link :to="{ name: 'v2.category.list' }" v-show="hiddenFooter" class="clean-link">
            <i class="fa-solid fa-icons"></i>
        </router-link>
        <i class="fa-solid fa-question" @click="hideStore.toggleBars" v-show="hiddenHint" ></i>
    </div>
</template>

<style scoped>

.float {
    width: 25px;
    height: 40px;
    color: #FFF;
    border-radius: 90px 5px 5px 90px;
    box-shadow: rgb(17 26 31) 3px 3px 6px 0px inset, rgb(29 29 29 / 50%) -3px -3px 6px 1px inset, rgb(103 97 97 / 20%) 0px 0px 10px;
    /* text-align: center; */
    transition: all 0.8s ease;
    /* z-index: 9999; */
  }
  .float:hover {
    box-shadow: none;
    transition: all 2.8s ease;
  }

  
.light-mode .float {
  /* box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset; */
  /* background: #39b2f8; */
  box-shadow: rgb(255 255 255 / 25%) 0px 1px 1px, rgb(15 55 124 / 13%) 0px 0px 1px 1px;
  /* box-shadow: rgb(252 252 252) 3px 3px 6px 0px inset, rgb(236 236 236 / 50%) -3px -3px 6px 1px inset;*/
}

.light-mode .float i {
  /* color: #1287ca; */
  color: #e4e4e4;
}


.footer{
    position: absolute;
    bottom: 20px; /* 距離底部 10px，可調整 */
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    text-align: center;
    color: white;
    padding: 10px;
}

.footer i{
    padding: 10px;
}
</style>
