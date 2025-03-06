const { createApp, ref, watch, reactive } = Vue;

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

const store = reactive({
    language: 0,
    isMute: true,
    currentAudio: null,
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
        if(store.isMute){
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(text);
            synth.speak(utterance);
        }
    },
    playSoundtrack(path) {
        if(store.isMute){
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
                    if (store.isMute) {
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

const DropdownMenuHeader = {
    props: ['isLight','isAllTasklist','isCategoryTasklist','isCategoryArchiveTasklist','isSendEmail','isCategoryVisible','isImport','isTaskVisible','isEdit','formData'],  // 接收父组件的值
    emits: ['update:isLight','update:isAllTasklist','update:isCategoryTasklist','update:isCategoryArchiveTasklist','update:isSendEmail','update:isCategoryVisible','update:isImport','update:isTaskVisible','update:isEdit','update:formData'],  // 允许子组件更新父组件

    template: `
<div class="header-container">
    <div class="hamburger">
    <div class="dropdown">
        <svg class="vbp-header-menu-button__svg" @click="toggleBars" :class="{ 'header-opend': this.dropdownviewHeader }">
            <line x1="0" y1="50%" x2="100%" y2="50%" class="top" shape-rendering="crispEdges" />
            <line x1="0" y1="50%" x2="100%" y2="50%" class="middle" shape-rendering="crispEdges" />
            <line x1="0" y1="50%" x2="100%" y2="50%" class="bottom" shape-rendering="crispEdges" />
          </svg>
        <ul v-show="dropdownviewHeader" class="dropdown-menu bars">
<!--
            <li v-if="!isMute" @click="$emit('update:isMute', true )">
                <i class="font-awesome-i fa-solid fa-headset"></i><span>|　Voice reminder</span>
            </li>
            <li v-if="isMute" @click="$emit('update:isMute', false )">
                <i class="font-awesome-i fa-solid fa-microphone-slash"></i><span>|　Slash sound speak</span>
            </li>
-->
            <li v-if="isLight" @click="toggleLight(fasle)">
                <i class="font-awesome-i fa-solid fa-toggle-on"></i><span>|　Toggle dark-mode</span>
            </li>
            <li v-if="!isLight" @click="toggleLight(true)">
                <i class="font-awesome-i fa-solid fa-toggle-off"></i><span>|　Toggle light-mode</span>
            </li>
            <li v-if="!isSendEmail" @click="otherpage('isSendEmail','a')">
                <i class="font-awesome-i fa-solid fa-envelope"></i><span>|　Feedback</span>
            </li>
            <!-- todo: close other div-->
            <li v-if="!isSendEmail" @click="resetdata()">
                <i class="font-awesome-i fa-solid fa-toilet-paper"></i><span>|　Clear all data</span>
            </li>
            <li v-if="!isSendEmail" class="dropdown" @click="toggleDropdown">
                <i class="font-awesome-i fa-solid fa-file-export"></i><span>|　View / Import / Export</span>
                <ul v-show="dropdownviewExport" class="dropdown-menu dropdown-menu-sub">
                <li @click="viewAs('json')"><i class="font-awesome-i fa-solid fa-eye"></i>|　View as JSON</li>
                <li @click="viewAs('html')"><i class="font-awesome-i fa-solid fa-eye"></i>|　View as HTML</li>
                <li @click="otherpage('isImport')">
                    <i class="font-awesome-i fa-solid fa-file-import"></i>|　Import as JSON
                </li>
                <li @click="exportAs('json')"><i class="font-awesome-i fa-solid fa-file-export"></i>|　Export as JSON</li>
                <li @click="exportAs('html')"><i class="font-awesome-i fa-solid fa-file-export"></i>|　Export as HTML</li>
                <li @click="dropdownviewExport = true"><i class="font-awesome-i fa-solid fa-xmark"></i>|　Close the menu</li>
                </ul>
            </li>
            <li v-if="!isSendEmail && !isCategoryVisible && !isImport" 
                @click="otherpage('isCategoryVisible')">
                <i class="font-awesome-i fa-solid fa-icons"></i><span>|　Add new category</span>
            </li>
             <li v-if="!isSendEmail && !isImport && !isTaskVisible" 
                @click="otherpage('isTaskVisible')">
                <i class="font-awesome-i fa-solid fa-list-check"></i><span>|　Add new task</span>
            </li>
            <li v-if="isAllTasklist || isCategoryArchiveTasklist || isCategoryTasklist || isSendEmail || isCategoryVisible || isImport || isTaskVisible || isEdit" 
                @click="otherpage('isAllTasklist')">
                <i class="font-awesome-i fa-solid fa-arrow-left"></i><span>|　Pre page</span>
            </li>
        </ul>
    </div>
    </div>
    <div title="Close this page and go back to alltasklist!" class="closeicon"
        v-if="isCategoryTasklist || isCategoryArchiveTasklist || isSendEmail || isCategoryVisible || isImport || isTaskVisible || isEdit"
        >
        <i @click="otherpage('isAllTasklist')" class="font-awesome-i fa-regular fa-circle-xmark"></i>
    </div>
</div>
    `,
    data() {
        return {
            language: store.language,
            selectedCategory: "",
            dropdownviewHeader: false,
            taskList: JSON.parse(localStorage.getItem("tasks")) || {"default":[]},
        };
    },
    methods:{
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
                isEdit: false
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
                Common.playSoundtrack(`../soundtrack/ds_ringtone_mail-mp3.mp3`);
            }
            if(activeKey === 'isTaskVisible'){
                Common.successNotyftMessage([`Please add a new task!`,`請新增一項任務!`]);
            }else if(activeKey === 'isCategoryVisible'){
                Common.successNotyftMessage([`Please add a new category!`,`請新增一個類別!`]);
            }
            this.setIsWithOptions(activeKey);
        },
        toggleLight(isLight){
            if(isLight){
                Common.playSoundtrack(`../soundtrack/hellodarknessmyoldfriend.mp3`);
            }
            this.$emit('update:isLight', isLight );
        },
        resetdata(){
            if (Common.windowConfirm([`Are you sure you want to clear all the data ?`,`你確定要刪除所有數據嗎?`])) {
                Common.playSoundtrack('../soundtrack/matt-hardy-delete-delete-delete.mp3');
                localStorage.setItem("tasks" ,'{"default":[]}')
                Common.successNotyftMessage([`Deleting data, please wait...`,`刪除數據中請稍後`]);
                
                setTimeout(() => {
                    this.dropdownviewHeader = false;
                }, 2000);

                setTimeout(() => {
                    Common.successNotyftMessage([`Successfully clear permanently...`,`永久刪除所有數據`]);
                }, 4000);

                setTimeout(() => {
                    window.location.reload();
                }, 10000);
            }
        },
        html(){

            let htmlContent = `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
   <title>Export tasklist 2 html</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=BhuTuka+Expanded+One&family=Indie+Flower&family=Metamorphous&family=Smooch+Sans:wght@100..900&family=Vujahday+Script&family=Wire+One&display=swap" rel="stylesheet">
  <link rel="icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon">
  <link rel="shortcut icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #121212;
            font-family: Arial, sans-serif;
            color: white;
            margin: 0;
            overflow: hidden;
        }
        .container {
            width: 400px;
            max-height: 80vh;
            overflow-y: auto;
            padding: 10px;
            scrollbar-width: thin;
            scrollbar-color: #888 #222;
        }
        .container::-webkit-scrollbar {
            width: 8px;
        }
        .container::-webkit-scrollbar-track {
            background: #222;
        }
        .container::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }
        .post {
            background: #222;
            padding: 15px;
            margin: 10px 0;
            border-radius: 10px;
        }
        .user {
            font-weight: bold;
        }
        .time {
            color: gray;
            font-size: 12px;
        }
        .content {
            margin-top: 5px;
        }
        .actions {
            display: flex;
            gap: 10px;
            margin-top: 10px;
            color: gray;
        }
    </style>
</head>

<body>
  <div class="container">
            `;
            // 整理所有待辦事項到一個陣列
            const allTasks = [];
        
            // 遍歷每個分類並整理資料
            Object.entries(this.taskList).forEach(([category, items]) => {
                items.forEach(item => {
                    allTasks.push({
                        ...item,
                        category
                    });
                });
            });
            
            // 按日期降序排序
            allTasks.sort((a, b) => new Date(b.date) - new Date(a.date));

            // 按 category 和 date 分組
        const groupedTasks = {};

        // 依類別與日期與完成狀態分組
        allTasks.forEach(task => {
            // 確保 completed 是字串形式的 "true" 或 "false"
            const completedStatus = String(task.completed);

            if (!groupedTasks[task.category]) {
                groupedTasks[task.category] = {};
            }
            if (!groupedTasks[task.category][task.date]) {
                groupedTasks[task.category][task.date] = { true: [], false: [] };
            }

            // 檢查是否存在對應的陣列
            if (!groupedTasks[task.category][task.date][completedStatus]) {
                groupedTasks[task.category][task.date][completedStatus] = [];
            }

            groupedTasks[task.category][task.date][completedStatus].push(task.text);
        });

        // 依照類別與日期排序
        const sortedCategories = Object.keys(groupedTasks).sort(); // 類別排序

        sortedCategories.forEach(category => {
            htmlContent += `<h3 class="heading-style1">${category}</h3>`;

            // 日期排序（由新到舊）
            const sortedDates = Object.keys(groupedTasks[category]).sort((a, b) => new Date(b) - new Date(a));

            sortedDates.forEach(date => {

                htmlContent += `<div class="post">`;
                htmlContent += `<div class="user"><span class="time">${date}</span></div>`;
                htmlContent += `<div class="content">`;
                // 遍歷 `true`（完成） 和 `false`（未完成）
                Object.keys(groupedTasks[category][date]).forEach(status => {
                    let isCompleted = status === "true"; // 轉換為布林值
                    let itemClass = isCompleted ? "completed" : "pending"; // 設定不同的 CSS 類別

                    groupedTasks[category][date][status].forEach((task, index) => {
                        htmlContent += `<div class="text-content ${itemClass}">${index + 1}. ${task}</div>`;
                    });
                });

                htmlContent += `<div class="actions">
                <i class="fa-regular fa-heart"></i> ${this.randomview()} 
                <i class="fa-regular fa-comment"></i> ${this.randomview()} 
                <i class="fa-solid fa-repeat"></i> ${this.randomview()}
                </div>`;
                htmlContent += `</div>`;
                htmlContent += `</div>`;
            });
        });
                
            htmlContent += `</div></div></body></html>`;
            return htmlContent;

        },
        randomview(){
            // 生成 0 到 100 之間的隨機整數
            return Math.floor(Math.random() * 101);
        },
        viewopen(template ,text){
            try{
                const newTab = window.open();
                if (newTab) {
                    newTab.document.write(template);
                    newTab.document.close();
                } else {
                    notyf_warning.open({
                        type: 'warning',
                        message: '請允許彈出視窗以顯示 ${text}!'
                    });
                }
            } catch (error) {
                console.error('View failed:', error);
                Common.errorNotyftMessage([`Failed to view ${text} file`,`無法檢視 ${text} 文件`]);
            }
        },
        viewAs(format) {
            Common.successNotyftMessage([`Viewing as ${format.toUpperCase()}`,`檢視 ${format.toUpperCase()} 文件`]);
            if(format === 'json'){
                const jsonString = JSON.stringify(this.taskList, null, 2);
                const template = `${template_s}<pre>${jsonString}</pre>${template_e}`;
                this.viewopen(template ,format)
            }else if (format === 'html') {
                let htmlContent = this.html();
                this.viewopen(htmlContent ,format)
            }
        },
        exportfile(template ,text ,type){
            try {
                const blob = new Blob([template], { type: type });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `task_${Common.getTodayDate()}.${text}`;
                link.click();
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 1000);
            } catch (error) {
                console.error('Export failed:', error);
                Common.errorNotyftMessage([`Failed to export ${text} file`,`無法輸出成 ${text} 文件`]);
            }
        },
        exportAs(format) {
            Common.successNotyftMessage([`Exporting as ${format.toUpperCase()}`,`輸出成 ${format.toUpperCase()} 格式`]);
            
            if(format === 'json'){
                const jsonString = JSON.stringify(this.taskList, null, 2);
                this.exportfile(jsonString ,format , "application/json");

            }else if (format === 'html') {
                let htmlContent = this.html();
                this.exportfile(htmlContent ,format , "text/html");
            }
        },
    },
    setup() {
        // 切換 isBars 狀態
        const dropdownviewHeader = Vue.ref(false);
        
        const toggleBars = () => {
            dropdownviewHeader.value = !dropdownviewHeader.value; // true <-> false
        };
        
        const dropdownviewExport = Vue.ref(false);
        
        const toggleDropdown = () => {
            dropdownviewExport.value = !dropdownviewExport.value; // true <-> false
        };

        return { 
            toggleBars, dropdownviewHeader, 
            toggleDropdown, dropdownviewExport
        };
    }
};

(function() {
    emailjs.init("un2nCxSnYlqZWdgMG");
})();
let template_s = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Task List Export</title><link rel="icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><link rel="shortcut icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><style>body{font-family:Arial,sans-serif;background-color:#1e1e1e;padding:20px;display:flex;flex-direction:column;align-items:center;color:#e0e0e0;transition:background .3s,color .3s}.container{width:100%;max-width:600px;display:flex;flex-direction:column;height:90vh}.log-container{flex-grow:1;overflow-y:auto;padding-top:10px}.log-entry{word-wrap: break-word;background:#2c2c2c;padding:15px;margin:10px 0;border-radius:10px;box-shadow:0 2px 5px rgba(0,0,0,.3);border-left:5px solid ;white-space:pre-line;color:#e0e0e0;transition:background .3s,color .3s}.log-title{font-size:18px;font-weight:700;margin-bottom:5px;color:#fff}.timestamp{font-size:14px;font-weight:700;color:#a0a0a0;display:block;margin-top:5px}a{color:#fff}.light-mode a{color:#1e1e1e}.light-mode{background-color:#414242;color:#333;margin-bottom:10px}.light-mode .log-entry{background:#fff;color:#333;border-left:5px solid ;box-shadow:0 2px 5px rgba(0,0,0,.1)}.light-mode .log-title{color:#222}.light-mode .timestamp{color:gray}.switch-container{display:flex;align-items:center;justify-content:center}.switch-label{font-size:16px;margin-left:10px}.switch{position:relative;display:inline-block;width:50px;height:25px}.switch input{opacity:0;width:0;height:0}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:25px}.slider:before{position:absolute;content:"";height:17px;width:17px;left:4px;bottom:4px;background-color:#fff;transition:.4s;border-radius:50%}input:checked+.slider{background-color:#1da1f2}input:checked+.slider:before{transform:translateX(24px)} pre{white-space: pre-wrap; /* 保留換行並自動換行 */ word-wrap: break-word; /* 讓長單詞換行 */}.light-mode pre{color:#fff;}</style></head><body><div id="app" class="container">`;
let template_e = `</div></body></html>`;

createApp({
    components: { 'dropdown-menu-header': DropdownMenuHeader 
    },
    setup() {

        const isLight = ref(true);
        watch(isLight, (newVal) => {
            if (!newVal) {
               document.body.classList.add('light-mode');
               localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'light');
            }
        });

        const isAllTasklist = ref(true);
        watch(isAllTasklist, (newVal) => {
            // console.log("isAllTasklist 变更为:", newVal);
        });

        const isCategoryTasklist = ref(false);
        watch(isCategoryTasklist, (newVal) => {
            // console.log("isCategoryTasklist 变更为:", newVal);
        });

        const isCategoryArchiveTasklist = ref(false);
        watch(isCategoryArchiveTasklist, (newVal) => {
            // console.log("isCategoryArchiveTasklist 变更为:", newVal);
        });

        const isSendEmail = ref(false);
        const formData = ref({
            to_email: '',
            from_name: '',
            message: '',
            pageTitle: '',
            currentURL: '',
        });

        watch(isSendEmail, (newVal) => {
            console.log("isSendEmail 变更为:", newVal);
           if (!newVal) {
                formData.value = {  // 不能用 `this.formData`，要用 `formData.value`
                    pageTitle: '',
                    currentURL: '',
                    to_email: '',
                    from_name: '',
                    message: ''
                };
            }
        });

        const isCategoryVisible = ref(false);
        watch(isCategoryVisible, (newVal) => {
            // console.log("isCategoryVisible 变更为:", newVal);
        });

        const isImport = ref(false);
        watch(isImport, (newVal) => {
            // console.log("isImport 变更为:", newVal);
        });

        const isTaskVisible = ref(false);
        watch(isTaskVisible, (newVal) => {
            // console.log("isTaskVisible 变更为:", newVal);
        });

        const isEdit = ref(false);
        watch(isEdit, (newVal) => {
            // console.log("isEdit 变更为:", newVal);
        });

        return { isLight, isAllTasklist, isCategoryTasklist, isCategoryArchiveTasklist, isSendEmail, formData, isCategoryVisible, isImport, isTaskVisible, isEdit };
    },
    data() {
        return {
            viewCategory: "",
            newCategory: "",
            selectedCategory: "",
            newTask: { text: "", date: Common.getTodayDate(), opend: false, urgent: false, archive: false},
            taskList: JSON.parse(localStorage.getItem("tasks")) || {"default":[]},
            expandedCategories: [],
            formData: {
                to_email: '',
                from_name: '',
                message: '',
                pageTitle: '',
                currentURL: '',
            },
            status: '',
            sending: false,
            isError: false,
            isLoading: false,
            selectedFile: null, // 用來儲存選擇的檔案
            categoryKey: 0,
            isLight: false,
            isAllTasklist: false,
            dropdownviewTask: false,
            isSendEmail: false,
            isCategoryVisible: false,
            isImport: false,
            isTaskVisible: false,
            isCategoryTasklist: false,
            isCategoryArchiveTasklist: false,
            dropdownviewTask: {},
            isEdit: false,
            language: store.language,
        };
    },
    mounted() {
        this.resetAllTaskbars();
    },
    computed: {
        isListVisible() {
            return Object.keys(this.taskList).length > 0; 
        },
        archivedTaskCount() {
            return (category) => {
            return this.taskList[category].filter(task => task.archive).length;
            };
        },
        urgentTaskCount() {
            return (category) => {
            return this.taskList[category].filter(task => task.urgent).length;
            };
        }
    },
    methods: {
        handleUpdate(newData) {
            // console.log(newData)
            this.isAllTasklist = newData.isAllTasklist;
            this.isCategoryTasklist = newData.isCategoryTasklist;
            this.isCategoryArchiveTasklist = newData.isCategoryArchiveTasklist;
            this.isSendEmail = newData.isSendEmail;
            this.isCategoryVisible = newData.isCategoryVisible;
            this.isImport = newData.isImport;
            this.isTaskVisible = newData.isTaskVisible;
            this.isEdit = newData.isEdit;
        },
        handleSubmit() {
            this.sending = true;
            this.status = 'Sending...';
            this.isError = false;
            this.formData.pageTitle = document.title;
            this.formData.currentURL = window.location.href;

            emailjs.send(
                "service_qzarp8m",
                "template_f3pkjrv",
                this.formData
            ).then(
                (response) => {
                    this.status = 'Sending successfully!';
                    this.sending = false;
                    this.formData = {
                        pageTitle: '',
                        currentURL: '',
                        to_email: '',
                        from_name: '',
                        message: ''
                    };
                },
                (error) => {
                    this.status = 'Sending error ,try later...';
                    this.isError = true;
                    this.sending = false;
                    console.error('error:', error);
                }
            );
        },
        handleFileChange(event) {
            this.selectedFile = event.target.files[0]; // 存入 data
        },
        handleFileUpload(type){
            const file = this.selectedFile;
            if (!file){
                Common.warningNotyftMessageCheckData([`Please select the file first!`,`請選擇要匯入的檔案!`]);
            }

            const fileName = file.name; // 獲取檔名
            const match = fileName.match(/^task_\d{4}-\d{2}-\d{2}\.json$/);

            if (!match) {
                Common.errorNotyftMessage([`Failed to import ,please check your file format!`,`可能是檔名或是檔案內容格式有誤!`]);
            }

            const extension = fileName.substring(fileName.lastIndexOf(".") + 1);
            
            // 檔案格式必須為 json
            if (extension !== "json") {
                Common.errorNotyftMessage([`Failed to import ${extension} file!`,`不是 ${extension} 格式的檔案!`]);
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    if(type === 'overwrite'){
                        localStorage.setItem("tasks", JSON.stringify(json));
                        Common.successNotyftMessage([`Coverage completed and reorganizing in progress...`,`資料覆蓋已完成，重組中請稍等...`]);
                        this.isLoading = true;
                    }else if(type === 'append'){
                        Common.warningNotyftMessageCheckData(['Not Working yet!','這個功能還沒搞!']);
                        // notyf.success("Adding completed Reorganizing in progress...");
                        // this.isLoading = true;
                    }
                } catch (error) {
                    console.error('Import failed:', error);
                    notyf.error("Failed to import!");
                }
            };
            reader.readAsText(file);

            setTimeout(() => {
                this.isImport = false;
                this.isLoading = false;
                window.location.href = window.location.href;
                // this.categoryKey.value += 1; // 改變 key 來強制 Vue 重新渲染
            }, 3000);

        },
        //Category
        saveCategory() {
            if(this.taskList[this.newCategory]){
                Common.warningNotyftMessageCheckData([`'${this.newCategory}' this category is repeat!`,`'${this.newCategory}' 這個類別重複!`]);
            }

            if (!this.newCategory.trim()) {
                Common.warningNotyftMessageCheckData([`Please input your category name!`,`請輸入你的類別名稱!`]);
            }

            if (this.newCategory.trim() && !this.taskList[this.newCategory]) {
                /*
                this.taskList[this.newCategory] = {
                    "_items": {}  // 預設 _items 為空物件（或空陣列 [] 取決於你的需求）
                }; // Vue 3 不需要 $set
                */
                this.taskList[this.newCategory] = [];
                this.newCategory = "";
                this.saveTasks();
                this.isCategoryVisible = false;
                this.isAllTasklist = true;
            }
        },
        saveCategoryWithSub() { // todo: category has sub
            if(!this.selectedCategory){
                if(this.taskList[this.newCategory]){
                    Common.errorNotyftMessage([`'${this.newCategory}' this category is repeat!`,`'${this.newCategory}' 這個類別重複!`]);
                }

                if (!this.newCategory.trim()) {
                    Common.warningNotyftMessageCheckData([`Please input your category name!`,`請輸入你的類別名稱!`]);
                }

                if (this.newCategory.trim() && !this.taskList[this.newCategory]) {
                    /*
                    this.taskList[this.newCategory] = {
                        "_items": {}  // 預設 _items 為空物件（或空陣列 [] 取決於你的需求）
                    }; // Vue 3 不需要 $set
                    */
                    this.taskList[this.newCategory] = [];
                    this.newCategory = "";
                    this.saveTasks();
                    this.isCategoryVisible = false;
                    this.isAllTasklist = true;
                }
                // 子項目
            }else{
                // console.log('Adding subcategory:', this.newCategory, 'to category:', this.selectedCategory);
                // console.log('Current taskList:', JSON.stringify(this.taskList));

                // Ensure taskList is an object
                if (typeof this.taskList !== 'object' || this.taskList === null) {
                    this.taskList = {};
                }

                // Ensure the selected category exists and is an object
                if (!this.taskList[this.selectedCategory] || typeof this.taskList[this.selectedCategory] !== 'object') {
                    this.taskList[this.selectedCategory] = {};
                }

                // T1現在是陣列，可以新增一個帶有category標記的項目
                // this.taskList[this.selectedCategory].push({
                //     text: this.newCategory,
                //     parentCategory: this.selectedCategory,
                //     date: Common.getTodayDate(),
                //     timestamp: Date.now(),
                //     opend: false
                // });

                // Check if subcategory already exists
                if (this.taskList[this.selectedCategory][this.newCategory]) {
                    notyf.error("Sub category is repeat!");
                    return; // Exit the function to prevent further execution
                }

                // Add the new subcategory
                // console.log("Updated taskList:", JSON.stringify(this.taskList));

                // Reset and save
                this.newCategory = "";
                this.saveTasks();
            }
        },
        toggleCategory(category) {
            // console.log('(this.taskList[category].length,'+this.taskList[category].length);
            const archive = this.taskList[category].filter(task => task.archive).length;
            // todo: alltask - archive = 0 jump to add task div
            if(this.taskList[category].length - archive === 0 && !this.isCategoryVisible){
                if (Common.windowConfirm([`No tasks available. Do you want to add a new task in '${category}'?`,`沒有可用任務，你想要新增任務到 '${category}' 這個類別中嗎?`])) {
                    Common.successNotyftMessage([`Please add a new task!`,`請新增一項任務!`]);
                    this.isAllTasklist = false;
                    this.isTaskVisible = true;
                    this.selectedCategory = category;
                }

            }
            const index = this.expandedCategories.indexOf(category);
            if (index === -1) {
                this.expandedCategories.push(category);
            } else {
                this.expandedCategories.splice(index, 1);
            }
            // console.log('expandedCategories:'+this.expandedCategories)
        },
        removeCategory(category) {
            if (this.taskList[category] && this.taskList[category].length > 0) {
                Common.warningNotyftMessageCheckData([`Cannot delete '${category}' because it still has tasks.`,`你無法刪除 '${category}' 這個類別，因為裡面還有任務`]);
                return;
            }
            // todo: check bf remove
            if (Common.windowConfirm([`Are you sure you want to delete '${category}'?`,`你確定要刪除 '${category}' 這個類別嗎?`])) {
                delete this.taskList[category];
                this.expandedCategories = this.expandedCategories.filter(c => c !== category);
                this.saveTasks();
                Common.successNotyftMessage([`Successfully deleted '${category}' permanently.`,`已經永久刪除 '${category}'`]);
            }
        },
        
        archiveCategory(category){
            Common.warningNotyftMessageCheckData(['Not Working yet!','這個功能還沒搞!']);
        },
        renameCategory(category){
            Common.warningNotyftMessageCheckData(['Not Working yet!','這個功能還沒搞!']);
        },
        viewCategoryTasklist(category){
            this.isCategoryVisible = false;
            this.isCategoryArchiveTasklist = false;
            this.isAllTasklist = false;
            this.viewCategory = category;
            this.isCategoryTasklist = true;
        },
        viewCategoryArchiveTasklist(category){
            this.isCategoryVisible = false;
            this.isAllTasklist = false;
            this.isCategoryTasklist = false;
            this.viewCategory = category;
            this.isCategoryArchiveTasklist = true;
        },
        //task
        taskIndex(category, timestamp){
            const taskIndex = this.taskList[category].findIndex(task => task.timestamp === timestamp);
            if (taskIndex === -1) return; // 如果找不到，直接 return
            return taskIndex;
        },
        toggleTaskbars(category, timestamp) {
            // console.log('category,',category,' ,newTask.timestamp',timestamp)
            
            const taskIndex = this.taskIndex(category, timestamp);
            // console.log('taskIndex,',taskIndex)
            // 只開啟當前點擊的 task
            this.taskList[category][taskIndex].opend = !this.taskList[category][taskIndex].opend;
            this.saveTasks();
            // 更新 dropdownviewTask 狀態
            this.dropdownviewTask[taskIndex] = this.taskList[category][taskIndex].opend;
        },
        resetAllTaskbars() {
            Object.keys(this.taskList).forEach(category => {
                this.taskList[category].forEach(task => {
                    task.opend = false;
                });
            });
            this.saveTasks();
        },
        saveTasks() {
            localStorage.setItem("tasks", JSON.stringify(this.taskList));
        },
        addTask() {
            
            const category = this.selectedCategory;
            if (!category) {
                Common.warningNotyftMessageCheckData(['Please select your category!','請先選擇類別!']);
            }else if (!this.newTask.date) {
                Common.warningNotyftMessageCheckData(['Please select your date!','請選擇日期!']);
            }else if (!this.newTask.text.trim()) {
                Common.warningNotyftMessageCheckData(['Please input your task content!','請輸入任務內容!']);
            }

            if (!category || !this.newTask.text.trim() || !this.newTask.date) return;

            if(this.isEdit){
                try{
                    const taskIndex = this.taskIndex(category, this.newTask.timestamp);
                    this.taskList[category][taskIndex].text = this.newTask.text;
                    this.taskList[category][taskIndex].date = this.newTask.date;
                    this.taskList[category][taskIndex].updatetime = Date.now();
                    this.saveTasks();
                    Common.successNotyftMessage(['Edit task successfully!','已修改任務內容!']);
                    this.isEdit = false;
                    this.isAllTasklist = true;
                }catch{
                    notyf.error("Edit task error!");
                }
            }else{
                // 加入 timestamp 確保唯一性
                const newTask = {
                    ...this.newTask,
                    timestamp: Date.now(), // 加上唯一時間戳
                    updatetime: Date.now(), 
                };
                this.taskList[category].push(newTask);
                
                this.saveTasks();
                Common.successNotyftMessage(['Add task successfully!','已新增一項任務!']);
                this.isTaskVisible = false;
                this.isAllTasklist = true;
                // 展開
                this.toggleCategory(category) ;
                // this.toggleTaskbars(category, newTask.timestamp);
            }

            this.selectedCategory = '';
            this.newTask.text = "";
            this.newTask.date = Common.getTodayDate();
        
        },
        editTask(category, task) {
            this.isAllTasklist = false;
            this.isCategoryTasklist = false;
            this.isEdit = true;
            this.selectedCategory = category;
            this.newTask.date = task.date;
            this.newTask.text = task.text;
            this.newTask.timestamp = task.timestamp;
            this.toggleTaskbars(category, task.timestamp);
            Common.successNotyftMessage(['Edit your task content!','請修改任務內容!']);
        },
        copyTask(text) {
            navigator.clipboard.writeText(text.trim())
                .then(() => notyf.success("Copy success task text successfully!"))
                .catch(err => console.error("Copy error!", err));
        },
        checkTask(category, timestamp) {
            const taskIndex = this.taskIndex(category, timestamp);
            this.taskList[category][taskIndex].completed = !this.taskList[category][taskIndex].completed;
            this.taskList[category][taskIndex].urgent = false;
            this.saveTasks();
            if(this.taskList[category][taskIndex].completed){
                Common.playSoundtrack('../soundtrack/pokemon-black-and-white-ost-disc-3-mission-success.mp3');
                Common.successNotyftMessage(['Finish task successfully 777!','順利完成任務777!']);
            }else{
                Common.playSoundtrack('../soundtrack/bushhhhhhhhhhhhhh.mp3');
                Common.successNotyftMessage(['Cancel finish task successfully!','重啟任務!']);
            }
        },
        archiveTask(category, timestamp)  {
            const taskIndex = this.taskIndex(category, timestamp);
            // console.log('taskIndex,',taskIndex)
            this.taskList[category][taskIndex].archive = !this.taskList[category][taskIndex].archive;
            this.saveTasks();
            if(this.taskList[category][taskIndex].archive){
                Common.successNotyftMessage(['Archive task successfully!','已將任務封存!']);
            }else{
                Common.successNotyftMessage(['Cancel archive task successfully!','取消任務封存!']);
            }
        },
        setUrgentTask(category, timestamp) {
            const taskIndex = this.taskIndex(category, timestamp);
            if(!this.taskList[category][taskIndex].completed){
                this.taskList[category][taskIndex].urgent = !this.taskList[category][taskIndex].urgent;
                this.saveTasks();
                if(this.taskList[category][taskIndex].urgent){
                    Common.successNotyftMessage(['Urgent task successfully!','已將任務狀態設置為緊急!']);
                }
            }else{
                Common.warningNotyftMessageCheckData(['You cannot set urgent cause this task is already finish!','無法將任務設置為緊急因為任務已經結束!']);
            }
        },
        removeTask(category, timestamp, text) {
            if (Common.windowConfirm([`Are you sure you want to delete '${text}'?`,`你確定要刪除'${text}'嗎?`])) {
                this.toggleTaskbars(category, timestamp);
                this.taskList[category] = this.taskList[category].filter(task => task.timestamp !== timestamp);
                this.saveTasks();
                Common.successNotyftMessage([`Successfully deleted '${text}' permanently.`,`已經永久刪除 '${text}'`]);
            }
            // setTimeout(() => {
            //     if (this.taskList[category].length === 0) {
            //         const userConfirmed2 = window.confirm(`No tasks available. Do you want to delete '${category}'?`);
            //         if (userConfirmed2) {
            //             this.removeCategory(category);
            //         }
            //     }
            // }, 2000);
        },
        sortedTasksASC(tasks) {
            return tasks.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
        },
        sortedTasksDESC(tasks) {
            return tasks.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
        },
        sortedTasksDESCategory(tasks) {
            try {
                if (!tasks) return [];
                return tasks.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
            } catch (error) {
                console.error(error);
            }
        },
    }
}).mount('#app');
