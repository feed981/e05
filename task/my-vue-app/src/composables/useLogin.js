import { ref, onMounted } from "vue";
import { googleTokenLogin } from "vue3-google-login";
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/useStore';

const isLoggedIn = ref(false);
const userName = ref('');
const userEmail = ref('');

// onMounted(() => {
//     checkLoginStatus();
// });



export function useLogin() {
    const router = useRouter();
    const userStore = useUserStore();

    const handleGoogleLogin = (response) => {
        console.log("Google 登入回應:", response);
        // 處理登入成功的回應
      };

      
    // 前端使用 googleTokenLogin() 獲取 Token。
    // 將 Token 發送到後端 /api/v1/auth/token。
    // 後端驗證 Token，儲存使用者資訊，然後返回成功訊息。
     const triggerGoogleLogin = async () => {
      try {
        const response = await googleTokenLogin();
        console.log("Google 登入回應:", response);
  
        // 將 token 發送到後端
        const backendResponse = await fetch("http://localhost:64202/api/user/auth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: response.access_token || response.id_token, // 根據回應選擇
          }),
        });
  
        if (backendResponse.ok) {
          const result = await backendResponse.json();
          console.log("後端回應:", result);
          // 處理登入成功後的回調
          handleLoginSuccess(result.userData, result.token);
        } else {
          console.error("後端驗證失敗:", backendResponse.status);
        }
      } catch (error) {
        console.error("登入失敗:", error);
      }
    };

    // 處理登入成功後的回調
    const handleLoginSuccess = (userData, token) => {
      userStore.setUser(userData);
      userStore.setToken(token);
      router.push({ name: 'v2.home' });
    };


      const triggerGoogleLogin2 = () => {
        window.location.href = "http://localhost:64202/oauth2/authorization/google";
    };

      // 處理 OAuth 回調參數
      const handleOAuthCallback = (params) => {
        const token = params.get('token');
        const name = params.get('name');
        const email = params.get('email');
        const picture = params.get('picture');

        if (token && name && email) {
            // 構建用戶數據
            const userData = {
                name: decodeURIComponent(name),
                email: decodeURIComponent(email),
                picture: decodeURIComponent(picture)
            };
            // 保存用戶信息和 token
            userStore.setUser(userData);
            userStore.setToken(token);

            // 重定向到首頁
            router.push({ name: 'v2.home' });
        }
    };




    const logout = () => {
      window.location.href = "http://localhost:64202/logout"; // 觸發後端登出
    };


    return {
        handleGoogleLogin,
        triggerGoogleLogin,
        handleLoginSuccess,
        triggerGoogleLogin2,
        handleOAuthCallback,
        logout,
    };
}