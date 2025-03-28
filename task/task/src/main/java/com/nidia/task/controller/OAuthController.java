package com.nidia.task.controller;

import com.nidia.task.jwt.JwtProvider;
import com.nidia.task.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
    private final UserService userService;
    private final JwtProvider jwtProvider;

    @Autowired
    public OAuthController(UserService userService, JwtProvider jwtProvider) {
        // 配置 Google 的公開金鑰端點來解碼 JWT
        this.jwtDecoder = NimbusJwtDecoder.withJwkSetUri("https://www.googleapis.com/oauth2/v3/certs").build();
        this.userService = userService;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/auth/token")
    public ResponseEntity<Map<String, String>> verifyToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        System.out.println("token: " + token);
        try {
            Jwt jwt = jwtDecoder.decode(token);
            String email = jwt.getClaim("email");
            String name = jwt.getClaim("name");

            // 儲存或更新用戶資訊
            userService.saveOrUpdateUser(email, name);
            System.out.println("驗證成功: " + name + " (" + email + ")");

            // 生成 JWT token
            String jwtToken = jwtProvider.generateToken(email + "," + name);

            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("token", jwtToken);
            response.put("name", name);
            response.put("email", email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Token 驗證失敗: " + e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }
    }

    @GetMapping("/auth/context")
    public ResponseEntity<?> handleCallbackContext() {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        if (token == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication failed"));
        }

        OAuth2User principal = token.getPrincipal();
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String picture = principal.getAttribute("picture");

        // 儲存或更新用戶資訊
        userService.saveOrUpdateUser(email, name);
        System.out.println("auth success: 登入成功，歡迎 " + name + " (" + email + ")");

        // 生成 JWT token
        String jwtToken = jwtProvider.generateToken(email + "," + name);

        String redirectUrl = "http://localhost:5173/task/v2/login?token=" + jwtToken + 
            "&name=" + URLEncoder.encode(name, StandardCharsets.UTF_8) + 
            "&email=" + URLEncoder.encode(email, StandardCharsets.UTF_8) +
            "&picture=" + URLEncoder.encode(picture, StandardCharsets.UTF_8);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(redirectUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/auth")
    public ResponseEntity<?> handleCallback(@AuthenticationPrincipal OAuth2AuthenticationToken token) {
        if (token == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication failed"));
        }

        String email = token.getPrincipal().getAttribute("email");
        String name = token.getPrincipal().getAttribute("name");
        String picture = token.getPrincipal().getAttribute("picture");

        // 儲存或更新用戶資訊
        userService.saveOrUpdateUser(email, name);
        System.out.println("auth success: 登入成功，歡迎 " + name + " (" + email + ")");

        // 生成 JWT token
        String jwtToken = jwtProvider.generateToken(email + "," + name);

        String redirectUrl = "http://localhost:5173/task/v2/login?token=" + jwtToken + 
            "&name=" + URLEncoder.encode(name, StandardCharsets.UTF_8) + 
            "&email=" + URLEncoder.encode(email, StandardCharsets.UTF_8) +
            "&picture=" + URLEncoder.encode(picture, StandardCharsets.UTF_8);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(redirectUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }
}