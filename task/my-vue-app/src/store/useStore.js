import { defineStore } from 'pinia';
import { ref, watch } from "vue";
import { useCommon } from "@/composables/useCommon.js";
import { useI18n } from 'vue-i18n'
export function useStore() {

  const domain_soundtrack = ref('https://d2luynvj2paf55.cloudfront.net/soundtrack/');

  return {
    domain_soundtrack,
  }
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
    const coreMenuStore = useCoreMenuStore();
    const dataMenuStore = useDataMenuStore();
    const settingsMenuStore = useSettingsMenuStore();
    const navigationMenuStore = useNavigationMenuStore();
    const languageMenuStore = useLanguageMenuStore();

    function toggleBars() {
      isOpen.value = !isOpen.value;
      coreMenuStore.isOpen = false;
      dataMenuStore.isOpen = false;
      settingsMenuStore.isOpen = false;
      navigationMenuStore.isOpen = false;
      languageMenuStore.isOpen = false;
    }
  
    return { 
      isOpen, toggleBars,
     };
});

export const useCoreMenuStore = defineStore('core', () => {
  const isOpen = ref(false);
  const dataMenuStore = useDataMenuStore();
  const settingsMenuStore = useSettingsMenuStore();
  const navigationMenuStore = useNavigationMenuStore();
  const languageMenuStore = useLanguageMenuStore();

  function toggleBars() {
    isOpen.value = !isOpen.value;
    dataMenuStore.isOpen = false;
    settingsMenuStore.isOpen = false;
    navigationMenuStore.isOpen = false;
    languageMenuStore.isOpen = false;
  }

  return { 
    isOpen, toggleBars,
   };
});

export const useDataMenuStore = defineStore('data', () => {
  const isOpen = ref(false);
  const coreMenuStore = useCoreMenuStore();
  const settingsMenuStore = useSettingsMenuStore();
  const navigationMenuStore = useNavigationMenuStore();
  const languageMenuStore = useLanguageMenuStore();

  function toggleBars() {
    isOpen.value = !isOpen.value;
    coreMenuStore.isOpen = false;
    settingsMenuStore.isOpen = false;
    navigationMenuStore.isOpen = false;
    languageMenuStore.isOpen = false;
  }

  return { 
    isOpen, toggleBars,
   };
});

export const useSettingsMenuStore = defineStore('settings', () => {
  const isOpen = ref(false);
  const coreMenuStore = useCoreMenuStore();
  const dataMenuStore = useDataMenuStore();
  const navigationMenuStore = useNavigationMenuStore();
  const languageMenuStore = useLanguageMenuStore();
  
  function toggleBars() {
    isOpen.value = !isOpen.value;
    coreMenuStore.isOpen = false;
    dataMenuStore.isOpen = false;
    navigationMenuStore.isOpen = false;
    languageMenuStore.isOpen = false;
  }

  return { 
    isOpen, toggleBars,
   };
});

export const useNavigationMenuStore = defineStore('navigation', () => {
  const isOpen = ref(false);
  const coreMenuStore = useCoreMenuStore();
  const dataMenuStore = useDataMenuStore();
  const settingsMenuStore = useSettingsMenuStore();
  const languageMenuStore = useLanguageMenuStore();

  function toggleBars() {
    isOpen.value = !isOpen.value;
    coreMenuStore.isOpen = false;
    dataMenuStore.isOpen = false;
    settingsMenuStore.isOpen = false;
    languageMenuStore.isOpen = false;
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

export const useLanguageMenuStore = defineStore('language', () => {
  const isOpen = ref(false);
  
  const { locale } = useI18n()
  const language = ref(locale.value === 'en' ? 0 : 1);

  // 監聽 locale 變化
  watch(locale, (newLocale) => {
    localStorage.setItem('locale', newLocale)
    language.value = newLocale === 'en' ? 0 : 1
  })
  // console.log('store language: ' + language.value);

  function toggleBars() {
    isOpen.value = !isOpen.value;
  }

  return { 
    isOpen, toggleBars,
    language,
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
  const isSpeakMute = ref(true);
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

export const useHintStore = defineStore('hint', () => {
  const isOpen = ref(false);

  function toggleBars() {
    isOpen.value = !isOpen.value;
  }

  return { 
    isOpen, toggleBars,
   };
});
