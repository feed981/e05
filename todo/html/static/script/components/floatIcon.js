const FloatIcon = {
    props: ['isQrcode','isLight','isAllTasklist','isCategoryTasklist','isCategoryArchiveTasklist','isSendEmail','isCategoryVisible','isImport','isTaskVisible','isEdit','isSpeakMute','isSoundMute','formData'],  // 接收父组件的值
    emits: ['update:isQrcode','update:isLight','update:isAllTasklist','update:isCategoryTasklist','update:isCategoryArchiveTasklist','update:isSendEmail','update:isCategoryVisible','update:isImport','update:isTaskVisible','update:isEdit','update:isSpeakMute','update:isSoundMute','update:formData'],  // 允许子组件更新父组件

     template: `
     <div @click="toggleSpeak" class="speak-float" :class="{ mute: !this.isSpeakMute }"></div>
     <div @click="toggleSound" class="sound-float" :class="{ mute: !this.isSoundMute }"></div>
     <div @click="otherpage('isTaskVisible')" v-if="!isQrcode && !isSendEmail && !isTaskVisible && !isEdit" class="float">
        <i class="my-float font-awesome-i fa-solid fa-plus"></i>
     </div>
     `,
     computed: {
        localIsSpeakMute: {
            get() { 
                return this.isSpeakMute; 
            },
            set(value) { 
                this.$emit('update:isSpeakMute', value);
                // 同時更新全局狀態
                store.isSpeakMute = value;
            }
        },
        localIsSoundMute: {
            get() { 
                return this.isSoundMute; 
            },
            set(value) { 
                this.$emit('update:isSoundMute', value);
                // 同時更新全局狀態
                store.isSoundMute = value;
            }
        }
    },
    // 在組件掛載時同步初始狀態
    mounted() {
        store.isSpeakMute = this.isSpeakMute;
        store.isSoundMute = this.isSoundMute;
    },
     methods:{
        toggleSpeak(){
            // console.log('toggleSpeak() store.isSpeakMute:'+store.isSpeakMute)
            this.localIsSpeakMute = !this.localIsSpeakMute;
            window.Common.successNotyftMessage([`Speak is ${this.localIsSpeakMute ? 'mute' : 'unmute'}`])
            document.querySelector('.speak-float').classList.toggle('mute', this.localIsSpeakMute);
        },
        toggleSound(){
            this.localIsSoundMute = !this.localIsSoundMute;
            window.Common.successNotyftMessage([`Sound is ${this.localIsSoundMute ? 'mute' : 'unmute'}`])
            document.querySelector('.sound-float').classList.toggle('mute', this.localIsSoundMute);
        },
        setIsWithOptions(activeKey) {
            // Create an object with all keys set to false by default
            const defaultFalseState = {
                isAllTasklist: false,
                isCategoryTasklist: false,
                isCategoryArchiveTasklist: false,
                isSendEmail: false,
                isCategoryVisible: false,
                isImport: false,
                isTaskVisible: false,
                isEdit: false,
                isQrcode: false,
            };
    
            // Create a new object with the specific key set to true
            const updatedFormData = {
                ...defaultFalseState,
                [activeKey]: true
            };
    
            // Emit the updated form data
            this.$emit('update:formData', updatedFormData);
        },
        otherpage(activeKey, soundtrack){
            if(soundtrack !== undefined){
                window.Common.playSoundtrack(`${store.cloudfrontsoundtrack}${soundtrack}.mp3`);
            }
            if(activeKey === 'isTaskVisible'){
                window.Common.successNotyftMessage([`Please add a new task!`,`請新增一項任務!`]);
                // this.selectedCategory = '';
                // this.newTask.text = "";
                // this.newTask.date = window.Common.getTodayDate();
            }
            this.setIsWithOptions(activeKey);
        },
        
    }
}

// 註冊全局組件
window.FloatIcon = FloatIcon;