
우선 AuthenticationFilter가 로그인 요청이 들어오면 인증되지 않은 토큰을 생성합니다. 그리고 해당 토큰을 AuthenticationManager에게 전달하여 인증을 요청합니다. AuthenticationManager는 토큰 정보를 읽고 Providers 중 적절한 Provider를 찾고 해당 Provider로 인해 UserDetailService에서 UserDetails 객체를 가져옵니다. 해당 과정에서 실질적인 사용자 정보를 가져오기에 DB 작업이 발생할 수 있습니다. DB에서 가져온 사용자 정보와 요청받은 정보가 동일하다면 Authentication 객체를 반환합니다. 그리고 해당 객체는 SecurityContextHolder에 저장됩니다. 

자세한 내용은 [[spring-security|Spring Security]]를 참고

> [!QUESTION]- 인증 객체를 ThreadLocal에 저장하는 이유
> Spring MVC에서는 일반적으로 하나의 요청을 하나의 스레드가 처리합니다. 따라서 Spring Security는 `SecurityContext`를 `ThreadLocal`에 저장하여 같은 요청 흐름 어디서든 현재 사용자의 인증 정보에 접근할 수 있도록 하고, 동시에 스레드별로 인증 정보를 격리합니다. 또한 WAS의 스레드는 재사용되므로 요청 처리가 끝난 뒤에는 반드시 `SecurityContext`를 제거해야 합니다. 다만 비동기 처리나 새로운 스레드를 생성하면 `ThreadLocal` 값이 자동으로 전달되지 않기 때문에 별도의 전파 전략이 필요합니다.

> [!QUESTION]- `AuthenticationManager`와 `AuthenticationProvider`의 역할은 무엇인가요?
> `AuthenticationManager`는 인증 요청을 받는 진입점이며, 기본 구현인 `ProviderManager`가 등록된 `AuthenticationProvider` 중 전달받은 인증 토큰을 처리할 수 있는 구현체를 찾습니다. 선택된 Provider가 사용자 조회와 자격 증명 검증을 수행하고, 성공하면 인증된 `Authentication`을 반환합니다.

> [!QUESTION]- 세션 방식과 JWT 방식에서 `SecurityContext`는 어떻게 유지되나요?
> 세션 방식은 인증 성공 후 `SecurityContext`를 HTTP 세션에 저장하고 다음 요청에서 다시 불러올 수 있습니다. 무상태 JWT 방식은 세션에 인증 정보를 저장하지 않고, 일반적으로 매 요청마다 필터가 토큰을 검증하여 `Authentication`을 생성하고 현재 요청의 `SecurityContext`에 설정합니다.
