package com.nidia.task.util;

import java.io.FileWriter;
import java.io.IOException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Base64;

public class RSAKeyGenerator {
    public static void main(String[] args) {
        try {
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
            keyGen.initialize(2048); // 使用 2048 位元的密鑰長度
            KeyPair pair = keyGen.generateKeyPair();
            
            PrivateKey privateKey = pair.getPrivate();
            PublicKey publicKey = pair.getPublic();
            
            // 將密鑰轉換為 Base64 格式
            String privateKeyString = Base64.getEncoder().encodeToString(privateKey.getEncoded());
            String publicKeyString = Base64.getEncoder().encodeToString(publicKey.getEncoded());
            
            // 保存私鑰到文件
            try (FileWriter writer = new FileWriter("private_key.txt")) {
                writer.write(privateKeyString);
                System.out.println("Private key saved to private_key.txt");
            }
            
            // 保存公鑰到文件
            try (FileWriter writer = new FileWriter("public_key.txt")) {
                writer.write(publicKeyString);
                System.out.println("Public key saved to public_key.txt");
            }
            
        } catch (NoSuchAlgorithmException | IOException e) {
            e.printStackTrace();
        }
    }
} 