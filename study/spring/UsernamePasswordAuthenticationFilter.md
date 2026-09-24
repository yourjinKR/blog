---
tags:
  - Spring-Security
---
# UsernamePasswordAuthenticationFilter

DefaultSecurityFilterChain에 기본적으로 등록되는 form 기반 인증 필터

- `DefaultSecurityFilterChain`에 기본적으로 처리되는 필터
- 커스텀 SecurityFilterChain을 생성하면 자동 등록이 안되기에 아래와 같이 필터 등록 필요

```java
http.formLogin(Customizer.withDefaults());
```

## 내부 로직

- `doFilter()` 메서드는 `AbstractAuthenticationProcessingFilter` 추상 클래스에서 구현되어 있다.
	- `doFilter()`의 내부 로직은 다음과 같다
		- 사용자에게 데이터를 받아 인증 → 인증 결과 → 성공/실패 핸들
	- 사용자가 보낸 데이터 방식이 다르다고 해서 위 과정이 변하지는 않음
	- 그렇기에 추상 클래스에서 구현

![[Pasted image 20260719035617.png|430]]

- 해당 필터를 커스텀시에는 인증을 진행하는 `attemptAuthentication()` 메서드를 구현
- 이런식으로 추상 클래스를 구현한 필터들은 아래와 같다.

![[Pasted image 20260719040012.png]]

## 비활성화

```java
http.formLogin(AbstractHttpConfigurer::disable)
```

비활성화 했다면 `Authentication` 객체를 [[SecurityContextHolder|시큐리티 컨텍스트 홀더]]에 추가하는 로직을 별도로 구현해야 한다.  

## 출처 및 참고자료

https://cafe.naver.com/xxxjjhhh/63