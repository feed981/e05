package com.nidia.task.service;

import com.nidia.task.entity.User;
import com.nidia.task.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public User saveOrUpdateUser(String email, String name) {
        User user = userRepository.findByEmail(email)
                .orElse(new User(email, name));

        if (user.getId() != null) {
            // 更新最後登入時間
            user.setLastLogin(LocalDateTime.now());
        }

        return userRepository.save(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
} 