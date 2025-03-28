package com.nidia.task.service;

import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Random;

@Service
public class EncryptionService {

    private static final String PRIVATE_KEY_PATH = "private_key.txt";
    private static final String PUBLIC_KEY_PATH = "public_key.txt";

    private PrivateKey getPrivateKey() throws Exception {
        String privateKeyString = Files.readString(Path.of(PRIVATE_KEY_PATH));
        byte[] keyBytes = Base64.getDecoder().decode(privateKeyString);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePrivate(spec);
    }

    private PublicKey getPublicKey() throws Exception {
        String publicKeyString = Files.readString(Path.of(PUBLIC_KEY_PATH));
        byte[] keyBytes = Base64.getDecoder().decode(publicKeyString);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePublic(spec);
    }

    public String encrypt(String data) throws Exception {
        // 生成 AES 密鑰
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(256);
        SecretKey aesKey = keyGen.generateKey();

        // 生成 IV
        byte[] iv = new byte[16];
        new Random().nextBytes(iv);
        IvParameterSpec ivSpec = new IvParameterSpec(iv);

        // 使用 AES 加密數據
        Cipher aesCipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        aesCipher.init(Cipher.ENCRYPT_MODE, aesKey, ivSpec);
        byte[] encryptedData = aesCipher.doFinal(data.getBytes());

        // 使用 RSA 加密 AES 密鑰
        Cipher rsaCipher = Cipher.getInstance("RSA");
        rsaCipher.init(Cipher.ENCRYPT_MODE, getPublicKey());
        byte[] encryptedKey = rsaCipher.doFinal(aesKey.getEncoded());

        // 組合所有部分
        byte[] combined = new byte[iv.length + encryptedKey.length + encryptedData.length];
        System.arraycopy(iv, 0, combined, 0, iv.length);
        System.arraycopy(encryptedKey, 0, combined, iv.length, encryptedKey.length);
        System.arraycopy(encryptedData, 0, combined, iv.length + encryptedKey.length, encryptedData.length);

        return Base64.getEncoder().encodeToString(combined);
    }

    public String decrypt(String encryptedData) throws Exception {
        // 解碼 Base64
        byte[] combined = Base64.getDecoder().decode(encryptedData);

        // 提取 IV
        byte[] iv = new byte[16];
        System.arraycopy(combined, 0, iv, 0, iv.length);
        IvParameterSpec ivSpec = new IvParameterSpec(iv);

        // 提取加密的 AES 密鑰
        byte[] encryptedKey = new byte[256]; // RSA 2048 加密後的大小
        System.arraycopy(combined, iv.length, encryptedKey, 0, encryptedKey.length);

        // 使用 RSA 解密 AES 密鑰
        Cipher rsaCipher = Cipher.getInstance("RSA");
        rsaCipher.init(Cipher.DECRYPT_MODE, getPrivateKey());
        byte[] aesKeyBytes = rsaCipher.doFinal(encryptedKey);

        // 重建 AES 密鑰
        SecretKey aesKey = new javax.crypto.spec.SecretKeySpec(aesKeyBytes, "AES");

        // 提取加密的數據
        byte[] encryptedContent = new byte[combined.length - iv.length - encryptedKey.length];
        System.arraycopy(combined, iv.length + encryptedKey.length, encryptedContent, 0, encryptedContent.length);

        // 使用 AES 解密數據
        Cipher aesCipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        aesCipher.init(Cipher.DECRYPT_MODE, aesKey, ivSpec);
        byte[] decryptedData = aesCipher.doFinal(encryptedContent);

        return new String(decryptedData);
    }
} 