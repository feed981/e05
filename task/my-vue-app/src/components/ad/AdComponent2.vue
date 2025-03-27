<template>
  <div class="floating-ad" :class="{ 'ad-visible': showAd }">
    <button class="close-btn" @click="closeAd">×</button>
    <AdComponent ad-slot="5555555555" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      showAd: false
    }
  },
  mounted() {
    // 顯示延遲廣告
    setTimeout(() => {
      this.showAd = true;
    }, 30000); // 30秒後顯示
  },
  methods: {
    closeAd() {
      this.showAd = false;
    }
  }
}
</script>

<style scoped>
.floating-ad {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  display: none;
  z-index: 999;
}
.ad-visible {
  display: block;
}
.close-btn {
  position: absolute;
  right: 5px;
  top: 5px;
}
</style>