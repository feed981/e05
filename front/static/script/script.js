const { createApp } = Vue;

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
            // 切換時清空輸入框
            this.username = '';
            this.password = '';
            this.itemname = '';
        }
    },
    computed: {
        format() {
            return this.isCrypt ? 'encrypt' : 'decrypt';
        }
    },
    methods: {
        copyText() {
            if (!this.success) {
                return;
            }
            navigator.clipboard.writeText(this.success.trim())
                .then(() => console.log("copy！"))
                .catch(err => console.error("copy error！", err));
        },
        async encrypt() {
            this.errorMessage = '';
            this.successMessage = '';
            
            await axios.post('/encrypt', {
                itemname: this.itemname,
                username: this.username,
                password: this.password,
            }).then(response => {
                if (response.data.success === true) {
                    this.errorMessage = '';
                    this.successMessage = `Your ${this.format.toUpperCase()} is
                     ${response.data.data}`;
                    this.success = response.data.data;
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
            
            await axios.post('/decrypt', {
                itemname: this.itemname,
                username: this.username,
                password: this.password,
            }).then(response => {
                if (response.data.success === true) {
                    this.errorMessage = '';
                    this.successMessage = `Your ${this.format.toUpperCase()} is
                     ${response.data.data}`;
                
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