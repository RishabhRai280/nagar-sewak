package com.nagarsewak.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig {
    
    @Bean
    public ConcurrentHashMap<String, Bucket> bucketCache() {
        return new ConcurrentHashMap<>();
    }
    
    public Bucket resolveBucket(String key) {
        return bucketCache().computeIfAbsent(key, k -> createNewBucket());
    }
    
    private Bucket createNewBucket() {
        // 100 requests per minute
        Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1)));
        return Bucket.builder()
            .addLimit(limit)
            .build();
    }
}
