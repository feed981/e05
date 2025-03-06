const store = Vue.reactive({
    language: 0,
    isSendEmail: false,
    isSpeakMute: false,
    isSoundMute: true,
    currentAudio: null,
    cloudfrontsoundtrack: 'https://d2luynvj2paf55.cloudfront.net/soundtrack/',
});


// 註冊全局組件
window.store = store;