const { createApp, ref ,watch } = Vue;

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
    getTodayDate() {
        const today = new Date();
        return today.toISOString().split("T")[0]; // 轉成 YYYY-MM-DD 格式
    },
};

const DropdownMenuHeader = {
    props: ['isLight','isAllTasklist','isCategoryTasklist','isCategoryArchiveTasklist','isSendEmail','isCategoryVisible','isImport','isTaskVisible','isEdit','formData'],  // 接收父组件的值
    emits: ['update:isLight','update:isAllTasklist','update:isCategoryTasklist','update:isCategoryArchiveTasklist','update:isSendEmail','update:isCategoryVisible','update:isImport','update:isTaskVisible','update:isEdit','update:formData'],  // 允许子组件更新父组件

    template: `
<div class="header-container"><div class="hamburger"><div class="dropdown"><svg class="vbp-header-menu-button__svg" @click="toggleBars" :class="{ 'header-opend': this.dropdownviewHeader }"><line x1="0" y1="50%" x2="100%" y2="50%" class="top" shape-rendering="crispEdges"/><line x1="0" y1="50%" x2="100%" y2="50%" class="middle" shape-rendering="crispEdges"/><line x1="0" y1="50%" x2="100%" y2="50%" class="bottom" shape-rendering="crispEdges"/></svg><ul v-show="dropdownviewHeader" class="dropdown-menu bars"><li v-if="isLight" @click="$emit('update:isLight', false )"><i class="font-awesome-i fa-solid fa-toggle-on"></i><span>|　Toggle dark-mode</span></li><li v-if="!isLight" @click="$emit('update:isLight', true )"><i class="font-awesome-i fa-solid fa-toggle-off"></i><span>|　Toggle light-mode</span></li><li v-if="!isSendEmail" @click="$emit('update:formData', {  isAllTasklist: false, isCategoryTasklist: false, isCategoryArchiveTasklist: false, isSendEmail: true, isCategoryVisible: false, isImport: false, isTaskVisible: false, isEdit: false })"><i class="font-awesome-i fa-solid fa-envelope"></i><span>|　Feedback</span></li><li v-if="!isSendEmail" @click="resetdata()"><i class="font-awesome-i fa-solid fa-toilet-paper"></i><span>|　Clear all data</span></li><li v-if="!isSendEmail" class="dropdown" @click="toggleDropdown"><i class="font-awesome-i fa-solid fa-file-export"></i><span>|　View / Import / Export</span><ul v-show="dropdownviewExport" class="dropdown-menu dropdown-menu-sub"><li @click="viewAs('json')"><i class="font-awesome-i fa-solid fa-eye"></i>|　View as JSON</li><li @click="viewAs('html')"><i class="font-awesome-i fa-solid fa-eye"></i>|　View as HTML</li><li @click="$emit('update:formData', { isAllTasklist: false, isCategoryTasklist: false, isCategoryArchiveTasklist: false, isSendEmail: false, isCategoryVisible: false, isImport: true, isTaskVisible: false, isEdit: false })"><i class="font-awesome-i fa-solid fa-file-import"></i>|　Import as JSON</li><li @click="exportAs('json')"><i class="font-awesome-i fa-solid fa-file-export"></i>|　Export as JSON</li><li @click="exportAs('html')"><i class="font-awesome-i fa-solid fa-file-export"></i>|　Export as HTML</li><li @click="dropdownviewExport = true"><i class="font-awesome-i fa-solid fa-xmark"></i>|　Close the menu</li></ul></li><li v-if="!isSendEmail && !isCategoryVisible && !isImport" @click="$emit('update:formData', {  isAllTasklist: false, isCategoryTasklist: false, isCategoryArchiveTasklist: false, isSendEmail: false, isCategoryVisible: true, isImport: false, isTaskVisible: false, isEdit: false })"><i class="font-awesome-i fa-solid fa-icons"></i><span>|　Add new category</span></li><li v-if="!isSendEmail && !isImport && !isTaskVisible" @click="$emit('update:formData', {  isAllTasklist: false, isCategoryTasklist: false, isCategoryArchiveTasklist: false, isSendEmail: false, isCategoryVisible: false, isImport: false, isTaskVisible: true, isEdit: false })"><i class="font-awesome-i fa-solid fa-list-check"></i><span>|　Add new task</span></li><li v-if="isAllTasklist || isCategoryArchiveTasklist || isCategoryTasklist || isSendEmail || isCategoryVisible || isImport || isTaskVisible || isEdit" @click="$emit('update:formData', { isAllTasklist: true, isCategoryTasklist: false, isCategoryArchiveTasklist: false, isSendEmail: false, isCategoryVisible: false, isImport: false, isTaskVisible: false, isEdit: false })"><i class="font-awesome-i fa-solid fa-arrow-left"></i><span>|　Pre page</span></li></ul></div></div><div title="Close this page and go back to alltasklist!" v-if="isCategoryTasklist || isCategoryArchiveTasklist || isSendEmail || isCategoryVisible || isImport || isTaskVisible || isEdit" class="closeicon"><i @click="$emit('update:formData', { isAllTasklist: true, isCategoryArchiveTasklist: false, isSendEmail: false, isCategoryVisible: false, isImport: false, isTaskVisible: false, isEdit: false })" class="font-awesome-i fa-regular fa-circle-xmark"></i></div></div>
    `,
    data() {
        return {
            selectedCategory: "",
            dropdownviewHeader: false,
            taskList: JSON.parse(localStorage.getItem("tasks")) || {"default":[]},
        };
    },
    methods:{
        resetdata(){
            const userConfirmed = window.confirm(`Are you sure you want to clear all the data ?`);
            if (userConfirmed) {
                localStorage.setItem("tasks" ,'{"default":[]}')
                window.location.reload();
                notyf.success(`Successfully clear permanently.`);
            }
        },
        html(){

            let htmlContent = `
<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Task List Export</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=BhuTuka+Expanded+One&family=Indie+Flower&family=Metamorphous&family=Smooch+Sans:wght@100..900&family=Vujahday+Script&family=Wire+One&display=swap" rel="stylesheet"><link rel="icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><link rel="shortcut icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><style>body{font-family:"BhuTuka Expanded One",serif;background-color:#1e1e1e;display:flex;justify-content:center;align-items:center}.container{width:100%;flex-direction:column;height:90vh}.log-container{overflow-y:auto;overflow-x:hidden;flex-grow:1;overflow-y:auto;padding-top:10px}.log-entry{justify-content:center;word-wrap:break-word;padding:15px;border-radius:10px;box-shadow:rgba(0,0,0,.17) 0 -23px 25px 0 inset,rgba(0,0,0,.15) 0 -36px 30px 0 inset,rgba(0,0,0,.1) 0 -79px 40px 0 inset,rgba(0,0,0,.06) 0 2px 1px,rgba(0,0,0,.09) 0 4px 2px,rgba(0,0,0,.09) 0 8px 4px,rgba(0,0,0,.09) 0 16px 8px,rgba(0,0,0,.09) 0 32px 16px;white-space:pre-line;color:#e0e0e0;transition:background 1s,margin 1s,color .3s}.log-entry:hover{background:#2c2c2c;margin:10px 0;box-shadow:rgba(0,0,0,.19) 0 10px 20px,rgba(0,0,0,.23) 0 6px 6px}.task-item{box-shadow:rgba(0,0,0,.4) 0 2px 4px,rgba(0,0,0,.3) 0 7px 13px -3px,rgba(0,0,0,.2) 0 -3px 0 inset;border-bottom:1px solid #000;padding:10px;display:flex;align-items:center}.date-title{margin-top:10px;color:#e0e0e0;margin-right:15px}h1{font-size:1.5em;margin-bottom:20px}.heading-style1{font-family:"BhuTuka Expanded One",serif;font-weight:400;font-style:normal;font-size:1.5em;text-align:center;margin-bottom:20px;color:#1287ca;text-shadow:2px 2px 4px rgba(1,1,32,.3)}.completed{text-decoration:line-through;color:#999}.text-content{padding:5px;flex:1;word-wrap:break-word;min-width:0}.category-container{background-color:#1e1e1e;color:#e0e0e0;padding:20px;border-radius:10px;text-align:left;width:400px;box-shadow:0 4px 8px rgba(.1,0,0,.1)}@media screen and (max-width:768px){.container{max-width:100%}}</style></head><body><div class="container"><div class="log-container">
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
            htmlContent += `<h1 class="heading-style1">${category}</h1>`;

            // 日期排序（由新到舊）
            const sortedDates = Object.keys(groupedTasks[category]).sort((a, b) => new Date(b) - new Date(a));

            sortedDates.forEach(date => {
                htmlContent += `<div class="log-entry">`;

                // 遍歷 `true`（完成） 和 `false`（未完成）
                Object.keys(groupedTasks[category][date]).forEach(status => {
                    let isCompleted = status === "true"; // 轉換為布林值
                    let itemClass = isCompleted ? "completed" : "pending"; // 設定不同的 CSS 類別

                    groupedTasks[category][date][status].forEach((task, index) => {
                        htmlContent += `<div class="text-content ${itemClass}">${index + 1}. ${task}</div>`;
                    });
                });

                htmlContent += `<div class="date-title">${date}</div>`;
                htmlContent += `</div>`;
            });
        });
                
            htmlContent += `</div></div></body></html>`;
            return htmlContent;

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
                notyf.error(`Failed to view ${text} file`);
            }
        },
        viewAs(format) {
            notyf.success(`Viewing as ${format.toUpperCase()}`);
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
                notyf.error(`Failed to export ${text} file`);
            }
        },
        exportAs(format) {
            notyf.success(`Exporting as ${format.toUpperCase()}`);
            
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
            // console.log("isSendEmail 变更为:", newVal);
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
            taskListArchive: JSON.parse(localStorage.getItem("tasksArchive")) || {"default":[]},
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
                notyf_warning.open({
                    type: 'warning',
                    message: 'Please select the file first!'
                });
                return;
            }

            const fileName = file.name; // 獲取檔名
            const match = fileName.match(/^task_\d{4}-\d{2}-\d{2}\.json$/);

            if (!match) {
                notyf.error("Failed to import ,please check your file format!");
                return;
            }

            const extension = fileName.substring(fileName.lastIndexOf(".") + 1);
            
            // 檔案格式必須為 json
            if (extension !== "json") {
                notyf.error(`Failed to import ${extension} file!`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    if(type === 'overwrite'){
                        localStorage.setItem("tasks", JSON.stringify(json));
                        notyf.success("Coverage completed and reorganizing in progress...");
                        this.isLoading = true;
                    }else if(type === 'append'){
                        notyf_warning.open({
                            type: 'warning',
                            message: 'Not working yet ,coming soon...'
                        });
                        // notyf.success("Adding completed Reorganizing in progress...");
                        this.isLoading = true;
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
            if(!this.selectedCategory){
                if(this.taskList[this.newCategory]){
                    notyf.error("Category is repeat!");
                }

                if (!this.newCategory.trim()) {
                    notyf_warning.open({
                        type: 'warning',
                        message: 'Please input your category name!'
                    });
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

                const userConfirmed = window.confirm(`No tasks available. Do you want to add a new task in '${category}'?`);
                if (userConfirmed) {
                    notyf.success("No tasks available.<br>Please add a new task!");
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
                notyf.error(`Cannot delete '${category}' because it still has tasks.`);
                return;
            }
            // todo: check bf remove
            const userConfirmed = window.confirm(`Are you sure you want to delete '${category}'?`);
            if (userConfirmed) {
                delete this.taskList[category];
                this.expandedCategories = this.expandedCategories.filter(c => c !== category);
                this.saveTasks();
                notyf.success(`Successfully deleted '${category}' permanently.`);
            }
        },
        archiveCategory(category){
            notyf_warning.open({
                type: 'warning',
                message: 'Not Working yet!'
            });
            return;
        },
        renameCategory(category){
            notyf_warning.open({
                type: 'warning',
                message: 'Not Working yet!'
            });
            return;
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
                notyf_warning.open({
                    type: 'warning',
                    message: 'Please select your category!'
                });
            }else if (!this.newTask.date) {
                notyf_warning.open({
                    type: 'warning',
                    message: 'Please select your date!'
                });
            }else if (!this.newTask.text.trim()) {
                notyf_warning.open({
                    type: 'warning',
                    message: 'Please input your task content!'
                });
            }

            if (!category || !this.newTask.text.trim() || !this.newTask.date) return;
        

            if(this.isEdit){
                try{
                    const taskIndex = this.taskIndex(category, this.newTask.timestamp);
                    this.taskList[category][taskIndex].text = this.newTask.text;
                    this.taskList[category][taskIndex].date = this.newTask.date;
                    this.taskList[category][taskIndex].updatetime = Date.now();
                    this.newTask.text = "";
                    this.saveTasks();
                    notyf.success("Edit task successfully!");
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
                this.newTask.text = "";
                this.saveTasks();
                notyf.success("Add task successfully!");
                this.isTaskVisible = false;
                this.isAllTasklist = true;
                // 展開
                this.toggleCategory(category) ;
                this.toggleTaskbars(category, newTask.timestamp);
            }
        
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
                notyf.success(`Finish task successfully!`);
            }else{
                notyf.success(`Cancel finish task successfully!`);
            }
        },
        archiveTask(category, timestamp)  {
            const taskIndex = this.taskIndex(category, timestamp);
            // console.log('taskIndex,',taskIndex)
            this.taskList[category][taskIndex].archive = !this.taskList[category][taskIndex].archive;
            this.saveTasks();
            if(this.taskList[category][taskIndex].archive){
                notyf.success(`Archive task successfully!`);
            }else{
                notyf.success(`Cancel archive task successfully!`);
            }
        },
        setUrgentTask(category, timestamp) {
            const taskIndex = this.taskIndex(category, timestamp);
            if(!this.taskList[category][taskIndex].completed){
                this.taskList[category][taskIndex].urgent = !this.taskList[category][taskIndex].urgent;
                this.saveTasks();
                if(this.taskList[category][taskIndex].urgent){
                    notyf.success(`Urgent task successfully!`);
                }
            }else{
                notyf_warning.open({
                    type: 'warning',
                    message: 'You cannot set urgent cause this task is already finish!'
                });
            }
        },
        removeTask(category, timestamp, text) {
            const userConfirmed = window.confirm(`Are you sure you want to delete '${text}'?`);
            if (userConfirmed) {
                this.toggleTaskbars(category, timestamp);
                this.taskList[category] = this.taskList[category].filter(task => task.timestamp !== timestamp);
                this.saveTasks();
                notyf.success(`Successfully deleted '${text}' permanently.`);
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
