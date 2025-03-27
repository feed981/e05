<template>
  <div class="ad-container" ref="adContainer"></div>
</template>

<script>
export default {
  name: 'AdComponent',
  props: {
    adSlot: { type: String, required: true },
    adFormat: { type: String, default: 'auto' }
  },
  mounted() {
    this.loadAd();
  },
  methods: {
    loadAd() {
      if (window.adsbygoogle) {
        const adElement = document.createElement('ins');
        adElement.className = 'adsbygoogle';
        adElement.setAttribute('data-ad-client', 'ca-pub-1180566311514502'); // 您的AdSense ID
        adElement.setAttribute('data-ad-slot', this.adSlot);
        adElement.setAttribute('data-ad-format', this.adFormat);
        adElement.style.display = 'block';
        
        this.$refs.adContainer.appendChild(adElement);
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    }
  }
}
</script>