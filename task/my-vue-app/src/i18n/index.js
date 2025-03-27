import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

export const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: localStorage.getItem('locale') ? localStorage.getItem('locale') : 'zh', // 設置默認語言
  fallbackLocale: 'en', // 設置備用語言
  globalInjection: true, // 添加全局注入
  messages: {
    en,
    zh
  }
})
// 導出 locale 的引用
export const locale = i18n.global.locale

export default i18n 