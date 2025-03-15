import { getActivePinia } from "pinia";

import { ref, computed } from "vue";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

import { useStore, useMuteStore } from "@/store/useStore";

import { useRoute } from 'vue-router';

const notyf = new Notyf({
    duration: 5000, // 顯示 3 秒
    dismissible: true,
    position: {
        x: 'center',
        y: 'top'
    }
});

const notyf_warning = new Notyf({
    duration: 5000, // 訊息顯示時間
    dismissible: true, // 允許關閉
    position: {
        x: 'center',
        y: 'top',
    },
    types: [
        {
            type: 'warning',
            background: 'orange', // 背景顏色
        }
    ]
});

let currentAudio = ref(null);

export function useCommon() {
    if (!getActivePinia()) return {}; // 確保 Pinia 已初始化
  
    const { language, domain_soundtrack } = useStore();

    const { 
        isSpeakMute,
        isSoundMute 
    } = useMuteStore();  

    const windowConfirm = (message) => {
        speechSynthesisSpeak(message[language.value]);
        return window.confirm(message[language.value]);
    };

	const successNotyftMessageWithST = (message, file) => {
        playSoundtrack(domain_soundtrack.value + file);
        successNotyftMessage(message);
    };

	const successNotyftMessage = (message) => {
        // console.log('1:'+message)
        // console.log('2:'+language.value)
        // console.log('3:'+message[language.value])
        speechSynthesisSpeak(message[language.value]);
        notyf.success(message[language.value]);
    };

    const errorNotyftMessage = (message) => {
        speechSynthesisSpeak(message[language.value]);
        notyf.error(message[language.value]);
        
    };

    const warningNotyftMessageCheckData = (message) => {
        speechSynthesisSpeak(message[language.value]);
        notyf_warning.open({
            type: 'warning',
            message: message[language.value]
        });
        
    };

    const speechSynthesisSpeak = (text) => {
        // console.log('speechSynthesisSpeak isSpeakMute: ' + isSpeakMute);
        if(isSpeakMute){
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(text);
            synth.speak(utterance);
        }
    };

    const playSoundtrack = (path) => {
        // console.log('isSoundMute: ' + isSoundMute);
        if(isSoundMute){
            // Ensure path is valid
            if (!path) {
                console.error('No audio path provided');
                return;
            }

            // Always pause existing audio first
            pauseSoundtrack();

            try {
                // Create new Audio object
                currentAudio = new Audio(path);

                // Add error handling listeners
                currentAudio.onerror = (error) => {
                    console.error('Audio error:', error);
                    currentAudio = null;
                };

                // Check if audio is loaded before playing
                currentAudio.oncanplaythrough = () => {
                    if(isSoundMute){
                        currentAudio.play()
                            .catch(e => {
                                console.error('Play error:', e);
                                currentAudio = null;
                            });
                    }
                };

                // Debugging log
                // console.log('Created Audio object:', currentAudio);
            } catch (error) {
                console.error('Failed to create Audio object:', error);
                currentAudio = null;
            }
        }
    };

    const pauseSoundtrack = () => {
        if (currentAudio) {
            try {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                
                // Optional: Remove event listeners to prevent memory leaks
                currentAudio.onerror = null;
                currentAudio.oncanplaythrough = null;
            } catch (error) {
                console.error('Pause error:', error);
                currentAudio = null;
            }
        } else {
            console.warn('No audio to pause');
        }
    };

    const route = useRoute();

    const hiddenPlus = computed(() => {
        const hiddenPaths = ['/v2/qrcode','/v2/feedback','/v2/tasks/new',
            '/v2/category/list','/v2/:category/tasks/:date'
        ];
        return !hiddenPaths.includes(route.path);
    });

    const hiddenPrepage = computed(() => {
        const hiddenPaths = ['/v2'];
        return !hiddenPaths.includes(route.path);
    });

    return {
        windowConfirm,
        successNotyftMessageWithST,
        successNotyftMessage,
        errorNotyftMessage,
        warningNotyftMessageCheckData,
        playSoundtrack,
        hiddenPlus,
        hiddenPrepage,
    };
}