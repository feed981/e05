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

let template_s = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Diary Export</title><link rel="icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><link rel="shortcut icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><style>body{font-family:Arial,sans-serif;background-color:#1e1e1e;padding:20px;display:flex;flex-direction:column;align-items:center;color:#e0e0e0;transition:background .3s,color .3s}body::-webkit-scrollbar{display:none}.container{width:100%;max-width:600px;display:flex;flex-direction:column;height:90vh}.log-container{flex-grow:1;overflow-y:auto;padding-top:10px}.log-entry{word-wrap:break-word;padding:15px;border-radius:50px;box-shadow:rgba(0,0,0,.17) 0 -23px 25px 0 inset,rgba(0,0,0,.15) 0 -36px 30px 0 inset,rgba(0,0,0,.1) 0 -79px 40px 0 inset,rgba(0,0,0,.06) 0 2px 1px,rgba(0,0,0,.09) 0 4px 2px,rgba(0,0,0,.09) 0 8px 4px,rgba(0,0,0,.09) 0 16px 8px,rgba(0,0,0,.09) 0 32px 16px;white-space:pre-line;color:#e0e0e0;transition:background 1s,margin 1s,color .3s}.log-entry:hover{background:#2c2c2c;margin:10px 0;box-shadow:rgba(0,0,0,.4) 0 2px 4px,rgba(0,0,0,.3) 0 7px 13px -3px,rgba(0,0,0,.2) 0 -3px 0 inset}.log-title{font-size:18px;font-weight:700;margin-bottom:5px;color:#fff}.timestamp{font-size:14px;font-weight:700;color:#a0a0a0;display:block;margin-top:5px}a{color:#fff}.light-mode a{color:#1e1e1e}.light-mode{background-color:#414242;color:#333;margin-bottom:10px}.light-mode .log-entry{background:#fff;color:#333;border-left:5px solid;box-shadow:0 2px 5px rgba(0,0,0,.1)}pre{white-space:pre-wrap;word-wrap:break-word}</style></head><body><div id="app" class="container">`;
let template_e = `</div></body></html>`;
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
            today: new Date().getDate(),
            weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            containerHeight: 250, // 初始高度
            selectedFormat: "json",
            dropdownview: false,
            isLogin: false,
            isSendEmail: false,
            isLoading: false,
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
            calendarKey: 0
        };
    },
    watch: {
        watch: {
            isSendEmail(newVal){
                if (!newVal) {
                    this.formData = {
                        pageTitle: '',
                        currentURL: '',
                        to_email: '',
                        from_name: '',
                        message: ''
                    };
                }
            },
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
    computed: {
        firstDay() {
            return new Date(this.currentYear, this.currentMonth, 1).getDay();
        },
        daysInMonth() {
            return new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        }
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
        getSortedDiaryEntries(user) {
            if (!user) return [];

            const entries = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(`diary_${user}_`)) {
                    const date = key.replace(`diary_${user}_`, ""); // 提取 YYYY-MM-DD
                    entries.push({ date, content: localStorage.getItem(key) });
                }
            }

            return entries.sort((a, b) => b.date.localeCompare(a.date));
        },
        toJSON(user) {
            const entries = this.getSortedDiaryEntries(user);
            const sortedBackup = entries.reduce((obj, entry) => {
                obj[`diary_${user}_${entry.date}`] = entry.content;
                return obj;
            }, {});
        
            return JSON.stringify(sortedBackup, null, 2);
        },
        toHTML(user) {
            return this.getSortedDiaryEntries(user)
                .map(({ date, content }) => {
                    return `<div class="log-entry">
                                <p>${content.replace(/\n/g, "<br>")}</p>
                                <span class="timestamp">${date}</span>
                            </div>`;
                })
                .join("\n");
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
            let viewAs = '';
            if(format === 'json'){
                const jsonString = this.toJSON(this.currentUser);
                viewAs = `${template_s}<pre>${jsonString}</pre>${template_e}`;

            }else if (format === 'html') {
                const htmlContent = this.toHTML(this.currentUser);
                viewAs = `${template_s}<div class="log-container">${htmlContent}</div>${template_e}`;
            }
            this.viewopen(viewAs ,format)
        },
        getTodayDate() {
            const today = new Date();
            return today.toISOString().split("T")[0]; // 轉成 YYYY-MM-DD 格式
        },
        handleFileUpload(event){
            const diaries = ([]);
            const file = event.target.files[0];
            if (!file) return;
            this.isLoading = true;
            
            const fileName = file.name; // 獲取檔名
            const match = fileName.match(/^diary_(\w+)_\d{4}-\d{2}-\d{2}\.json$/);
/**
 * 
diary_bbb.json	 允許
diary_ccc.json	 拒絕（user 不符）
diary_bbb.txt	 拒絕（格式錯誤）
random_file.json	 拒絕（檔名格式錯誤）
diary_bbb_2025-02-21.json	 允許
 */
            if (!match) {
                notyf.error("Failed to import ,please check your file format!");
                this.isLoading = false;
                return;
            }

            const fileUser = match[1]; // 取得 user
            const extension = fileName.substring(fileName.lastIndexOf(".") + 1);
            
            if (fileUser !== this.currentUser) {
                notyf.error(`Failed to import ${fileUser} ,is not ${this.currentUser}'s file!`);
                this.isLoading = false;
                return;
            }

            // 檔案格式必須為 json
            if (extension !== "json") {
                notyf.error(`Failed to import ${extension} file!`);
                this.isLoading = false;
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    // 解析 JSON 並存入 localStorage
                    diaries.value = Object.entries(json)
                    .map(([key, text]) => {
                        const date = key.split("_").slice(-1)[0]; // 提取日期
                        this.importSaveDiary(fileUser, text, date); // 直接存入 localStorage
                        return { date, text };
                    })
                    .sort((a, b) => new Date(b.date) - new Date(a.date)); // 按日期排序（新 → 舊）
                } catch (error) {
                    console.error('Import failed:', error);
                    notyf.error("Failed to import！");
                }
            };
            reader.readAsText(file);

            diaries.value = []; // 清空
            setTimeout(() => {
                this.calendarKey += 1; // 改變 key 來強制 Vue 重新渲染
                this.dropdownview = false;
            }, 100);
            setTimeout(() => {
                this.isLoading = false;
                notyf.success("LoadDiaries successfully!");
            }, 3000);

        },
        exportfile(template ,format ,type ,user){
            try {
                const blob = new Blob([template], { type: type });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `diary_${user}_${this.getTodayDate()}.${format}`;
                link.click();
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 1000);
            } catch (error) {
                console.error('Export failed:', error);
                notyf.error(`Failed to export ${format} file`);
            }
        },
        exportAs(format) {
            notyf.success(`Exporting as ${format.toUpperCase()}`);
            let exportAs = '';
            let type = '';
            const user = this.currentUser;
            if(format === 'json'){
                exportAs = this.toJSON(user);
                type = "application/json";
                
            }else if (format === 'html') {
                const htmlContent = this.toHTML(user);
                exportAs = `${template_s}<div class="log-container">${htmlContent}</div>${template_e}`;
                type = "text/html";
            }

            this.exportfile(exportAs ,format , type ,user);
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
              this.isLogin = true;
              this.isCalendarVisible = true;
              this.clearForm();
            } else {
              notyf.error("Login error!");
            }
          },
        logout(){
            this.isLogin = false;
            this.isCalendarVisible = false;
            this.isDiaryVisible = false;
            this.isSendEmail = false;
        },
        isToday(day) {
            const now = new Date();
            return (
                day === this.today &&
                this.currentYear === now.getFullYear() &&
                this.currentMonth === now.getMonth()
            );
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
          importSaveDiary(user, text, date) {
            const key = `diary_${user}_${date}`;
            const existing = localStorage.getItem(key);
            if (text.trim()) {
                if (existing) {
                    localStorage.setItem(key, existing + "\n" + text); // 已有日記則追加
                } else {
                    localStorage.setItem(key, text);
                }
            }
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