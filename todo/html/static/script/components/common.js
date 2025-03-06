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

const notyf_info = new Notyf({
    duration: 5000, // 訊息顯示時間
    dismissible: true, // 允許關閉
    position: {
        x: 'center',
        y: 'top',
    },
    types: [
        {
            type: 'warning',
            background: 'linear-gradient(45deg, #1287ca, #0aa0ce)', // 背景顏色
        }
    ]
});

const Common = {
    windowConfirm(message){
        const language = store.language;
        Common.speechSynthesisSpeak(message[language]);
        return window.confirm(message[language]);
    },
    successNotyftMessage(message){
        const language = store.language;
        Common.speechSynthesisSpeak(message[language]);
        notyf.success(message[language]);
    },
    errorNotyftMessage(message){
        const language = store.language;
        Common.speechSynthesisSpeak(message[language]);
        notyf.error(message[language]);
        return;
    },
    warningNotyftMessageCheckData(message){
        const language = store.language;
        Common.speechSynthesisSpeak(message[language]);
        notyf_warning.open({
            type: 'warning',
            message: message[language]
        });
        return;
    },
    getTodayDate() {
        const today = new Date();
        return today.toISOString().split("T")[0]; // 轉成 YYYY-MM-DD 格式
    },

    speechSynthesisSpeak(text){
        // console.log('speechSynthesisSpeak isSpeakMute: ' + store.isSpeakMute);
        if(store.isSpeakMute){
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(text);
            synth.speak(utterance);
        }
    },
    playSoundtrack(path) {
        // console.log('isSoundMute: ' + store.isSoundMute);
        if(store.isSoundMute){
            // Ensure path is valid
            if (!path) {
                console.error('No audio path provided');
                return;
            }

            // Always pause existing audio first
            this.pauseSoundtrack();

            try {
                // Create new Audio object
                store.currentAudio = new Audio(path);

                // Add error handling listeners
                store.currentAudio.onerror = (error) => {
                    console.error('Audio error:', error);
                    store.currentAudio = null;
                };

                // Check if audio is loaded before playing
                store.currentAudio.oncanplaythrough = () => {
                    if(store.isSoundMute){
                        store.currentAudio.play()
                            .catch(e => {
                                console.error('Play error:', e);
                                store.currentAudio = null;
                            });
                    }
                };

                // Debugging log
                console.log('Created Audio object:', store.currentAudio);
            } catch (error) {
                console.error('Failed to create Audio object:', error);
                store.currentAudio = null;
            }
        }
    },
    pauseSoundtrack() {
        if (store.currentAudio) {
            try {
                store.currentAudio.pause();
                store.currentAudio.currentTime = 0;
                
                // Optional: Remove event listeners to prevent memory leaks
                store.currentAudio.onerror = null;
                store.currentAudio.oncanplaythrough = null;
            } catch (error) {
                console.error('Pause error:', error);
                store.currentAudio = null;
            }
        } else {
            console.warn('No audio to pause');
        }
    },
};


// 註冊到全局
window.Common = Common;