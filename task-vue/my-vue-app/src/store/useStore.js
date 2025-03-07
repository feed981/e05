import { defineStore } from 'pinia';
import { ref } from 'vue';


export const useLightStore = defineStore('light', () => {
  const isLight = ref(false);
  const bar = useBarStore();

  function toggleLight() {
    isLight.value = !isLight.value;
    isLight.value ? document.body.classList.add('light-mode') : document.body.classList.remove('light-mode');
    bar.toggleBars();
  }

  return { 
    isLight, toggleLight,
   };
});

export const useBarStore = defineStore('bar', () => {
    const isBarOpen = ref(false);
  
    function toggleBars() {
        isBarOpen.value = !isBarOpen.value;
    }
  
    return { 
        isBarOpen, toggleBars,
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
