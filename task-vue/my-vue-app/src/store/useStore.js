import { defineStore } from 'pinia';
import { ref } from 'vue';

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
