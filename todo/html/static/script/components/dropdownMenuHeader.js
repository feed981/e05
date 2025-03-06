const template_s = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Task List Export</title><link rel="icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><link rel="shortcut icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><style>body{font-family:Arial,sans-serif;background-color:#1e1e1e;padding:20px;display:flex;flex-direction:column;align-items:center;color:#e0e0e0;transition:background .3s,color .3s}.container{width:100%;max-width:600px;display:flex;flex-direction:column;height:90vh}.log-container{flex-grow:1;overflow-y:auto;padding-top:10px}.log-entry{word-wrap: break-word;background:#2c2c2c;padding:15px;margin:10px 0;border-radius:10px;box-shadow:0 2px 5px rgba(0,0,0,.3);border-left:5px solid ;white-space:pre-line;color:#e0e0e0;transition:background .3s,color .3s}.log-title{font-size:18px;font-weight:700;margin-bottom:5px;color:#fff}.timestamp{font-size:14px;font-weight:700;color:#a0a0a0;display:block;margin-top:5px}a{color:#fff}.light-mode a{color:#1e1e1e}.light-mode{background-color:#414242;color:#333;margin-bottom:10px}.light-mode .log-entry{background:#fff;color:#333;border-left:5px solid ;box-shadow:0 2px 5px rgba(0,0,0,.1)}.light-mode .log-title{color:#222}.light-mode .timestamp{color:gray}.switch-container{display:flex;align-items:center;justify-content:center}.switch-label{font-size:16px;margin-left:10px}.switch{position:relative;display:inline-block;width:50px;height:25px}.switch input{opacity:0;width:0;height:0}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:25px}.slider:before{position:absolute;content:"";height:17px;width:17px;left:4px;bottom:4px;background-color:#fff;transition:.4s;border-radius:50%}input:checked+.slider{background-color:#1da1f2}input:checked+.slider:before{transform:translateX(24px)} pre{white-space: pre-wrap; /* 保留換行並自動換行 */ word-wrap: break-word; /* 讓長單詞換行 */}.light-mode pre{color:#fff;}</style></head><body><div id="app" class="container">`;
const template_e = `</div></body></html>`;

const DropdownMenuHeader = {
    props: ['isQrcode','isLight','isAllTasklist','isCategoryTasklist','isCategoryArchiveTasklist','isSendEmail','isCategoryVisible','isImport','isTaskVisible','isEdit','formData'],  // 接收父组件的值
    emits: ['update:isQrcode','update:isLight','update:isAllTasklist','update:isCategoryTasklist','update:isCategoryArchiveTasklist','update:isSendEmail','update:isCategoryVisible','update:isImport','update:isTaskVisible','update:isEdit','update:formData'],  // 允许子组件更新父组件

    template: `
<div class="header-container"><div class="hamburger"><div class="dropdown"><svg class="vbp-header-menu-button__svg" @click="toggleBars" :class="{ 'header-opend': this.dropdownviewHeader }"><line x1="0" y1="50%" x2="100%" y2="50%" class="top" shape-rendering="crispEdges"/><line x1="0" y1="50%" x2="100%" y2="50%" class="middle" shape-rendering="crispEdges"/><line x1="0" y1="50%" x2="100%" y2="50%" class="bottom" shape-rendering="crispEdges"/></svg><ul v-show="dropdownviewHeader" class="dropdown-menu bars"><li v-if="!isQrcode" @click="otherpage('isQrcode')"><i class="font-awesome-i fa-solid fa-qrcode"></i><span>|　QR-Code</span></li><li v-if="isLight" @click="toggleLight(fasle)"><i class="font-awesome-i fa-solid fa-toggle-on"></i><span>|　Toggle dark-mode</span></li><li v-if="!isLight" @click="toggleLight(true)"><i class="font-awesome-i fa-solid fa-toggle-off"></i><span>|　Toggle light-mode</span></li><li v-if="!isSendEmail" @click="otherpage('isSendEmail')"><i class="font-awesome-i fa-solid fa-envelope"></i><span>|　Feedback</span></li><li v-if="!isSendEmail" @click="resetdata()"><i class="font-awesome-i fa-solid fa-toilet-paper"></i><span>|　Clear all data</span></li><li v-if="!isSendEmail" class="dropdown" @click="toggleDropdown"><i class="font-awesome-i fa-solid fa-file-export"></i><span>|　View / Import / Export</span><ul v-show="dropdownviewExport" class="dropdown-menu dropdown-menu-sub"><li @click="viewAs('json')"><i class="font-awesome-i fa-solid fa-eye"></i>|　View as JSON</li><li @click="viewAs('html')"><i class="font-awesome-i fa-solid fa-eye"></i>|　View as HTML</li><li @click="otherpage('isImport')"><i class="font-awesome-i fa-solid fa-file-import"></i>|　Import as JSON</li><li @click="exportAs('json')"><i class="font-awesome-i fa-solid fa-file-export"></i>|　Export as JSON</li><li @click="exportAs('html')"><i class="font-awesome-i fa-solid fa-file-export"></i>|　Export as HTML</li><li @click="dropdownviewExport = true"><i class="font-awesome-i fa-solid fa-xmark"></i>|　Close the menu</li></ul></li><li v-if="!isSendEmail && !isCategoryVisible && !isImport" @click="otherpage('isCategoryVisible')"><i class="font-awesome-i fa-solid fa-icons"></i><span>|　Add new category</span></li><li v-if="!isSendEmail && !isImport && !isTaskVisible" @click="otherpage('isTaskVisible')"><i class="font-awesome-i fa-solid fa-list-check"></i><span>|　Add new task</span></li><li @click="otherpage('isAllTasklist')" v-if="!isAllTasklist || isQrcode || isCategoryTasklist || isCategoryArchiveTasklist || isSendEmail || isCategoryVisible || isImport || isTaskVisible || isEdit"><i class="font-awesome-i fa-solid fa-arrow-left"></i><span>|　Pre page</span></li></ul></div></div><div title="Close this page and go back to alltasklist!" class="closeicon" v-if="!isAllTasklist || isQrcode || isCategoryTasklist || isCategoryArchiveTasklist || isSendEmail || isCategoryVisible || isImport || isTaskVisible || isEdit"><i @click="otherpage('isAllTasklist')" class="font-awesome-i fa-regular fa-circle-xmark"></i></div></div>
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
            if(soundtrack !== undefined){//ds_ringtone_mail-mp3
                window.Common.playSoundtrack(`${store.cloudfrontsoundtrack}${soundtrack}.mp3`);
            }
            if(activeKey === 'isTaskVisible'){
                window.Common.successNotyftMessage([`Please add a new task!`,`請新增一項任務!`]);
            }else if(activeKey === 'isCategoryVisible'){
                window.Common.successNotyftMessage([`Please add a new category!`,`請新增一個類別!`]);
            }
            this.setIsWithOptions(activeKey);
        },
        
        toggleLight(isLight){
            if(isLight){
                window.Common.playSoundtrack(`${store.cloudfrontsoundtrack}hellodarknessmyoldfriend.mp3`);
            }
            this.$emit('update:isLight', isLight );
        },
        resetdata(){
            if (window.Common.windowConfirm([`Are you sure you want to clear all the data ?`,`你確定要刪除所有數據嗎?`])) {
                window.Common.playSoundtrack(`${store.cloudfrontsoundtrack}matt-hardy-delete-delete-delete.mp3`);
                localStorage.setItem("tasks" ,'{"default":[]}')
                window.Common.successNotyftMessage([`Deleting data, please wait...`,`刪除數據中請稍後`]);
                
                setTimeout(() => {
                    this.dropdownviewHeader = false;
                }, 2000);

                setTimeout(() => {
                    window.Common.successNotyftMessage([`Successfully clear permanently...`,`永久刪除所有數據`]);
                }, 4000);

                setTimeout(() => {
                    window.location.reload();
                }, 10000);
            }
        },
        html(){

            let htmlContent = `
            <!DOCTYPE html><html><head><meta charset="UTF-8"><title>Export tasklist 2 html</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=BhuTuka+Expanded+One&family=Indie+Flower&family=Metamorphous&family=Smooch+Sans:wght@100..900&family=Vujahday+Script&family=Wire+One&display=swap" rel="stylesheet"><link rel="icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><link rel="shortcut icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"><style>body{display:flex;justify-content:center;align-items:center;height:100vh;background-color:#121212;font-family:Arial,sans-serif;color:#fff;margin:0;overflow:hidden}.container{width:400px;max-height:80vh;overflow-y:auto;padding:10px;scrollbar-width:thin;scrollbar-color:#888 #222}.container::-webkit-scrollbar{width:8px}.container::-webkit-scrollbar-track{background:#222}.container::-webkit-scrollbar-thumb{background:#888;border-radius:4px}.post{background:#222;padding:15px;margin:10px 0;border-radius:10px}.user{font-weight:700}.time{color:gray;font-size:12px}.content{margin-top:5px}.actions{display:flex;gap:10px;margin-top:10px;color:gray}</style></head><body><div class="container">
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
                window.Common.errorNotyftMessage([`Failed to view ${text} file`,`無法檢視 ${text} 文件`]);
            }
        },
        viewAs(format) {
            window.Common.successNotyftMessage([`Viewing as ${format.toUpperCase()}`,`檢視 ${format.toUpperCase()} 文件`]);
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
                link.download = `task_${window.Common.getTodayDate()}.${text}`;
                link.click();
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 1000);
            } catch (error) {
                console.error('Export failed:', error);
                window.Common.errorNotyftMessage([`Failed to export ${text} file`,`無法輸出成 ${text} 文件`]);
            }
        },
        exportAs(format) {
            window.Common.successNotyftMessage([`Exporting as ${format.toUpperCase()}`,`輸出成 ${format.toUpperCase()} 格式`]);
            
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


// 註冊全局組件
window.DropdownMenuHeader = DropdownMenuHeader;