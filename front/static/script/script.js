const { createApp } = Vue;
const notyf = new Notyf({
    duration: 3000, // 顯示 3 秒
    dismissible: true
});

const encryptionService = {
    async encryptData(data) {
        try {
            const otherapi = axios.create({
                baseURL: '/api'
            });
            // 1. 獲取 RSA 公鑰
            const { data: publicKeyPEM } = await otherapi.get('/public-key');
            // 2. 生成 AES 金鑰
            const aesKey = CryptoJS.lib.WordArray.random(32);
            console.log("aesKey:"+aesKey);
            const aesKeyHex = aesKey.toString(CryptoJS.enc.Hex);
            
            // 3. RSA 加密 AES 金鑰
            const rsa = forge.pki.publicKeyFromPem(publicKeyPEM);
            const encryptedAESKey = forge.util.encode64(
                rsa.encrypt(aesKeyHex)
            );

            const iv = CryptoJS.lib.WordArray.random(16);
            // 4. AES 加密數據
            const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify(data),
                aesKey,
                {
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7,
                    iv: iv
                }
            );
//[IV (16 bytes)] + [Ciphertext (N bytes)]
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
            isCrypt: true,
            username: '',
            password: '',
            itemname: '',
            errorMessage: '',
            success: '',
            successMessage: '',
        };
    },
    watch: {
        isCrypt(newValue, oldValue) {
            this.clearForm();
        }
    },
    computed: {
        format() {
            return this.isCrypt ? 'encrypt' : 'decrypt';
        }
    },
    methods: {
        clearForm() {
            this.itemname = '';
            this.username = '';
            this.password = '';
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
            this.errorMessage = '';
            this.successMessage = '';
            
            if (!this.itemname || !this.username || !this.password) {
                notyf.error("Please complete all fields！");
                return;
            }

            const sensitiveData = {
                itemname: this.itemname,
                username: this.username,
                password: this.password
            };
            
            const encryptedData = await encryptionService.encryptData(sensitiveData);

            await axios.post('/encrypt', {
                encryptedKey: encryptedData.encryptedKey,
                encryptedData: encryptedData.encryptedData
            }).then(response => {
                if (response.data.success === true) {
                    this.clearForm();
                    this.errorMessage = '';
                    this.successMessage = `Your ${this.format.toUpperCase()} is
                     ${response.data.data}`;
                    this.success = response.data.data;
                    notyf.success("encrypt success！")

                }else if(response.data.success === false){
                    this.errorMessage = response.data.message;
                    this.successMessage = '';
                }
            }).catch(error => {
                if (error.response) {
                    // 服务器返回的响应数据
                    this.errorMessage = '服务器内部错误';
                    this.embedUrl = '';
                    console.error('Request failed', error.response.data);
                } else if (error.request) {
                    // 请求已发出但没有收到响应
                    console.error('No response received', error.request);
                } else {
                    // 其他错误，如设置请求时触发的错误
                    console.error('Error', error.message);
                }
            }).finally(() => { 
                // this.isLoading = false
            });
        },
        async decrypt() {
            this.errorMessage = '';
            this.successMessage = '';
            
            if (!this.itemname || !this.username || !this.password) {
                notyf.error("Please complete all fields！");
                return;
            }

            await axios.post('/decrypt', {
                itemname: this.itemname,
                username: this.username,
                password: this.password,
            }).then(response => {
                if (response.data.success === true) {
                    this.errorMessage = '';
                    this.successMessage = `Your ${this.format.toUpperCase()} is
                    ${response.data.data}`;
                    notyf.success("decrypt success！")

                }else if(response.data.success === false){
                    this.errorMessage = response.data.message;
                    this.successMessage = '';
                }
            }).catch(error => {
                if (error.response) {
                    // 服务器返回的响应数据
                    this.errorMessage = '服务器内部错误';
                    this.embedUrl = '';
                    console.error('Request failed', error.response.data);
                } else if (error.request) {
                    // 请求已发出但没有收到响应
                    console.error('No response received', error.request);
                } else {
                    // 其他错误，如设置请求时触发的错误
                    console.error('Error', error.message);
                }
            }).finally(() => { 
                // this.isLoading = false
            });
        },
    }
}).mount('#app');