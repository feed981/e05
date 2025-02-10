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
            errorMessage: '',
            successMessage: '',
            currentYear: new Date().getFullYear(),
            currentMonth: new Date().getMonth(),
            selectedDate: "",
            diaryEntry: "",
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            containerHeight: 250 // 初始高度
        };
    },
    mounted() {
        // this.checkOrGenerateToken();
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
        async checkOrGenerateToken() {
            let token = localStorage.getItem('token');
    
            if (!token) {
                try {
                    const response = await apiAuth.get('/token');
                    token = response.data;
                    localStorage.setItem('token', token);
                } catch (error) {
                    console.error('無法獲取 token:', error);
                }
            }
            axios.interceptors.request.use(config => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            });
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
                localStorage.setItem("diaryUser", this.username);
                localStorage.setItem("diaryPass", this.password);
                notyf.success("register success！");
                this.clearForm();
            } else {
                notyf.error("register error！");
            }
        },
        login() {
            let storedUser = localStorage.getItem("diaryUser");
            let storedPass = localStorage.getItem("diaryPass");
            
            if (this.username === storedUser && this.password === storedPass) {
                notyf.success("login success！")
                this.isCalendarVisible = true;
                this.clearForm();
            } else {
                notyf.error("login error！")
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
            return localStorage.getItem("diary_" + this.getDateString(day)) !== null;
        },
        openDiary(date) {
            this.selectedDate = date;
            this.diaryEntry = localStorage.getItem("diary_" + date) || "";
            this.isDiaryVisible = true;
        },
        saveDiary() {
            if (this.diaryEntry.trim()) {
                localStorage.setItem("diary_" + this.selectedDate, this.diaryEntry);
            } else {
                localStorage.removeItem("diary_" + this.selectedDate);
            }
            this.isDiaryVisible = false;
        },
        // async encrypt() {
        //     this.errorMessage = '';
        //     this.successMessage = '';
            
        //     if (!this.itemname || !this.username || !this.password) {
        //         notyf.error("Please complete all fields！");
        //         return;
        //     }

        //     const sensitiveData = {
        //         itemname: this.itemname,
        //         username: this.username,
        //         password: this.password
        //     };
            
        //     const encryptedData = await encryptionService.encryptData(sensitiveData);

        //     await apiCry.post('/encrypt', {
        //         encryptedKey: encryptedData.encryptedKey,
        //         encryptedData: encryptedData.encryptedData
        //     }).then(response => {
        //         if (response.data.success === true) {
        //             this.clearForm();
        //             this.successMessage = `Your ${this.format.toUpperCase()} is
        //              ${response.data.data}`;
        //             this.success = response.data.data;
        //             notyf.success("encrypt success！")

        //         }else if(response.data.success === false){
        //             this.errorMessage = response.data.message;
        //             this.successMessage = '';
        //         }
        //     }).catch(error => {
        //         if (error.response) {
        //             this.errorMessage = '服务器内部错误';
        //             this.embedUrl = '';
        //             console.error('Request failed', error.response.data);
        //         } else if (error.request) {
        //             console.error('No response received', error.request);
        //         } else {
        //             console.error('Error', error.message);
        //         }
        //     });
        // },
        // async decrypt() {
        //     this.errorMessage = '';
        //     this.successMessage = '';
            
        //     const sensitiveData = {
        //         itemname: this.itemname,
        //         username: this.username,
        //         password: this.password
        //     };
            
        //     const encryptedData = await encryptionService.encryptData(sensitiveData);

        //     await apiCry.post('/decrypt', {
        //         encryptedKey: encryptedData.encryptedKey,
        //         encryptedData: encryptedData.encryptedData
        //     }).then(response => {
        //         if (response.data.success === true) {
        //             this.clearForm();
        //             this.successMessage = `Your ${this.format.toUpperCase()} is
        //             ${response.data.data}`;
        //             this.success = response.data.data;
        //             notyf.success("decrypt success！")

        //         }else if(response.data.success === false){
        //             this.errorMessage = response.data.message;
        //             this.successMessage = '';
        //         }
        //     }).catch(error => {
        //         if (error.response) {
        //             this.errorMessage = '服务器内部错误';
        //             this.embedUrl = '';
        //             console.error('Request failed', error.response.data);
        //         } else if (error.request) {
        //             console.error('No response received', error.request);
        //         } else {
        //             console.error('Error', error.message);
        //         }
        //     });
        // },
    }
}).mount('#app');