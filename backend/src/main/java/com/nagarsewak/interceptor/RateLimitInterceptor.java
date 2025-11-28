package com.nagarsewak.interceptor;

import com.nagarsewak.config.RateLimitConfig;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {
    
    @Autowired
    private RateLimitConfig rateLimitConfig;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String key = getClientIP(request);
        Bucket bucket = rateLimitConfig.resolveBucket(key);
        
        if (bucket.tryConsume(1)) {
            return true;
        } else {
            response.setStatus(429);
            response.getWriter().write("Too many requests");
            return false;
        }
    }
    
    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
