package com.nidia.task.controller;

import com.nidia.task.config.AppProperties;
import com.nidia.task.jwt.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/keys")
@CrossOrigin(origins = "${app.frontend.url}", allowCredentials = "true")
public class KeyController {

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private AppProperties appProperties;

    @GetMapping("/public")
    public ResponseEntity<?> getPublicKey(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
            
        System.out.println("getPublicKey token: " + token);
        // 驗證 token 並獲取用戶資訊
        String userInfo = jwtProvider.validateToken(token);
        System.out.println("userInfo: " + userInfo);
        if (userInfo == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }

        try {
            Path path = Paths.get("public_key.txt");
            String publicKey = Files.readString(path);
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(publicKey);
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Error reading public key");
        }
    }

    @GetMapping("/private")
    public ResponseEntity<String> getPrivateKey() {
        try {
            Path path = Paths.get("private_key.txt");
            String privateKey = Files.readString(path);
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(privateKey);
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Error reading private key");
        }
    }
} 