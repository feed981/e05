import { getActivePinia } from "pinia";

import { ref, computed } from "vue";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

import { useStore, useMuteStore, useLanguageMenuStore } from "@/store/useStore";

import { useRoute, useRouter } from 'vue-router';

const notyf = new Notyf({
    duration: 5000, // 顯示 3 秒
    dismissible: true,
    position: {
        x: 'center',
        y: 'top'
    }
});

const notyf_success = new Notyf({
    duration: 5000, // 訊息顯示時間
    dismissible: true, // 允許關閉
    position: {
        x: 'center',
        y: 'top',
    },
    types: [
        {
            type: 'success',
            background: '#2dbd67', // 背景顏色
            icon: {
                style: {
                    color: 'white', // 設定圖示顏色
                    fontSize: '20px' // 設定大小，讓它更明顯
                },
                className: 'fa-solid fa-check', // 使用 FontAwesome 圖標
                tagName: 'i' // 使用 <i> 標籤
            }
        }
    ]
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
            icon: {
                style: {
                    color: 'white', // 設定圖示顏色
                    fontSize: '20px' // 設定大小，讓它更明顯
                },
                className: 'fa-solid fa-circle-exclamation', // 使用 FontAwesome 圖標
                tagName: 'i' // 使用 <i> 標籤
            }
        }
    ]
});

const notyf_error = new Notyf({
    duration: 5000, // 訊息顯示時間
    dismissible: true, // 允許關閉
    position: {
        x: 'center',
        y: 'top',
    },
    types: [
        {
            type: 'error',
            background: '#ad2331', // 背景顏色
            icon: {
                style: {
                    color: 'white', // 設定圖示顏色
                    fontSize: '20px' // 設定大小，讓它更明顯
                },
                className: 'fa-solid fa-spider', // 使用 FontAwesome 圖標
                tagName: 'i' // 使用 <i> 標籤
            }
        }
    ]
});


let currentAudio = ref(null);

export function useCommon() {
    if (!getActivePinia()) return {}; // 確保 Pinia 已初始化
    
    const { domain_soundtrack } = useStore();
    const locale = localStorage.getItem('locale');
    const language = locale === 'en' ? 0 : 1
    // console.log('locale:',locale,' ,common language: ' + language);

    const { 
        isSpeakMute,
        isSoundMute 
    } = useMuteStore();  

    const route = useRoute();
    const router = useRouter();


    const windowConfirm = (message) => {
        speechSynthesisSpeak(message[language]);
        return window.confirm(message[language]);
    };

	const successNotyftMessageWithST = (message, file) => {
        playSoundtrack(domain_soundtrack.value + file);
        successNotyftMessage(message);
    };

	const successNotyftMessage = (message) => {
        // console.log('1:'+message)
        // console.log('2:'+language)
        // console.log('3:'+message[language])
        speechSynthesisSpeak(message[language]);
        // notyf.success(message[language]);
        notyf_success.open({
            type: 'success',
            message: message[language]
        });
    };

    const errorNotyftMessage = (message) => {
        speechSynthesisSpeak(message[language]);
        // notyf.error(message[language]);
        notyf_error.open({
            type: 'error',
            message: 'Please feedback this error, <br>' + message[language]
        });
        setTimeout(() => {
            router.push('/task/v2/feedback');
        }, 3000);
    };

    const warningNotyftMessageCheckData = (message) => {
        speechSynthesisSpeak(message[language]);
        notyf_warning.open({
            type: 'warning',
            message: message[language]
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

    

    const hiddenPlus = computed(() => {
        const path = '/task/v2';
        const exactHiddenPaths = [
            path+'/qrcode',
            path+'/feedback',
            path+'/tasks/new',
            path+'/category/list',
            path+'/export',
            path+'/login',
        ];

        // Check for exact matches first
        if (exactHiddenPaths.includes(route.path)) {
            return false;
        }
        
        // Check dynamic path with regex pattern
        if (/^\/task\/v2\/[^/]+\/tasks\/[^/]+$/.test(route.path)) {
            return false;
        }
        if (/^\/task\/v2\/[^/]+\/tasks\/[^/]+(\/normal|\/completed|\/urgent)$/.test(route.path)) {
            return false;
        }

        return true;
    });

    const hiddenPrepage = computed(() => {
        const hiddenPaths = ['/task/v2'];
        return !hiddenPaths.includes(route.path);
    });

    const hiddenFooter = computed(() => {
        const path = '/task/v2';
        const exactHiddenPaths = [
            path+'/export',
        ];

        // Check for exact matches first
        if (exactHiddenPaths.includes(route.path)) {
            return false;
        }
        return true;
    });

    const hiddenHint = computed(() => {
        const path = '/task/v2';
        const exactHiddenPaths = [
            path+'/tasks/new',
            path+'/category/list',
        ];

        // Check for exact matches first
        if (exactHiddenPaths.includes(route.path)) {
            return true;
        }

        const dynamicPattern = /^\/task\/v2\/[^/]+\/tasks\/[^/]+$/;
        if (dynamicPattern.test(route.path)) {
            return true;
        }
        return false;
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
        hiddenFooter,
        hiddenHint,
    };
}