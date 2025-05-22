package com.lms.util;

import org.springframework.stereotype.Component;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class KeyGenerator {

    public String generateKey() {
        byte[] key = new byte[32]; // 256-bit key
        SecureRandom random = new SecureRandom();
        random.nextBytes(key);
        return Base64.getEncoder().encodeToString(key);
    }

    public static void main(String[] args) {
        KeyGenerator generator = new KeyGenerator();
        System.out.println("Generated Secret Key: " + generator.generateKey());
    }
}
