const { createApp } = Vue;

const notyf = new Notyf({
    duration: 3000, // 顯示 3 秒
    dismissible: true,
    position: {
        x: 'center',
        y: 'top'
    }
});

(function() {
    emailjs.init("un2nCxSnYlqZWdgMG");
})();
let template_s = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Todo List Export</title><link rel="icon" href="https://d2luynvj2paf55.cloudfront.net/favicon-log.ico" type="image/x-icon"><link rel="shortcut icon" href="https://d2luynvj2paf55.cloudfront.net/favicon-log.ico" type="image/x-icon"><style>body{font-family:Arial,sans-serif;background-color:#1e1e1e;padding:20px;display:flex;flex-direction:column;align-items:center;color:#e0e0e0;transition:background .3s,color .3s}.container{width:100%;max-width:600px;display:flex;flex-direction:column;height:90vh}.log-container{flex-grow:1;overflow-y:auto;padding-top:10px}.log-entry{word-wrap: break-word;background:#2c2c2c;padding:15px;margin:10px 0;border-radius:10px;box-shadow:0 2px 5px rgba(0,0,0,.3);border-left:5px solid ;white-space:pre-line;color:#e0e0e0;transition:background .3s,color .3s}.log-title{font-size:18px;font-weight:700;margin-bottom:5px;color:#fff}.timestamp{font-size:14px;font-weight:700;color:#a0a0a0;display:block;margin-top:5px}a{color:#fff}.light-mode a{color:#1e1e1e}.light-mode{background-color:#414242;color:#333;margin-bottom:10px}.light-mode .log-entry{background:#fff;color:#333;border-left:5px solid ;box-shadow:0 2px 5px rgba(0,0,0,.1)}.light-mode .log-title{color:#222}.light-mode .timestamp{color:gray}.switch-container{display:flex;align-items:center;justify-content:center}.switch-label{font-size:16px;margin-left:10px}.switch{position:relative;display:inline-block;width:50px;height:25px}.switch input{opacity:0;width:0;height:0}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:25px}.slider:before{position:absolute;content:"";height:17px;width:17px;left:4px;bottom:4px;background-color:#fff;transition:.4s;border-radius:50%}input:checked+.slider{background-color:#1da1f2}input:checked+.slider:before{transform:translateX(24px)} pre{white-space: pre-wrap; /* 保留換行並自動換行 */ word-wrap: break-word; /* 讓長單詞換行 */}.light-mode pre{color:#fff;}</style></head><body><div id="app" class="container">`;
let template_e = `</div></body></html>`;

createApp({
    data() {
        return {
            isLight: false,
            isCategoryVisible: false,
            newCategory: "",
            selectedCategory: "",
            newTodo: { text: "", date: this.getTodayDate() },
            todoList: JSON.parse(localStorage.getItem("todos")) || {},
            expandedCategories: [],
            dropdownview: false,
            isSendEmail: false,
            formData: {
                to_email: '',
                from_name: '',
                message: '',
                pageTitle: '',
                currentURL: '',
            },
            status: '',
            sending: false,
            isError: false
        };
    },
    computed: {
        isListVisible() {
            return Object.keys(this.todoList).length > 0; 
        }
    },
    watch: {
        isSendEmail(newVal){
            if (!newVal) {
                this.formData = {
                    to_email: '',
                    from_name: '',
                    message: ''
                };
            }
        },
        isLight(newVal) {
            if (newVal) {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'light');
            }
        },
    },
    methods: {
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
        toggleDropdown(type ,value) {
            this[type] = value;
            if(value === false){
                setTimeout(() => {
                    this.dropdownview = false;
                }, 100);
            }
        },
        html(){
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
            let htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Todo List Export</title>
                    <link rel="icon" href="https://d2luynvj2paf55.cloudfront.net/favicon-log.ico" type="image/x-icon"><link rel="shortcut icon" href="https://d2luynvj2paf55.cloudfront.net/favicon-log.ico" type="image/x-icon">
                    <style>
                               body {
font-family: Arial, sans-serif;
background-color: #1E1E1E;
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
margin: 0;
}

                        .todo-item { 
                            border-bottom: 1px solid #eee; 
                            padding: 10px;
                            display: flex;
                            align-items: center;
                        }
                        .date { color: #e0e0e0; margin-right: 15px; }
                        .category { 
                            background:rgb(122, 119, 119);
                            padding: 3px 8px;
                            border-radius: 3px;
                            margin-right: 15px;
                        }
                        .completed { text-decoration: line-through; color: #999; }
                                .text-content {
    flex: 1;  /* 讓文字內容占用剩餘空間 */
    word-wrap: break-word;  /* 允許長單字換行 */
    min-width: 0;  /* 確保可以正確換行 */
}
.todo-container {
background-color: #2C2C2C;
color: #e0e0e0;
padding: 20px;
border-radius: 10px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
text-align: center;
width: 400px;
}
                        
                    </style>
                </head>
                <body>
                    <div class="todo-container">
            `;
            
            // 加入每個待辦事項
            allTodos.forEach(todo => {
                const itemClass = todo.completed ? 'completed' : '';
                htmlContent += `
                <div class="todo-item">
                        <span class="date">${todo.date}</span>
                        <span class="category">${todo.category}</span>
                        <span class="text-content ${itemClass}">${todo.text}</span>
                    </div>
                    `;
                });
                
            htmlContent += `
                </div>
                </body>
                </html>
            `;
            return htmlContent;

        },
        viewopen(template ,text){
            try{
                const newTab = window.open();
                if (newTab) {
                    newTab.document.write(template);
                    newTab.document.close();
                } else {
                    notyf.open({
                        type: 'warning',
                        message: `請允許彈出視窗以顯示 ${text}!`,
                        background: 'orange',
                        duration: 5000 // 5 秒後消失
                    });
                }
            } catch (error) {
                console.error('View failed:', error);
                notyf.error(`Failed to view ${text} file`);
            }
        },
        viewAs(format) {
            notyf.success(`Viewing as ${format.toUpperCase()}`);
            this.dropdownview = false; // 關閉選單
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
                link.download = `todo_${this.getTodayDate()}.${text}`;
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
        getTodayDate() {
            const today = new Date();
            return today.toISOString().split("T")[0]; // 轉成 YYYY-MM-DD 格式
        },
        saveTodos() {
            localStorage.setItem("todos", JSON.stringify(this.todoList));
        },
        saveCategory() {
            if (this.newCategory.trim() && !this.todoList[this.newCategory]) {
                this.todoList[this.newCategory] = []; // Vue 3 不需要 $set
                this.newCategory = "";
                this.saveTodos();
            }
        },
        addTodo() {
            if (!this.selectedCategory){
                notyf.error('select your category! or click <i class="font-awesome-i fa-solid fa-add"></i> add your category first');
            }
            if (!this.selectedCategory || !this.newTodo.text.trim() || !this.newTodo.date) return;
            this.todoList[this.selectedCategory].push({ ...this.newTodo });
            this.newTodo.text = "";
            this.saveTodos();
            notyf.success("add task successfully!");
        },
        checkTodo(category, index) {
            this.todoList[category][index].completed = !this.todoList[category][index].completed;
            this.saveTodos();
            if(this.todoList[category][index].completed){
                notyf.success(`check task successfully!`);
            }
        },
        removeTodo(category, index) {
            this.todoList[category].splice(index, 1);

            // if (this.todoList[category].length === 0) {
            //     delete this.todoList[category];
            // }
            this.saveTodos();
            notyf.success("task successfully removed!");
        },
        toggleCategory(category) {
            const index = this.expandedCategories.indexOf(category);
            if (index === -1) {
                this.expandedCategories.push(category);
            } else {
                this.expandedCategories.splice(index, 1);
            }
        },
        sortedTodos(todos) {
            return todos.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
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

    }
}).mount('#app');
