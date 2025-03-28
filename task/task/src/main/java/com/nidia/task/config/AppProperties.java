package com.nidia.task.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppProperties {
    
    @Value("${app.frontend.url}")
    private String frontendUrl;
    
    @Value("${app.backend.url}")
    private String backendUrl;

    public String getFrontendUrl() {
        return frontendUrl;
    }

    public String getBackendUrl() {
        return backendUrl;
    }
} 