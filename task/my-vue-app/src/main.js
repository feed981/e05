import { createApp } from 'vue'
import App from './App.vue'

import "./assets/styles/global.css";
import "./assets/styles/light-mode.css";
import "./assets/styles/float.css";

import router from './router';  // 確保 router 正確引入
import { createPinia } from 'pinia';  // 引入 Pinia
import i18n from './i18n' // 引入 i18n 配置

import "notyf/notyf.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
// import { Notyf } from "notyf";
// const notyf = new Notyf();
// notyf.success("本地載入成功！");

import vue3GoogleLogin from "vue3-google-login"; // 注意這裡是模塊名稱

const pinia = createPinia(); // 創建 Pinia 實例

const app = createApp(App);
app.use(vue3GoogleLogin, {
    clientId: "695375680435-u6j4tf7a7a9q71qhq9ifj8543643j2ig.apps.googleusercontent.com",    
});
app.use(pinia); // 註冊 Pinia
app.use(router); //順序要在 Pinia 之後
app.use(i18n); // 註冊 i18n

app.mount('#app');
