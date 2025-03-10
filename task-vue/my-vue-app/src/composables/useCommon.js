import { getActivePinia } from "pinia";

import { ref } from "vue";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

import { useStore, useMuteStore } from "@/store/useStore";

const { language } = useStore();  

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

const currentAudio = ref(null);

// 取得今天日期
const getTodayDate = () => new Date().toISOString().split("T")[0];



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

export function useCommon() {
    if (!getActivePinia()) return {}; // 確保 Pinia 已初始化
  
    const { 
        isSpeakMute,
        isSoundMute 
    } = useMuteStore();  

    const windowConfirm = (message) => {
        speechSynthesisSpeak(message[language]);
        return window.confirm(message[language]);
    };

    const successNotyftMessage = (message) => {
        speechSynthesisSpeak(message[language]);
        notyf.success(message[language]);
    };

    const errorNotyftMessage = (message) => {
        speechSynthesisSpeak(message[language]);
        notyf.error(message[language]);
        return;
    };

    const warningNotyftMessageCheckData = (message) => {
        speechSynthesisSpeak(message[language]);
        notyf_warning.open({
            type: 'warning',
            message: message[language]
        });
        return;
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
                console.log('Created Audio object:', currentAudio);
            } catch (error) {
                console.error('Failed to create Audio object:', error);
                currentAudio = null;
            }
        }
    };

    return {
        windowConfirm,
        successNotyftMessage,
        errorNotyftMessage,
        warningNotyftMessageCheckData,
        playSoundtrack,
    };
}