import CryptoJS from 'crypto-js';
import { useUserStore } from '@/store/useStore';

export const encryption = {
    // 加密數據
    async encrypt(data) {
        try {
            const userStore = useUserStore();
            const response = await fetch('http://localhost:64202/api/keys/public', {
                headers: {
                    'Authorization': `Bearer ${userStore.token}`,
                    'Accept': 'text/plain'  // 指定接受純文本格式
                }
            });
            const publicKey = await response.text();
            console.log('publicKey', publicKey);
            
            const jsonString = JSON.stringify(data);
            const encrypted = CryptoJS.AES.encrypt(jsonString, publicKey).toString();
            return encrypted;
        } catch (error) {
            console.error('Encryption failed:', error);
            return null;
        }
    },

    async decrypt(encryptedData) {
        try {
            const userStore = useUserStore();
            const response = await fetch('http://localhost:64202/api/encryption/decrypt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userStore.token}`
                },
                body: JSON.stringify({ encryptedData })
            });
            
            if (!response.ok) {
                throw new Error('Decryption failed');
            }
            
            const decryptedData = await response.json();
            return decryptedData;
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }
}; 