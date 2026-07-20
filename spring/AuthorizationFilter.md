---
title: AuthorizationFilter
tags:
  - Spring-Security
---
# AuthorizationFilter 

URL에 대한 접근을 제한하는 권한 필터

이 필터는 `DefaultSecurityFilterChain`에 기본적으로 등록되는 필터로 마지막에 위치한다.

## 커스텀

커스텀 `SecurityFilterChain`에도 기본적으로 등록되며 인가를 설정하는 방법은 아래와 같다.

```java
http
        .authorizeHttpRequests((auth) -> auth
                .requestMatchers("/").permitAll()
                .anyRequest().permitAll());
```

## 출처 및 참고자료

https://docs.spring.io/spring-security/reference/api/java/org/springframework/security/web/access/intercept/AuthorizationFilter.html  
https://www.youtube.com/watch?v=U4DyQF_eQVE&list=PLJkjrxxiBSFCFM0pjDwm6F98veieD0MER&index=25  