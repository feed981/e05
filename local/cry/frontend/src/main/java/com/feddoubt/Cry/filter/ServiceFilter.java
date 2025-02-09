package com.feddoubt.Cry.filter;

import com.feddoubt.common.Cry.config.jwt.JwtProvider;
import com.feddoubt.model.Cry.context.UserContext;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Slf4j
@Component
public class ServiceFilter extends OncePerRequestFilter {
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtProvider jwtProvider;

    public ServiceFilter(JwtProvider jwtProvider){
        this.jwtProvider = jwtProvider;
    }

    @Override
    protected void doFilterInternal(jakarta.servlet.http.HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response, jakarta.servlet.FilterChain filterChain) throws jakarta.servlet.ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        log.info("====== Filter Start ======");
        log.info("Request URI: {}", path);
        log.info("Request Method: {}", method);
        log.info("Request Headers: {}", Collections.list(request.getHeaderNames()));

        try {

            if (path.contains("/api/v1/auth/token")) {
                log.info("get auth token");
                log.info("Before chain.doFilter");
                filterChain.doFilter(request, response);
                log.info("After chain.doFilter");
            }

            if (path.contains("/api/v1/key/public") || path.contains("/api/v1/cry")) {
                String authHeader = request.getHeader(AUTHORIZATION_HEADER);
                log.info("authHeader: {}", authHeader);

                if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
                    log.warn("缺少或無效的 Authorization Header");
                    sendUnauthorizedResponse(response, "Missing or invalid Authorization header");
                    return;
                }

                String jwtToken = getJwtToken(authHeader);
                if (jwtToken == null) {
                    log.warn("JWT 解析失敗");
                    sendUnauthorizedResponse(response, "Invalid JWT token");
                    return;
                }
                log.warn("jwtToken:{}",jwtToken);

                String userId = jwtProvider.extractUsername(jwtToken);
                log.warn("userId:{}",userId);

                if (userId == null) {
                    log.warn("JWT 無法解析 User ID");
                    sendUnauthorizedResponse(response, "Invalid JWT token");
                    return;
                }

                log.info("JWT 驗證成功, userId: {}", userId);
            }

            log.info("Before chain.doFilter");
            filterChain.doFilter(request, response);
            log.info("After chain.doFilter");

        } catch (Exception e) {
            log.error("Filter error", e);
            sendUnauthorizedResponse(response, "Authentication error");
        } finally {
            log.info("離開 ServiceFilter - URL: {}", request.getRequestURI());
            UserContext.clear();
        }

    }

    private String getJwtToken(String header) {

        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }

        return null;
    }

    private void sendUnauthorizedResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }
}