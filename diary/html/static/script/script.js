const { createApp } = Vue;
const notyf = new Notyf({
    duration: 3000, // 顯示 3 秒
    dismissible: true
});

createApp({
    data() {
        return {
            isLight: false,
            isCalendarVisible: false,
            isDiaryVisible: false,
            username: '',
            password: '',
            currentYear: new Date().getFullYear(),
            currentMonth: new Date().getMonth(),
            currentUser: null,
            selectedDate: "",
            diaryEntry: "",
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            containerHeight: 250, // 初始高度
            selectedFormat: "json",
        };
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
    computed: {
        firstDay() {
            return new Date(this.currentYear, this.currentMonth, 1).getDay();
        },
        daysInMonth() {
            return new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        }
    },
    methods: {
        exportDiary(event) {
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
        exportJson() {
            if (!this.currentUser) {
              return;
            }
        
            const backup = [];
        
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(`diary_${this.currentUser}_`)) {
                    const date = key.replace(`diary_${this.currentUser}_`, ""); // 取得 YYYY-MM-DD
                    backup.push({ date, content: localStorage.getItem(key) });
                }
            }

            // sort
            backup.sort((a, b) => b.date.localeCompare(a.date));

            // convert to json
            const sortedBackup = backup.reduce((obj, entry) => {
                obj[`diary_${this.currentUser}_${entry.date}`] = entry.content;
                return obj;
            }, {});

            const data = JSON.stringify(sortedBackup, null, 2);
            const blob = new Blob([data], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `diary_backup_${this.currentUser}.json`;
            link.click();
            URL.revokeObjectURL(link.href);
        },
        viewAsJson() {
            if (!this.currentUser) {
                return;
            }

            const backup = [];
        
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(`diary_${this.currentUser}_`)) {
                    const date = key.replace(`diary_${this.currentUser}_`, ""); // 取得 YYYY-MM-DD
                    backup.push({ date, content: localStorage.getItem(key) });
                }
            }

            // sort
            backup.sort((a, b) => b.date.localeCompare(a.date));

            // convert to json
            const sortedBackup = backup.reduce((obj, entry) => {
                obj[`diary_${this.currentUser}_${entry.date}`] = entry.content;
                return obj;
            }, {});

            const data = JSON.stringify(sortedBackup, null, 2);

            const template = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>log - json</title><link rel="icon" href="favicon-log.ico" type="image/x-icon"><link rel="shortcut icon" href="favicon-log.ico" type="image/x-icon"><style>body{font-family:Arial,sans-serif;background-color:#1e1e1e;padding:20px;display:flex;flex-direction:column;align-items:center;color:#e0e0e0;transition:background .3s,color .3s}.container{width:100%;max-width:600px;display:flex;flex-direction:column;height:90vh}.log-container{flex-grow:1;overflow-y:auto;padding-top:10px}.log-entry{word-wrap: break-word;background:#2c2c2c;padding:15px;margin:10px 0;border-radius:10px;box-shadow:0 2px 5px rgba(0,0,0,.3);border-left:5px solid ;white-space:pre-line;color:#e0e0e0;transition:background .3s,color .3s}.log-title{font-size:18px;font-weight:700;margin-bottom:5px;color:#fff}.timestamp{font-size:14px;font-weight:700;color:#a0a0a0;display:block;margin-top:5px}a{color:#fff}.light-mode a{color:#1e1e1e}.light-mode{background-color:#414242;color:#333;margin-bottom:10px}.light-mode .log-entry{word-wrap: break-word; background:#fff;color:#333;border-left:5px solid ;box-shadow:0 2px 5px rgba(0,0,0,.1)}.light-mode .log-title{color:#222}.light-mode .timestamp{color:gray}.switch-container{display:flex;align-items:center;justify-content:center}.switch-label{font-size:16px;margin-left:10px}.switch{position:relative;display:inline-block;width:50px;height:25px}.switch input{opacity:0;width:0;height:0}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:25px}.slider:before{position:absolute;content:"";height:17px;width:17px;left:4px;bottom:4px;background-color:#fff;transition:.4s;border-radius:50%}input:checked+.slider{background-color:#1da1f2}input:checked+.slider:before{transform:translateX(24px)}</style>
</head><body><div id="app" class="container"><div class="switch-container"><label class="switch"><input type="checkbox" id="modeSwitch" onchange="toggleMode()"> <span class="slider"></span></label></div><br><pre class="log-entry">${data}</pre></div><script>function toggleMode(){document.body.classList.toggle("light-mode");var e=document.getElementById("modeSwitch");document.body.classList.contains("light-mode")?(localStorage.setItem("theme","light"),e.checked=!0):(localStorage.setItem("theme","dark"),e.checked=!1)}window.onload=function(){var e=document.getElementById("modeSwitch");"light"===localStorage.getItem("theme")&&(document.body.classList.add("light-mode"),e.checked=!0)}</script></body></html>`;
            
            const newTab = window.open();
            if (newTab) {
                newTab.document.write(template);
                newTab.document.close();
            } else {
                notyf.open({
                    type: 'warning',
                    message: '請允許彈出視窗以顯示 JSON!',
                    background: 'orange',
                    duration: 5000 // 5 秒後消失
                  });
            }
        },
        exportHtml() {
            if (!this.currentUser) {
                return;
            }

            const backup = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(`diary_${this.currentUser}_`)) {
                    backup[key] = localStorage.getItem(key);
                }
            }

            // 解析json
            const logs = Object.entries(backup)
            .map(([key, content]) => {
                const date = key.replace(`diary_${this.currentUser}_`, ""); // 提取 YYYY-MM-DD
                return { date, content };
            })
            .sort((a, b) => b.date.localeCompare(a.date)) // 日期降序排列
            .map(({ date, content }) => {
                return `<div class="log-entry"><p>${content.replace(/\n/g, "<br>")}</p><span class="timestamp">${date}</span></div>`;
            })
            .join("\n");
            
            const template = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>log - html</title><link rel="icon" href="favicon-log.ico" type="image/x-icon"><link rel="shortcut icon" href="favicon-log.ico" type="image/x-icon"><style>body{font-family:Arial,sans-serif;background-color:#1e1e1e;padding:20px;display:flex;flex-direction:column;align-items:center;color:#e0e0e0;transition:background .3s,color .3s}.container{width:100%;max-width:600px;display:flex;flex-direction:column;height:90vh}.log-container{flex-grow:1;overflow-y:auto;padding-top:10px}.log-entry{word-wrap: break-word; background:#2c2c2c;padding:15px;margin:10px 0;border-radius:10px;box-shadow:0 2px 5px rgba(0,0,0,.3);border-left:5px solid ;white-space:pre-line;color:#e0e0e0;transition:background .3s,color .3s}.log-title{font-size:18px;font-weight:700;margin-bottom:5px;color:#fff}.timestamp{font-size:14px;font-weight:700;color:#a0a0a0;display:block;margin-top:5px}a{color:#fff}.light-mode a{color:#1e1e1e}.light-mode{background-color:#414242;color:#333;margin-bottom:10px}.light-mode .log-entry{background:#fff;color:#333;border-left:5px solid ;box-shadow:0 2px 5px rgba(0,0,0,.1)}.light-mode .log-title{color:#222}.light-mode .timestamp{color:gray}.switch-container{display:flex;align-items:center;justify-content:center}.switch-label{font-size:16px;margin-left:10px}.switch{position:relative;display:inline-block;width:50px;height:25px}.switch input{opacity:0;width:0;height:0}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:25px}.slider:before{position:absolute;content:"";height:17px;width:17px;left:4px;bottom:4px;background-color:#fff;transition:.4s;border-radius:50%}input:checked+.slider{background-color:#1da1f2}input:checked+.slider:before{transform:translateX(24px)}</style>
</head><body><div id="app" class="container"><div class="switch-container"><label class="switch"><input type="checkbox" id="modeSwitch" onchange="toggleMode()"> <span class="slider"></span></label></div><br><div class="log-container">${logs}</div></div><script>function toggleMode(){document.body.classList.toggle("light-mode");var e=document.getElementById("modeSwitch");document.body.classList.contains("light-mode")?(localStorage.setItem("theme","light"),e.checked=!0):(localStorage.setItem("theme","dark"),e.checked=!1)}window.onload=function(){var e=document.getElementById("modeSwitch");"light"===localStorage.getItem("theme")&&(document.body.classList.add("light-mode"),e.checked=!0)}</script></body></html>`;

            // 生成html
            const blob = new Blob([template], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `diary_log_${this.currentUser}.html`;
            link.click();
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);
        },
        viewAsHtml() {
            if (!this.currentUser) {
                return;
            }

            const backup = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(`diary_${this.currentUser}_`)) {
                    backup[key] = localStorage.getItem(key);
                }
            }

            // 解析json
            const logs = Object.entries(backup)
            .map(([key, content]) => {
                const date = key.replace(`diary_${this.currentUser}_`, ""); // 提取 YYYY-MM-DD
                return { date, content };
            })
            .sort((a, b) => b.date.localeCompare(a.date)) // 日期降序排列
            .map(({ date, content }) => {
                return `<div class="log-entry"><p>${content.replace(/\n/g, "<br>")}</p><span class="timestamp">${date}</span></div>`;
            })
            .join("\n");
            
            const template = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Crypt times - log</title><link rel="icon" href="favicon-log.ico" type="image/x-icon"><link rel="shortcut icon" href="favicon-log.ico" type="image/x-icon"><style>body{font-family:Arial,sans-serif;background-color:#1e1e1e;padding:20px;display:flex;flex-direction:column;align-items:center;color:#e0e0e0;transition:background .3s,color .3s}.container{width:100%;max-width:600px;display:flex;flex-direction:column;height:90vh}.log-container{flex-grow:1;overflow-y:auto;padding-top:10px}.log-entry{word-wrap: break-word;background:#2c2c2c;padding:15px;margin:10px 0;border-radius:10px;box-shadow:0 2px 5px rgba(0,0,0,.3);border-left:5px solid ;white-space:pre-line;color:#e0e0e0;transition:background .3s,color .3s}.log-title{font-size:18px;font-weight:700;margin-bottom:5px;color:#fff}.timestamp{font-size:14px;font-weight:700;color:#a0a0a0;display:block;margin-top:5px}a{color:#fff}.light-mode a{color:#1e1e1e}.light-mode{background-color:#414242;color:#333;margin-bottom:10px}.light-mode .log-entry{background:#fff;color:#333;border-left:5px solid ;box-shadow:0 2px 5px rgba(0,0,0,.1)}.light-mode .log-title{color:#222}.light-mode .timestamp{color:gray}.switch-container{display:flex;align-items:center;justify-content:center}.switch-label{font-size:16px;margin-left:10px}.switch{position:relative;display:inline-block;width:50px;height:25px}.switch input{opacity:0;width:0;height:0}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:25px}.slider:before{position:absolute;content:"";height:17px;width:17px;left:4px;bottom:4px;background-color:#fff;transition:.4s;border-radius:50%}input:checked+.slider{background-color:#1da1f2}input:checked+.slider:before{transform:translateX(24px)}</style>
</head><body><div id="app" class="container"><div class="switch-container"><label class="switch"><input type="checkbox" id="modeSwitch" onchange="toggleMode()"> <span class="slider"></span></label></div><br><div class="log-container">${logs}</div></div><script>function toggleMode(){document.body.classList.toggle("light-mode");var e=document.getElementById("modeSwitch");document.body.classList.contains("light-mode")?(localStorage.setItem("theme","light"),e.checked=!0):(localStorage.setItem("theme","dark"),e.checked=!1)}window.onload=function(){var e=document.getElementById("modeSwitch");"light"===localStorage.getItem("theme")&&(document.body.classList.add("light-mode"),e.checked=!0)}</script></body></html>`;

            const newTab = window.open();
            if (newTab) {
                newTab.document.write(template);
                newTab.document.close();
            } else {
                notyf.open({
                    type: 'warning',
                    message: '請允許彈出視窗以顯示 HTML!',
                    background: 'orange',
                    duration: 5000 // 5 秒後消失
                });
            }
        },
        adjustHeight() {
            this.$nextTick(() => {
                let textarea = this.$refs.diaryTextarea;
                let title = this.$refs.diaryTitle;
                let buttonContainer = this.$refs.buttonContainer;
                textarea.style.height = "auto"; // 先恢复默认

                // 计算外层容器的总高度
                // let extraHeight = (title?.offsetHeight || 0) + (buttonContainer?.offsetHeight || 0) + 40;
                // this.containerHeight = Math.max(250, textarea.scrollHeight + extraHeight);
                textarea.style.height = textarea.scrollHeight + "px"; // 计算新高度
                this.containerHeight = Math.max(250, textarea.scrollHeight + 20); // 更新容器高度
            });
        },
        clearForm() {
            this.username = '';
            this.password = '';
        },
        register() {
            if (this.username && this.password) {
              let users = JSON.parse(localStorage.getItem("diaryUsers") || "[]");
              
              if (users.some(user => user.username === this.username)) {
                notyf.error("Username already exists!");
                return;
              }
              
              users.push({
                username: this.username,
                password: this.password
              });
              console.log(JSON.stringify(users))
              localStorage.setItem("diaryUsers", JSON.stringify(users));
              notyf.success("Register success!");
              this.clearForm();
            } else {
              notyf.error("Register error!");
            }
          },
      
          login() {
            let users = JSON.parse(localStorage.getItem("diaryUsers") || "[]");
            let user = users.find(u => 
              u.username === this.username && 
              u.password === this.password
            );
            
            if (user) {
              this.currentUser = this.username;
              notyf.success("Login success!");
              this.isCalendarVisible = true;
              this.clearForm();
            } else {
              notyf.error("Login error!");
            }
          },
        logout(){
            this.isCalendarVisible = false;
            this.isDiaryVisible = false;
        },
        prevMonth() {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = 11;
                this.currentYear--;
            }
        },
        nextMonth() {
            this.currentMonth++;
            if (this.currentMonth > 11) {
                this.currentMonth = 0;
                this.currentYear++;
            }
        },
        prevYear() {
            this.currentYear--;
        },
        nextYear() {
            this.currentYear++;
        },
        getDateString(day) {
            return `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          },
      
          hasDiaryEntry(day) {
            return localStorage.getItem(`diary_${this.currentUser}_${this.getDateString(day)}`) !== null;
          },
      
          openDiary(date) {
            this.selectedDate = date;
            this.diaryEntry = localStorage.getItem(`diary_${this.currentUser}_${date}`) || "";
            this.isDiaryVisible = true;
            
          },
      
          saveDiary() {
            if (this.diaryEntry.trim()) {
              localStorage.setItem(`diary_${this.currentUser}_${this.selectedDate}`, this.diaryEntry);
            } else {
              localStorage.removeItem(`diary_${this.currentUser}_${this.selectedDate}`);
            }
            this.isDiaryVisible = false;
          }
    }
}).mount('#app');