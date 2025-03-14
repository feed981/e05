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

export const useCategoryMenuStore = defineStore('categoryMenu', () => {
  const expandedCategories = ref({}); // 存儲每個類別的展開狀態

  const toggleBars = (categoryName) => {
    expandedCategories.value[categoryName] = !expandedCategories.value[categoryName];
  };

  return { 
    expandedCategories, toggleBars,
   };
});

export const useTaskMenuStore = defineStore('taskMenu', () => {
  const expandedTasks = ref({}); // 存储每个类别的展开状态

  const toggleBars = (categoryName, date, updatetime) => {
    // 将时间戳转换为字符串，用作对象键
    const timestampKey = String(updatetime);
    
    // console.log(
    //     'categoryName:',categoryName,
    //     'date:',date,
    //     'updatetime:',updatetime,
    // )

    // 确保对象层级已初始化
    if (!expandedTasks.value[categoryName]) {
      expandedTasks.value[categoryName] = {};
    }

    if (!expandedTasks.value[categoryName][date]) {
      expandedTasks.value[categoryName][date] = {};
    }
    
    // 使用时间戳字符串作为键名
    expandedTasks.value[categoryName][date][timestampKey] = !expandedTasks.value[categoryName][date][timestampKey];
  };

  return { 
    expandedTasks, 
    toggleBars
  };
});

export const useExportMenuStore = defineStore('export', () => {
  const isOpen = ref(false);

  function toggleBars() {
    isOpen.value = !isOpen.value;
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
    successNotyftMessage([`Soundtrack is ${isSoundMute.value ? 'turned off' : 'turned on'}!`])
    isSoundMute.value = !isSoundMute.value;
  }

  return { 
    isSpeakMute, toggleSpeak,
    isSoundMute, toggleSound,
   };
});
