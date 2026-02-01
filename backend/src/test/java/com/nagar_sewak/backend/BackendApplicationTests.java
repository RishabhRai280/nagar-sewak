package com.nagar_sewak.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackendApplicationTests {

	@org.springframework.boot.test.mock.mockito.MockBean
	private org.springframework.data.redis.core.RedisTemplate<String, Object> redisTemplate;

	@Test
	void contextLoads() {
	}

}
