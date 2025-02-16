const app = Vue.createApp({
    data() {
        return {
            isLight: false,
            isCategoryVisible: false,
            isListVisible: false,
            newCategory: "",
            selectedCategory: "",
            newTodo: { text: "", date: "" },
            todoList: JSON.parse(localStorage.getItem("todos")) || {},
            expandedCategories: []
        };
    },
    computed: {
        isListVisible() {
            return Object.keys(this.todoList).length > 0; 
        }
    },
    watch: {
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
        exportTodolist(event) {
            const format = event.target.value;
            notyf.success(`${format} success!`);

            if (format === "exportJson") {
                this.exportJson();
            } else if (format === "viewAsJson") {
                this.viewAsJson();
            } else if (format === "exportHtml") {
                this.exportHtml();
            } else if (format === "viewAsHtml") {
                this.viewAsHtml();
            }
            event.target.value = "";
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
            if (!this.selectedCategory || !this.newTodo.text.trim() || !this.newTodo.date) return;
            this.todoList[this.selectedCategory].push({ ...this.newTodo });
            this.newTodo.text = "";
            this.newTodo.date = "";
            this.saveTodos();
        },
        removeTodo(category, index) {
            this.todoList[category].splice(index, 1);
            if (this.todoList[category].length === 0) {
                this.$delete(this.todoList, category);
            }
            this.saveTodos();
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
        exportJson() {
            const blob = new Blob([JSON.stringify(this.todoList, null, 2)], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "todo_list.json";
            a.click();
        },
        exportHtml() {
            let htmlContent = "<html><body><h1>Todo List</h1>";
            Object.keys(this.todoList).forEach(category => {
                htmlContent += `<h2>${category}</h2><ul>`;
                this.todoList[category].forEach(todo => {
                    htmlContent += `<li>${todo.text} (${todo.date})</li>`;
                });
                htmlContent += "</ul>";
            });
            htmlContent += "</body></html>";

            const blob = new Blob([htmlContent], { type: "text/html" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "todo_list.html";
            a.click();
        }
    }
});

app.mount("#app");
