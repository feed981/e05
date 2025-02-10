const { createApp } = Vue;
const notyf = new Notyf({
    duration: 3000, // 顯示 3 秒
    dismissible: true
});

// const apiCry = axios.create({
//     baseURL: "/api/v1/cry",
//     headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('token')}`
//     }
// });

// const apiKey = axios.create({
//     baseURL: "/api/v1/key",
//     headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('token')}`
//     }
// });

// const apiAuth = axios.create({
//     baseURL: "/api/v1/auth",
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });

const encryptionService = {
    async encryptData(data) {
        try {
            const { data: publicKeyPEM } = await apiKey.get('/public');
            const aesKey = CryptoJS.lib.WordArray.random(32);
            const aesKeyHex = aesKey.toString(CryptoJS.enc.Hex);
            const rsa = forge.pki.publicKeyFromPem(publicKeyPEM);
            const encryptedAESKey = forge.util.encode64(
                rsa.encrypt(aesKeyHex)
            );

            const iv = CryptoJS.lib.WordArray.random(16);
            const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify(data),
                aesKey,
                {
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7,
                    iv: iv
                }
            );
            const finalCiphertext = CryptoJS.enc.Base64.stringify(
                CryptoJS.lib.WordArray.create(iv.words.concat(encryptedData.ciphertext.words))
            );
            
            return {
                encryptedKey: encryptedAESKey,
                encryptedData: finalCiphertext
            };
        } catch (error) {
            console.error('Encryption failed:', error);
            throw new Error('加密失敗: ' + error.message);
        }
    }
};

createApp({
    data() {
        return {
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
        };
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
        backupDiary() {
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
            
            const data = JSON.stringify(backup, null, 2);
            const blob = new Blob([data], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `diary_backup_${this.currentUser}.json`;
            link.click();
            URL.revokeObjectURL(link.href);
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