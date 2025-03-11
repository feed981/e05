import { defineStore } from 'pinia';
import { ref } from "vue";
import { useCommon } from "@/composables/useCommon.js";

// 建立全局響應式狀態
const language = ref(0);  // Vue 3 的響應式變數

// 提供一個函式來修改 language
const setLanguage = (newLang) => {
  language.value = newLang;
};

export function useStore() {
  const domain_soundtrack = ref('https://d2luynvj2paf55.cloudfront.net/soundtrack/');
  return {
    language,
    setLanguage,
    domain_soundtrack
  };
}

export const useLightStore = defineStore('light', () => {
  const isOpen = ref(false);

  function toggleBars() {
    isOpen.value = !isOpen.value;
    isOpen.value ? document.body.classList.add('light-mode') : document.body.classList.remove('light-mode');
  }

  return { 
    isOpen, toggleBars,
   };
});

export const useMenuStore = defineStore('bar', () => {
    const isOpen = ref(false);
  
    function toggleBars() {
      isOpen.value = !isOpen.value;
    }
  
    return { 
      isOpen, toggleBars,
     };
});

export const useExportMenuStore = defineStore('export', () => {
  const isOpen = ref(false);
  const menu = useMenuStore(); // 點的同時也點了useMenuStore所以才會關掉

  function toggleBars() {
    isOpen.value = !isOpen.value;
    menu.toggleBars(); // 連點兩下
  }

  return { 
    isOpen, toggleBars,
   };
});

  
export const useMuteStore = defineStore('mute', () => {
  const isSpeakMute = ref(false);
  const isSoundMute = ref(true);

  const { 
      successNotyftMessage,
  } = useCommon();

  function toggleSpeak() {
    successNotyftMessage([`Language reminders is ${isSpeakMute.value ? 'turned off' : 'turned on'}!`])
    isSpeakMute.value = !isSpeakMute.value;
  }
  
  function toggleSound() {
    successNotyftMessage([`Soundtrack is ${isSpeakMute.value ? 'turned off' : 'turned on'}!`])
    isSoundMute.value = !isSoundMute.value;
  }

  return { 
    isSpeakMute, toggleSpeak,
    isSoundMute, toggleSound,
   };
});
