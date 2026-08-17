
우선 AuthenticationFilter가 로그인 요청이 들어오면 인증되지 않은 토큰을 생성합니다. 그리고 해당 토큰을 AuthenticationManager에게 전달하여 인증을 요청합니다. AuthenticationManager는 토큰 정보를 읽고 Providers 중 적절한 Provider를 찾고 해당 Provider로 인해 UserDetailService에서 UserDetails 객체를 가져옵니다. 해당 과정에서 실질적인 사용자 정보를 가져오기에 DB 작업이 발생할 수 있습니다. DB에서 가져온 사용자 정보와 요청받은 정보가 동일하다면 Authentication 객체를 반환합니다. 그리고 해당 객체는 SecurityContextHolder에 저장됩니다. 

자세한 내용은 [[spring-security|Spring Security]]를 참고

> [!QUESTION]- 인증 객체를 ThreadLocal에 저장하는 이유
> Spring MVC에서는 일반적으로 하나의 요청을 하나의 스레드가 처리합니다. 따라서 Spring Security는 `SecurityContext`를 `ThreadLocal`에 저장하여 같은 요청 흐름 어디서든 현재 사용자의 인증 정보에 접근할 수 있도록 하고, 동시에 스레드별로 인증 정보를 격리합니다. 또한 WAS의 스레드는 재사용되므로 요청 처리가 끝난 뒤에는 반드시 `SecurityContext`를 제거해야 합니다. 다만 비동기 처리나 새로운 스레드를 생성하면 `ThreadLocal` 값이 자동으로 전달되지 않기 때문에 별도의 전파 전략이 필요합니다.
