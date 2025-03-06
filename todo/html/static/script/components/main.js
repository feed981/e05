const { createApp, ref, watch, reactive } = Vue;

(function() {
    emailjs.init("un2nCxSnYlqZWdgMG");
})();

createApp({
    components: { 
        'dropdown-menu-header': DropdownMenuHeader ,
        'float-icon': window.FloatIcon ,
    },
    setup() {

        const isQrcode = ref(false);
        watch(isQrcode, (newVal) => {
            // console.log("isQrcode 变更为:", newVal);
        });

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

        return { isQrcode, isLight, isAllTasklist, isCategoryTasklist, isCategoryArchiveTasklist, isSendEmail, formData, isCategoryVisible, isImport, isTaskVisible, isEdit };
    },
    data() {
        return {
            viewCategory: "",
            newCategory: "",
            selectedCategory: "",
            newTask: { 
                text: "",
                date: window.Common.getTodayDate(),
                opend: false,
                urgent: false,
                archive: false
            },
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
            isQrcode: false,
            isLight: false,
            isAllTasklist: true,
            dropdownviewTask: false,
            isSendEmail: store.isSendEmail,
            isCategoryVisible: false,
            isImport: false,
            isTaskVisible: false,
            isCategoryTasklist: false,
            isCategoryArchiveTasklist: false,
            dropdownviewTask: {},
            isEdit: false,
            isSpeakMute: store.isSpeakMute,
            isSoundMute: store.isSoundMute,
            language: store.language,
        };
    },
    mounted() {
        store.isSendEmail = this.isSendEmail;
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
            this.isQrcode = newData.isQrcode;
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
                window.Common.warningNotyftMessageCheckData([`Please select the file first!`,`請選擇要匯入的檔案!`]);
            }

            const fileName = file.name; // 獲取檔名
            const match = fileName.match(/^task_\d{4}-\d{2}-\d{2}\.json$/);

            if (!match) {
                window.Common.errorNotyftMessage([`Failed to import ,please check your file format!`,`可能是檔名或是檔案內容格式有誤!`]);
            }

            const extension = fileName.substring(fileName.lastIndexOf(".") + 1);
            
            // 檔案格式必須為 json
            if (extension !== "json") {
                window.Common.errorNotyftMessage([`Failed to import ${extension} file!`,`不是 ${extension} 格式的檔案!`]);
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    if(type === 'overwrite'){
                        localStorage.setItem("tasks", JSON.stringify(json));
                        window.Common.successNotyftMessage([`Coverage completed and reorganizing in progress...`,`資料覆蓋已完成，重組中請稍等...`]);
                        this.isLoading = true;
                    }else if(type === 'append'){
                        window.Common.warningNotyftMessageCheckData(['Not Working yet!','這個功能還沒搞!']);
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
                window.Common.warningNotyftMessageCheckData([`'${this.newCategory}' this category is repeat!`,`'${this.newCategory}' 這個類別重複!`]);
            }

            if (!this.newCategory.trim()) {
                window.Common.warningNotyftMessageCheckData([`Please input your category name!`,`請輸入你的類別名稱!`]);
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
                    window.Common.errorNotyftMessage([`'${this.newCategory}' this category is repeat!`,`'${this.newCategory}' 這個類別重複!`]);
                }

                if (!this.newCategory.trim()) {
                    window.Common.warningNotyftMessageCheckData([`Please input your category name!`,`請輸入你的類別名稱!`]);
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
                //     date: window.Common.getTodayDate(),
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
                if (window.Common.windowConfirm([`No tasks available. Do you want to add a new task in '${category}'?`,`沒有可用任務，你想要新增任務到 '${category}' 這個類別中嗎?`])) {
                    window.Common.successNotyftMessage([`Please add a new task!`,`請新增一項任務!`]);
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
                window.Common.warningNotyftMessageCheckData([`Cannot delete '${category}' because it still has tasks.`,`你無法刪除 '${category}' 這個類別，因為裡面還有任務`]);
                return;
            }
            // todo: check bf remove
            if (window.Common.windowConfirm([`Are you sure you want to delete '${category}'?`,`你確定要刪除 '${category}' 這個類別嗎?`])) {
                delete this.taskList[category];
                this.expandedCategories = this.expandedCategories.filter(c => c !== category);
                this.saveTasks();
                window.Common.successNotyftMessage([`Successfully deleted '${category}' permanently.`,`已經永久刪除 '${category}'`]);
            }
        },
        
        archiveCategory(category){
            window.Common.warningNotyftMessageCheckData(['Not Working yet!','這個功能還沒搞!']);
        },
        renameCategory(category){
            window.Common.warningNotyftMessageCheckData(['Not Working yet!','這個功能還沒搞!']);
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
                window.Common.warningNotyftMessageCheckData(['Please select your category!','請先選擇類別!']);
            }else if (!this.newTask.date) {
                window.Common.warningNotyftMessageCheckData(['Please select your date!','請選擇日期!']);
            }else if (!this.newTask.text.trim()) {
                window.Common.warningNotyftMessageCheckData(['Please input your task content!','請輸入任務內容!']);
            }

            if (!category || !this.newTask.text.trim() || !this.newTask.date) return;

            if(this.isEdit){
                try{
                    const taskIndex = this.taskIndex(category, this.newTask.timestamp);
                    this.taskList[category][taskIndex].text = this.newTask.text;
                    this.taskList[category][taskIndex].date = this.newTask.date;
                    this.taskList[category][taskIndex].timestamp = Date.now();
                    this.taskList[category][taskIndex].updatetime = Date.now();
                    this.saveTasks();
                    window.Common.successNotyftMessage(['Edit task successfully!','已修改任務內容!']);
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
                window.Common.successNotyftMessage(['Add task successfully!','已新增一項任務!']);
                this.isTaskVisible = false;
                this.isAllTasklist = true;
                // 展開
                this.toggleCategory(category) ;
                // this.toggleTaskbars(category, newTask.timestamp);
            }

            this.selectedCategory = '';
            this.newTask.text = "";
            this.newTask.date = window.Common.getTodayDate();
        
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
            window.Common.successNotyftMessage(['Edit your task content!','請修改任務內容!']);
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
                window.Common.playSoundtrack(`${store.cloudfrontsoundtrack}black-and-white-ost-disc-3-mission-success.mp3`);
                window.Common.successNotyftMessage(['Finish task successfully!','順利完成任務!']);
            }else{
                window.Common.playSoundtrack(`${store.cloudfrontsoundtrack}gta-san-andreas-ah-shit-here-we-go-again_BWv0Gvc.mp3`);
                window.Common.successNotyftMessage(['Cancel finish task successfully!','重啟任務!']);
            }
        },
        archiveTask(category, timestamp)  {
            const taskIndex = this.taskIndex(category, timestamp);
            // console.log('taskIndex,',taskIndex)
            this.taskList[category][taskIndex].archive = !this.taskList[category][taskIndex].archive;
            this.saveTasks();
            if(this.taskList[category][taskIndex].archive){
                window.Common.successNotyftMessage(['Archive task successfully!','已將任務封存!']);
            }else{
                window.Common.successNotyftMessage(['Cancel archive task successfully!','取消任務封存!']);
            }
        },
        setUrgentTask(category, timestamp) {
            const taskIndex = this.taskIndex(category, timestamp);
            if(!this.taskList[category][taskIndex].completed){
                this.taskList[category][taskIndex].urgent = !this.taskList[category][taskIndex].urgent;
                this.saveTasks();
                if(this.taskList[category][taskIndex].urgent){
                    window.Common.playSoundtrack(`${store.cloudfrontsoundtrack}gan-wu-hua-dou.mp3`);
                    window.Common.successNotyftMessage(['Urgent task successfully!','已將任務狀態設置為緊急!']);
                }
            }else{
                window.Common.warningNotyftMessageCheckData(['You cannot set urgent cause this task is already finish!','無法將任務設置為緊急因為任務已經結束!']);
            }
        },
        removeTask(category, timestamp, text) {
            if (window.Common.windowConfirm([`Are you sure you want to delete '${text}'?`,`你確定要刪除'${text}'嗎?`])) {
                this.toggleTaskbars(category, timestamp);
                this.taskList[category] = this.taskList[category].filter(task => task.timestamp !== timestamp);
                this.saveTasks();
                window.Common.successNotyftMessage([`Successfully deleted '${text}' permanently.`,`已經永久刪除 '${text}'`]);
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
