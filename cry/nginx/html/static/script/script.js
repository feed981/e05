const { createApp } = Vue;
const notyf = new Notyf({
    duration: 3000, // 顯示 3 秒
    dismissible: true
});

const apiCry = axios.create({
    baseURL: "/api/v1/cry",
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

const apiKey = axios.create({
    baseURL: "/api/v1/key",
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

const apiAuth = axios.create({
    baseURL: "/api/v1/auth",
    headers: {
        'Content-Type': 'application/json'
    }
});

const encryptionService = {
    async encryptData(data ,onError) {
        try {
            if (!data || typeof data !== 'object') {
                notyf.error("Please complete all fields！");
                throw new Error("資料格式不正確");
            }

            for (const key in data) {
                if (!data[key]) {
                    notyf.error("Please complete all fields！");
                    throw new Error(`${key} 不能為空`);
                }
            }

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
            onError(false);
            notyf.error("encrypt error！")
            console.error('Encryption failed:', error);
            throw new Error('加密失敗: ' + error.message);
        };
    }
};

(function() {
    emailjs.init("un2nCxSnYlqZWdgMG");
})();

createApp({
    data() {
        return {
            isLight: false,
            isCrypt: true,
            username: '',
            password: '',
            itemname: '',
            errorMessage: '',
            success: '',
            successMessage: '',
            isSendEmail: false,
            isLoading: false,
            isLoading2: false,
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
        isCrypt() {
            this.clearForm();
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
    mounted() {
        this.checkOrGenerateToken();
    },
    computed: {
        format() {
            return this.isCrypt ? 'encrypt' : 'decrypt';
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
        async refreshToken() {
            try {
                const response = await apiAuth.get('/token');
                token = response.data;
                localStorage.setItem('token', token);
                notyf.success("refresh token success！")
            } catch (error) {
                console.error('無法獲取 token:', error);
                notyf.error("token error！")
            }
        },
        async checkOrGenerateToken() {
            let token = localStorage.getItem('token');
    
            if (!token) {
                try {
                    const response = await apiAuth.get('/token');
                    token = response.data;
                    localStorage.setItem('token', token);
                } catch (error) {
                    console.error('無法獲取 token:', error);
                    notyf.error("token error！")
                }
            }

            axios.interceptors.request.use(config => {
                let token = localStorage.getItem('token');

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                config.errorHandler = async (error) => {
                    if (error.response && error.response.status === 401) {
                        const newToken = await this.refreshToken();
                        if (newToken) {
                            config.headers.Authorization = `Bearer ${newToken}`;
                            return axios(config); // 重新發送請求
                        }
                    }
                    return Promise.reject(error);
                };
                return config;
            });
        },
        clearForm() {
            this.itemname = '';
            this.username = '';
            this.password = '';
            this.successMessage = '';
            this.errorMessage = '';
        },
        copyText() {
            if (!this.success) {
                return;
            }
            navigator.clipboard.writeText(this.success.trim())
                .then(() => notyf.success("copy success！"))
                .catch(err => console.error("copy error！", err));
        },
        async encrypt() {
            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';
            
            if (!this.itemname || !this.username || !this.password) {
                notyf.error("Please complete all fields！");
                this.isLoading = false;
                return;
            }

            const sensitiveData = {
                itemname: this.itemname,
                username: this.username,
                password: this.password
            };
            
            const encryptedData = await encryptionService.encryptData(
                sensitiveData, 
                (state) => this.isLoading = state // 當失敗時，回調修改 isLoading1
            );
            
            this.isLoading2 = true;
            await apiCry.post('/encrypt', {
                encryptedKey: encryptedData.encryptedKey,
                encryptedData: encryptedData.encryptedData
            }).then(response => {
                if (response.data.success === true) {
                    this.clearForm();
                    this.successMessage = `Your ${this.format.toUpperCase()} is
                     ${response.data.data}`;
                    this.success = response.data.data;
                    notyf.success("encrypt success！")

                }else if(response.data.success === false){
                    this.errorMessage = response.data.message;
                    this.successMessage = '';
                    notyf.error("encrypt error！")
                }
            }).catch(error => {
                notyf.error("encrypt error！")
                if (error.response) {
                    // this.errorMessage = '服务器内部错误';
                    this.errorMessage = error.response.data.message;
                    console.error('Request failed', error.response.data);
                } else if (error.request) {
                    console.error('No response received', error.request);
                } else {
                    console.error('Error', error.message);
                }
            }).finally(() => { 
                this.isLoading = false
                this.isLoading2 = false
            });
        },
        async decrypt() {
            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';
            
            if (!this.itemname || !this.username || !this.password) {
                notyf.error("Please complete all fields！");
                this.isLoading = false;
                return;
            }

            const sensitiveData = {
                itemname: this.itemname,
                username: this.username,
                password: this.password
            };
            
            const encryptedData = await encryptionService.encryptData(
                sensitiveData, 
                (state) => this.isLoading = state
            );

            this.isLoading2 = true;
            await apiCry.post('/decrypt', {
                encryptedKey: encryptedData.encryptedKey,
                encryptedData: encryptedData.encryptedData
            }).then(response => {
                if (response.data.success === true) {
                    this.clearForm();
                    this.successMessage = `Your ${this.format.toUpperCase()} is
                    ${response.data.data}`;
                    this.success = response.data.data;
                    notyf.success("decrypt success！")

                }else if(response.data.success === false){
                    this.errorMessage = response.data.message;
                    this.successMessage = '';
                    notyf.error("decrypt error！")
                }
            }).catch(error => {
                notyf.error("decrypt error！")
                if (error.response) {
                    // this.errorMessage = '服务器内部错误';
                    this.errorMessage = error.response.data.message;
                    console.error('Request failed', error.response.data);
                } else if (error.request) {
                    console.error('No response received', error.request);
                } else {
                    console.error('Error', error.message);
                }
            }).finally(() => { 
                this.isLoading = false;
                this.isLoading2 = false;
            });
        },
    }
}).mount('#app');