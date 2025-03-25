package com.nidia.task.filter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * 前端點擊按鈕，跳轉到 http://localhost:64202/oauth2/authorization/google。
     * Spring Security 處理 OAuth 流程，重定向到 Google。
     * Google 返回授權碼到 http://localhost:64202/login/oauth2/code/google。
     * 後端交換令牌，跳轉到 /api/v1/auth，最終到 http://localhost:5173/task/v2。
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login/oauth2/code/google",
                                "/api/user/auth",
                                "/api/user/auth/context",
                                "/api/user/auth/token").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .redirectionEndpoint(redirection -> redirection
                                .baseUri("/login/oauth2/code/google")
                        )
                        .defaultSuccessUrl("/api/user/auth/context", true)
                        .failureUrl("/login?error")
                        .successHandler((request, response, authentication) -> {
                            System.out.println("OAuth2 認證成功: " + authentication.getPrincipal());
                            response.sendRedirect("/api/user/auth/context");
                        })
                        .failureHandler((request, response, exception) -> {
                            System.err.println("OAuth2 認證失敗: " + exception.getMessage());
                            response.sendRedirect("/login?error=" + exception.getMessage());
                        })
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/").permitAll()
                );

        return http.build();
    }
}