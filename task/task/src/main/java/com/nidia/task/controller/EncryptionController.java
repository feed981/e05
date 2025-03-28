package com.nidia.task.controller;

import com.nidia.task.service.EncryptionService;
import com.nidia.task.jwt.JwtProvider;
import com.nidia.task.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class EncryptionController {

    @Autowired
    private EncryptionService encryptionService;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private UserService userService;

    @PostMapping(path = "/save", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> decrypt(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, String> request) {
        try {
            // 從 Authorization header 中提取 token
            String token = authHeader.replace("Bearer ", "");
            
            // 驗證 token 並獲取用戶資訊
            String userInfo = jwtProvider.validateToken(token);
            System.out.println("userInfo: " + userInfo);
            if (userInfo == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
            }

            // 解析用戶資訊
            String[] userDetails = userInfo.split(",");
            String email = userDetails[0];
            String name = userDetails[1];

            // 驗證用戶是否存在
            if (!userService.existsByEmail(email)) {
                return ResponseEntity.status(403).body(Map.of("error", "User not found"));
            }

            // 解密數據
            String encryptedData = request.get("encryptedData");
            System.out.println("encryptedData: " + encryptedData);
            String decryptedData = encryptionService.decrypt(encryptedData);

            Map<String, Object> response = new HashMap<>();
            System.out.println("decryptedData: " + decryptedData);
            response.put("decryptedData", decryptedData);
            response.put("user", Map.of(
                "email", email,
                "name", name
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Decryption failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/encrypt")
    public ResponseEntity<?> encrypt(@RequestBody Map<String, String> request) {
        try {
            String data = request.get("data");
            String encryptedData = encryptionService.encrypt(data);
            
            Map<String, String> response = new HashMap<>();
            response.put("encryptedData", encryptedData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Encryption failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 