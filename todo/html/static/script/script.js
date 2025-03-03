const { createApp, ref ,watch } = Vue;

const notyf = new Notyf({
    duration: 3000, // 顯示 3 秒
    dismissible: true,
    position: {
        x: 'center',
        y: 'top'
    }
});

const notyf2 = new Notyf({
    duration: 3000, // 訊息顯示時間
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


const Common = {
    getTodayDate() {
        const today = new Date();
        return today.toISOString().split("T")[0]; // 轉成 YYYY-MM-DD 格式
    },
};

const DropdownMenuHeader = {
    props: ['isLight','isSendEmail','isCategoryVisible','isImport','formData'],  // 接收父组件的值
    emits: ['update:isLight','update:isSendEmail','update:isCategoryVisible','update:isImport','update:formData'],  // 允许子组件更新父组件

    template: `
    <div class="header-container">
        <div class="hamburger">
        <div class="dropdown">
            <i class="font-awesome-i fa-solid fa-bars" @click="toggleBars"></i>
            <ul v-show="dropdownviewHeader" class="dropdown-menu bars">
            
                <li v-if="isLight" @click="$emit('update:isLight', false )">
                    <i class="font-awesome-i fa-solid fa-toggle-on"></i><span>|　Toggle dark-mode</span>
                </li>
                <li v-if="!isLight" @click="$emit('update:isLight', true )">
                    <i class="font-awesome-i fa-solid fa-toggle-off"></i><span>|　Toggle light-mode</span>
                </li>
                <!-- todo: close other div-->
                <li v-if="!isSendEmail" @click="$emit('update:formData', { isSendEmail: true, isCategoryVisible: false, isImport: false })">
                    <i class="font-awesome-i fa-solid fa-envelope"></i><span>|　Feedback</span>
                </li>
                <li v-if="!isSendEmail" class="dropdown" @click="toggleDropdown">
                    <i class="font-awesome-i fa-solid fa-file-export"></i><span>|　View / Import / Export</span>
                    <ul v-show="dropdownviewExport" class="dropdown-menu dropdown-menu-sub">
                    <li @click="viewAs('json')"><i class="fa-solid fa-eye"></i>|　View as JSON</li>
                    <li @click="viewAs('html')"><i class="fa-solid fa-eye"></i>|　View as HTML</li>
                    <li @click="$emit('update:formData', { isSendEmail: false, isCategoryVisible: false, isImport: true })"><i class="fa-solid fa-file-import"></i>|　Import as JSON</li>
                    <li @click="exportAs('json')"><i class="font-awesome-i fa-solid fa-file-export"></i>|　Export as JSON</li>
                    <li @click="exportAs('html')"><i class="font-awesome-i fa-solid fa-file-export"></i>|　Export as HTML</li>
                    <li @click="dropdownviewExport = true"><i class="font-awesome-i fa-solid fa-xmark"></i>|　Close the menu</li>
                    </ul>
                </li>
                <li v-if="!isSendEmail && !isCategoryVisible && !isImport" @click="$emit('update:formData', { isSendEmail: false, isCategoryVisible: true, isImport: false })">
                    <i class="font-awesome-i fa-solid fa-add"></i><span>|　Add new category</span>
                </li>

                <li v-if="isSendEmail" @click="$emit('update:isSendEmail', false)">
                    <i class="font-awesome-i fa-solid fa-arrow-left"></i><span>|　Pre page</span>
                </li>
                <li v-if="isCategoryVisible" @click="$emit('update:isCategoryVisible', false)">
                    <i class="font-awesome-i fa-solid fa-arrow-left"></i><span>|　Pre page</span>
                </li>
                <li v-if="isImport" @click="$emit('update:isImport', false)">
                    <i class="font-awesome-i fa-solid fa-arrow-left"></i><span>|　Pre page</span>
                </li>
                <li @click="toggleBars">
                    <i class="font-awesome-i fa-solid fa-xmark"></i><span>|　Close the menu</span>
                </li>
            </ul>
        </div>
        </div>
        <div v-if="isSendEmail" class="closeicon">
            <i @click="$emit('update:isSendEmail', false)" class="font-awesome-i fa-regular fa-circle-xmark"></i>
        </div>
        <div v-if="isCategoryVisible" class="closeicon">
            <i @click="$emit('update:isCategoryVisible', false)" class="font-awesome-i fa-regular fa-circle-xmark"></i>
        </div>
        <div v-if="isImport" class="closeicon">
            <i @click="$emit('update:isImport', false)" class="font-awesome-i fa-regular fa-circle-xmark"></i>
        </div>
    </div>
    `,
    data() {
        return {
            todoList: JSON.parse(localStorage.getItem("todos")) || {},
        };
    },
    methods:{
        html(){

            let htmlContent = `
<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Todo List Export</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=BhuTuka+Expanded+One&family=Indie+Flower&family=Metamorphous&family=Smooch+Sans:wght@100..900&family=Vujahday+Script&family=Wire+One&display=swap" rel="stylesheet"><link rel="icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><link rel="shortcut icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><style>body{font-family:"BhuTuka Expanded One",serif;background-color:#1e1e1e;display:flex;justify-content:center;align-items:center}.container{width:100%;flex-direction:column;height:90vh}.log-container{overflow-y:auto;overflow-x:hidden;flex-grow:1;overflow-y:auto;padding-top:10px}.log-entry{justify-content:center;word-wrap:break-word;padding:15px;border-radius:10px;box-shadow:rgba(0,0,0,.17) 0 -23px 25px 0 inset,rgba(0,0,0,.15) 0 -36px 30px 0 inset,rgba(0,0,0,.1) 0 -79px 40px 0 inset,rgba(0,0,0,.06) 0 2px 1px,rgba(0,0,0,.09) 0 4px 2px,rgba(0,0,0,.09) 0 8px 4px,rgba(0,0,0,.09) 0 16px 8px,rgba(0,0,0,.09) 0 32px 16px;white-space:pre-line;color:#e0e0e0;transition:background 1s,margin 1s,color .3s}.log-entry:hover{background:#2c2c2c;margin:10px 0;box-shadow:rgba(0,0,0,.19) 0 10px 20px,rgba(0,0,0,.23) 0 6px 6px}.todo-item{box-shadow:rgba(0,0,0,.4) 0 2px 4px,rgba(0,0,0,.3) 0 7px 13px -3px,rgba(0,0,0,.2) 0 -3px 0 inset;border-bottom:1px solid #000;padding:10px;display:flex;align-items:center}.date-title{margin-top:10px;color:#e0e0e0;margin-right:15px}h1{font-size:1.5em;margin-bottom:20px}.heading-style1{font-family:"BhuTuka Expanded One",serif;font-weight:400;font-style:normal;font-size:1.5em;text-align:center;margin-bottom:20px;color:#1287ca;text-shadow:2px 2px 4px rgba(1,1,32,.3)}.completed{text-decoration:line-through;color:#999}.text-content{padding:5px;flex:1;word-wrap:break-word;min-width:0}.category-container{background-color:#1e1e1e;color:#e0e0e0;padding:20px;border-radius:10px;text-align:left;width:400px;box-shadow:0 4px 8px rgba(.1,0,0,.1)}@media screen and (max-width:768px){.container{max-width:100%}}</style></head><body><div class="container"><div class="log-container">
            `;
            // 整理所有待辦事項到一個陣列
            const allTodos = [];
        
            // 遍歷每個分類並整理資料
            Object.entries(this.todoList).forEach(([category, items]) => {
                items.forEach(item => {
                    allTodos.push({
                        ...item,
                        category
                    });
                });
            });
            
            // 按日期降序排序
            allTodos.sort((a, b) => new Date(b.date) - new Date(a.date));

            // 按 category 和 date 分組
        const groupedTodos = {};

        // 依類別與日期與完成狀態分組
        allTodos.forEach(todo => {
            // 確保 completed 是字串形式的 "true" 或 "false"
            const completedStatus = String(todo.completed);

            if (!groupedTodos[todo.category]) {
                groupedTodos[todo.category] = {};
            }
            if (!groupedTodos[todo.category][todo.date]) {
                groupedTodos[todo.category][todo.date] = { true: [], false: [] };
            }

            // 檢查是否存在對應的陣列
            if (!groupedTodos[todo.category][todo.date][completedStatus]) {
                groupedTodos[todo.category][todo.date][completedStatus] = [];
            }

            groupedTodos[todo.category][todo.date][completedStatus].push(todo.text);
        });

        // 依照類別與日期排序
        const sortedCategories = Object.keys(groupedTodos).sort(); // 類別排序

        sortedCategories.forEach(category => {
            htmlContent += `<h1 class="heading-style1">${category}</h1>`;

            // 日期排序（由新到舊）
            const sortedDates = Object.keys(groupedTodos[category]).sort((a, b) => new Date(b) - new Date(a));

            sortedDates.forEach(date => {
                htmlContent += `<div class="log-entry">`;

                // 遍歷 `true`（完成） 和 `false`（未完成）
                Object.keys(groupedTodos[category][date]).forEach(status => {
                    let isCompleted = status === "true"; // 轉換為布林值
                    let itemClass = isCompleted ? "completed" : "pending"; // 設定不同的 CSS 類別

                    groupedTodos[category][date][status].forEach((task, index) => {
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
                    notyf2.open({
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
                const jsonString = JSON.stringify(this.todoList, null, 2);
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
                link.download = `todo_${Common.getTodayDate()}.${text}`;
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
                const jsonString = JSON.stringify(this.todoList, null, 2);
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
let template_s = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Todo List Export</title><link rel="icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><link rel="shortcut icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><style>body{font-family:Arial,sans-serif;background-color:#1e1e1e;padding:20px;display:flex;flex-direction:column;align-items:center;color:#e0e0e0;transition:background .3s,color .3s}.container{width:100%;max-width:600px;display:flex;flex-direction:column;height:90vh}.log-container{flex-grow:1;overflow-y:auto;padding-top:10px}.log-entry{word-wrap: break-word;background:#2c2c2c;padding:15px;margin:10px 0;border-radius:10px;box-shadow:0 2px 5px rgba(0,0,0,.3);border-left:5px solid ;white-space:pre-line;color:#e0e0e0;transition:background .3s,color .3s}.log-title{font-size:18px;font-weight:700;margin-bottom:5px;color:#fff}.timestamp{font-size:14px;font-weight:700;color:#a0a0a0;display:block;margin-top:5px}a{color:#fff}.light-mode a{color:#1e1e1e}.light-mode{background-color:#414242;color:#333;margin-bottom:10px}.light-mode .log-entry{background:#fff;color:#333;border-left:5px solid ;box-shadow:0 2px 5px rgba(0,0,0,.1)}.light-mode .log-title{color:#222}.light-mode .timestamp{color:gray}.switch-container{display:flex;align-items:center;justify-content:center}.switch-label{font-size:16px;margin-left:10px}.switch{position:relative;display:inline-block;width:50px;height:25px}.switch input{opacity:0;width:0;height:0}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:25px}.slider:before{position:absolute;content:"";height:17px;width:17px;left:4px;bottom:4px;background-color:#fff;transition:.4s;border-radius:50%}input:checked+.slider{background-color:#1da1f2}input:checked+.slider:before{transform:translateX(24px)} pre{white-space: pre-wrap; /* 保留換行並自動換行 */ word-wrap: break-word; /* 讓長單詞換行 */}.light-mode pre{color:#fff;}</style></head><body><div id="app" class="container">`;
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
            // console.log("isCategoryVisible 变更为:", newVal);
        });

        return { isLight, isSendEmail ,formData ,isCategoryVisible ,isImport};
    },
    data() {
        return {
            newCategory: "",
            selectedCategory: "",
            newTodo: { text: "", date: Common.getTodayDate() },
            todoList: JSON.parse(localStorage.getItem("todos")) || {},
            todoListArchive: JSON.parse(localStorage.getItem("todosArchive")) || {},
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
            dropdownviewTodo: false,
            isSendEmail: false,
            isCategoryVisible: false,
            isImport: false,
            dropdownviewTodo: {},
            newTodoArchive: { text: "", date: "", completed: "",urgent: "" },
        };
    },
    computed: {
        isListVisible() {
            return Object.keys(this.todoList).length > 0; 
        }
    },
    methods: {
        handleUpdate(newData) {
            // console.log(newData)
            this.isSendEmail = newData.isSendEmail;
            this.isCategoryVisible = newData.isCategoryVisible;
            this.isImport = newData.isImport;
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
                notyf.error("Please select the file first!");
                return;
            }

            const fileName = file.name; // 獲取檔名
            const match = fileName.match(/^todo_\d{4}-\d{2}-\d{2}\.json$/);

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
                        localStorage.setItem("todos", JSON.stringify(json));
                        notyf.success("Coverage completed and reorganizing in progress...");
                        this.isLoading = true;
                    }else if(type === 'append'){
                        notyf2.open({
                            type: 'warning',
                            message: 'not working yet ,coming soon...'
                        });
                        // notyf.success("Adding completed Reorganizing in progress...");
                        this.isLoading = true;
                    }
                } catch (error) {
                    console.error('Import failed:', error);
                    notyf.error("Failed to import！");
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
            if (this.newCategory.trim() && !this.todoList[this.newCategory]) {
                this.todoList[this.newCategory] = []; // Vue 3 不需要 $set
                this.newCategory = "";
                this.saveTodos();
            }
            if(this.todoList[this.newCategory]){
                notyf.error("category is repeat！");
            }
        },
        toggleCategory(category) {
            const index = this.expandedCategories.indexOf(category);
            if (index === -1) {
                this.expandedCategories.push(category);
            } else {
                this.expandedCategories.splice(index, 1);
            }
        },
        removeCategory(category) {
            if (this.todoList[category] && this.todoList[category].length > 0) {
                notyf.error(`Cannot delete '${category}' because it still has tasks!`);
                return;
            }
            const userConfirmed = window.confirm(`Are you sure you want to delete '${category}'?`);
            if (userConfirmed) {
                delete this.todoList[category];
                this.expandedCategories = this.expandedCategories.filter(c => c !== category);
                this.saveTodos();
                notyf.success(`Successfully deleted '${category}' permanently.`);
            }
        },

        //archive
        archiveTodo(category, index, date, text, completed, urgent)  {
            if(!this.todoListArchive[category]){
                this.saveCategoryArchive(category);
            }
            if (!category || !text.trim() || !date) return;
            this.todoList[category][index].archived = true;
            this.newTodoArchive.text = text;
            this.newTodoArchive.date = date;
            this.newTodoArchive.completed = completed;
            this.newTodoArchive.urgent = urgent;

            this.addTodoArchive(category, index);
            this.removeCauseTodoArchive(category, index);
            this.saveTodosArchive();
            if(this.todoList[category][index].archived){
                notyf.success(`archive task successfully!`);
            }
        },
        saveCategoryArchive(category) {
            if (category.trim() && !this.todoListArchive[category]) {
                this.todoListArchive[category] = []; // Vue 3 不需要 $set
                this.saveTodosArchive();
            }
        },
        saveTodosArchive() {
            localStorage.setItem("todosArchive", JSON.stringify(this.todoListArchive));
        },
        addTodoArchive(category, index, text) {
            if (!category || !text.trim()) return;
            this.todoListArchive[category][index].push({ ...this.newTodoArchive });
            this.saveTodosArchive();
            notyf.success(`add archive '${category}' '${text}' successfully!`);
        },
        removeCauseTodoArchive(category, index) {
            this.todoList[category].splice(index, 1);
            this.saveTodos();
        },
        //archive end
        //todo
        toggleTodobars(category, index) {
            this.todoList[category][index].opend = !this.todoList[category][index].opend;
            this.saveTodos();
            if(this.todoList[category][index].opend){
                notyf.success(`toggle open successfully!`);
            }
            this.dropdownviewTodo[index] = this.todoList[category][index].opend;  
        },
        setUrgentTodo(category, index) {
            this.todoList[category][index].urgent = !this.todoList[category][index].urgent;
            this.saveTodos();
            if(this.todoList[category][index].urgent){
                notyf.success(`urgent set successfully!`);
            }
        },
        saveTodos() {
            localStorage.setItem("todos", JSON.stringify(this.todoList));
        },
        addTodo() {
            if (!this.selectedCategory){
                notyf.error('select your category<br>or<br>add a new category!');
            }
            if (!this.selectedCategory || !this.newTodo.text.trim() || !this.newTodo.date) return;
            this.todoList[this.selectedCategory].push({ ...this.newTodo });
            this.newTodo.text = "";
            this.saveTodos();
            notyf.success("add task successfully!");
        },
        copyTodo(text) {
            navigator.clipboard.writeText(text.trim())
                .then(() => notyf.success("copy success！"))
                .catch(err => console.error("copy error！", err));
        },
        checkTodo(category, index) {
            this.todoList[category][index].completed = !this.todoList[category][index].completed;
            this.saveTodos();
            if(this.todoList[category][index].completed){
                notyf.success(`finish task!`);
                this.todoList[category][index].urgent = false;
            }
        },
        removeTodo(category, index ,text) {
            const userConfirmed = window.confirm(`Are you sure you want to delete '${text}'?`);
            if (userConfirmed) {
                this.todoList[category].splice(index, 1);
                this.saveTodos();
                notyf.success(`Successfully deleted '${text}' permanently.`);
            }
            setTimeout(() => {
                if (this.todoList[category].length === 0) {
                    const userConfirmed2 = window.confirm(`No tasks available. Do you want to delete '${category}'?`);
                    if (userConfirmed2) {
                        this.removeCategory(category);
                    }
                }
            }, 2000);
        },
        sortedTodos(todos) {
            return todos.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
        },
    }
}).mount('#app');
