import { createApp } from 'vue'
import App from './App.vue'

import "./assets/styles/global.css";
import "./assets/styles/light-mode.css";
import "./assets/styles/float.css";

import router from './router';  // 確保 router 正確引入
import { createPinia } from 'pinia';  // 引入 Pinia

import "notyf/notyf.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// import { Notyf } from "notyf";
// const notyf = new Notyf();
// notyf.success("本地載入成功！");

const pinia = createPinia(); // 創建 Pinia 實例

const app = createApp(App);
app.use(pinia); // 註冊 Pinia
app.use(router); //順序要在 Pinia 之後
app.mount('#app');
