import { ref, onMounted } from "vue";
import { googleTokenLogin } from "vue3-google-login";

const isLoggedIn = ref(false);
const userName = ref('');
const userEmail = ref('');

// onMounted(() => {
//     checkLoginStatus();
// });



export function useLogin() {

    const checkLoginStatus = async() => {
        try {
            const response = await fetch("http://localhost:64202/api/user/check", {
            credentials: "include", // 確保攜帶 Cookie
            });
            const data = await response.json();
            isLoggedIn.value = data.loggedIn;
            if (isLoggedIn.value) {
            userName.value = data.name;
            userEmail.value = data.email;
            }
        } catch (error) {
            console.error("檢查登入狀態失敗:", error);
        }
    };
    

    const handleGoogleLogin = (response) => {
        console.log("Google 登入回應:", response);
        // 處理登入成功的回應
      };

      const triggerGoogleLogin2 = () => {
        
        // 直接跳轉到後端的 OAuth 登入端點
        window.location.href = "http://localhost:64202/oauth2/authorization/google";
      };
    
   
    
      // 前端使用 googleTokenLogin() 獲取 Token。
      // 將 Token 發送到後端 /api/v1/auth/token。
      // 後端驗證 Token，儲存使用者資訊，然後返回成功訊息。
       const triggerGoogleLogin = async () => {
        try {
          const response = await googleTokenLogin();
          console.log("Google 登入回應:", response);
    
          // 將 token 發送到後端
          const backendResponse = await fetch("http://localhost:64202/api/v1/auth/token", {
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
            // 根據後端回應跳轉
            window.location.href = "http://localhost:5173/task/v2";
          } else {
            console.error("後端驗證失敗:", backendResponse.status);
          }
        } catch (error) {
          console.error("登入失敗:", error);
        }
      };
      const logout = () => {
        window.location.href = "http://localhost:64202/logout"; // 觸發後端登出
      };

    return {
        checkLoginStatus,
        handleGoogleLogin,
        triggerGoogleLogin,
        triggerGoogleLogin2,
        logout,
    };
}