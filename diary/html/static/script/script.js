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

let template_s = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Diary Export</title><link rel="icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon"><link rel="shortcut icon" href="https://d2luynvj2paf55.cloudfront.net/favicon.ico" type="image/x-icon">
<style>
body{font-family:Arial,sans-serif;background-color:#1e1e1e;padding:20px;display:flex;flex-direction:column;align-items:center;color:#e0e0e0;transition:background .3s,color .3s}
body::-webkit-scrollbar {
    display: none;
}
.container{width:100%;max-width:600px;display:flex;
flex-direction:column;height:90vh;
}
.log-container{flex-grow:1;overflow-y:auto;padding-top:10px;}
.log-entry{word-wrap: break-word;padding:15px;border-radius:50px;box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px; white-space:pre-line;color:#e0e0e0;
transition:background 1s,margin 1s,color .3s }
.log-entry:hover{background:#2C2C2C;
margin: 10px 0px;
box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}
.log-title{font-size:18px;font-weight:700;margin-bottom:5px;color:#fff}.timestamp{font-size:14px;font-weight:700;color:#a0a0a0;display:block;margin-top:5px}a{color:#fff}.light-mode a{color:#1e1e1e}.light-mode{background-color:#414242;color:#333;margin-bottom:10px}.light-mode .log-entry{background:#fff;color:#333;border-left:5px solid ;box-shadow:0 2px 5px rgba(0,0,0,.1)}pre{white-space: pre-wrap; /* 保留換行並自動換行 */ word-wrap: break-word; /* 讓長單詞換行 */}</style></head><body><div id="app" class="container">`;
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