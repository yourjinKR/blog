---
title: ExceptionTranslationFilter
tags:
  - Spring-Security
---
# ExceptionTranslationFilter

- `DefaultSecurityFilterChain`에 기본적으로 등록되는 필터
- 필터 이후에 발생하는 인증, 인가 예외를 핸들링하기 위해 사용  

```
HTTP 요청
    ↓
인증 필터
    ↓
AuthorizationFilter / Method Security
    ↓
AuthenticationException 또는 AccessDeniedException
    ↓
ExceptionTranslationFilter
    ├─ 인증이 필요함
    │      → AuthenticationEntryPoint
    │      → 일반적인 REST 응답: 401 Unauthorized
    │
    └─ 인증은 되었지만 권한이 부족함
           → AccessDeniedHandler
           → 일반적인 응답: 403 Forbidden
```

내부적으로 `AuthenticationException`와 `AccessDeniedException`에 대한 예외처리를 수행

![[Pasted image 20260716194808.png]]

- `AuthenticationException`이 발생하면 `AuthenticationEntryPoint`를 호출한다.
- `AccessDeniedException`이 발생했더라도 사용자가 익명 사용자라면 `AuthenticationEntryPoint`를 호출한다.
- 사용자가 인증된 상태라면 `AccessDeniedHandler`를 호출한다.


> [!CAUTION]
>  `ExceptionTranslationFilter` 필터 이전에 발생하는 예외의 경우 처리하지 못한다. 예외 처리는 호출한 필터가 진행할 수 있다.
>  
>  예를 들어 `UsernamePasswordAuthenticationFilter`는 `ExceptionTranslationFilter` 보다 앞에 존재하기 때문에 `ExceptionTranslationFilter`에서 처리할 수 없다.

%%  %%
## AuthenticationEntryPoint

인증이 필요한 클라이언트에게 **인증을 시작하도록 요구하는 컴포넌트**

- 인증처리
- 핵심 메서드: `commence()`

구현체는 다음과 같음

![[Pasted image 20260716200708.png]]

## AccessDeniedHandler

사용자가 인증되었지만 요청한 **리소스에 접근할 권한이 없는 경우를 처리**

- 인가처리
- 핵심 메서드: `handle()`
- 기본 구현체는 `AccessDeniedHandlerImpl`를 사용

## 커스텀

```java
return http.exceptionHandling(exceptionHandling -> exceptionHandling  
		.authenticationEntryPoint(customAuthenticationEntryPoint)  
		.accessDeniedHandler(customAccessDeniedHandler))
```

위와 같이 Spring Security의 인증·인가 과정에서 발생한 예외를 HTTP 응답으로 변환하는 방법을 커스텀할 수 있다.  

![[Pasted image 20260716193630.png]]

- [ ] 내부적으로 `ExceptionHandlingConfigurer`가 `ExceptionTranslationFilter`를 Security Filter Chain에 추가하고, 설정된 `AuthenticationEntryPoint`와 `AccessDeniedHandler`를 해당 필터에 연결한다.

## 출처 및 참고자료

https://www.youtube.com/watch?v=SpHoeh4DsPA&list=PLJkjrxxiBSFCFM0pjDwm6F98veieD0MER&index=23  