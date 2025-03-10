import { defineStore } from 'pinia';
import { ref } from "vue";

// 建立全局響應式狀態
const language = ref(0);  // Vue 3 的響應式變數

// 提供一個函式來修改 language
const setLanguage = (newLang) => {
  language.value = newLang;
};

export function useStore() {
  return {
    language,
    setLanguage
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

  function toggleSpeak() {
    isSpeakMute.value = !isSpeakMute.value;
  }

  function toggleSound() {
    isSoundMute.value = !isSoundMute.value;
  }

  return { 
    isSpeakMute, toggleSpeak,
    isSoundMute, toggleSound,
   };
});
