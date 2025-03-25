package com.nidia.task.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class OAuthController {

    /**
     * 流程：
     * 前端使用 googleTokenLogin() 獲取 Token。
     * 將 Token 發送到後端 /api/v1/auth/token。
     * 後端驗證 Token，儲存使用者資訊，然後返回成功訊息。
     * 前端根據回應跳轉到 http://localhost:5173/task/v2。
     */
    private final JwtDecoder jwtDecoder;

    public OAuthController() {
        // 配置 Google 的公開金鑰端點來解碼 JWT
        this.jwtDecoder = NimbusJwtDecoder.withJwkSetUri("https://www.googleapis.com/oauth2/v3/certs").build();
    }

    @PostMapping("/auth/token")
    public ResponseEntity<Map<String, String>> verifyToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        try {
            // 解碼並驗證 Google 的 JWT
            Jwt jwt = jwtDecoder.decode(token);
            String email = jwt.getClaim("email");
            String name = jwt.getClaim("name");

            // 在這裡儲存使用者資訊到 MySQL（假設有 UserService）
            System.out.println("驗證成功: " + name + " (" + email + ")");

            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("name", name);
            response.put("email", email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Token 驗證失敗: " + e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }
    }

    @GetMapping("/auth/context")
    public ModelAndView handleCallbackContext() {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        if (token == null) {
            System.out.println("Token is null");
            return new ModelAndView("redirect:/login?error=authentication_failed");
        }

        OAuth2User principal = token.getPrincipal();
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        System.out.println("auth success: 登入成功，歡迎 " + name + " (" + email + ")");
        return new ModelAndView("redirect:http://localhost:5173/task/v2");
    }

    // 原有的 /auth 端點保持不變
    @GetMapping("/auth")
    public ModelAndView handleCallback(@AuthenticationPrincipal OAuth2AuthenticationToken token) {
        if (token == null) {
            System.out.println("Token is null");
            return new ModelAndView("redirect:/login?error=authentication_failed");
        }
        String email = token.getPrincipal().getAttribute("email");
        String name = token.getPrincipal().getAttribute("name");
        System.out.println("auth success: 登入成功，歡迎 " + name + " (" + email + ")");
        return new ModelAndView("redirect:http://localhost:5173/task/v2");
    }
}