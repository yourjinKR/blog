---
title: Spring Security
aliases:
  - Spring Security
  - 스프링 시큐리티
tags:
  - Spring-Security
---

# 동작 방식

- WAS의 필터에 하나의 필터를 만들어서 넣고 해당 필터에서 요청을 가로챔
- 해당 요청은 스프링 컨테이너 내부에 구현되어 있는 스프링 시큐리티 감시 로직을 거침
- 시큐리티 로직을 마친 후 다시 WAS의 다음 필터로 복귀

- 스프링 시큐리티 로직은 여러개의 필터들이 나열된 필터 체인 형태로 구성
		- 필터 체인은 여러개가 될 수 있음


![[spring-security-overview.svg]]

# 전체 구조

https://www.geeksforgeeks.org/springboot/spring-security-architecture/

![[Pasted image 20260719033540.png]]

https://velog.io/@kyungwoon/Spring-Security-%EB%8F%99%EC%9E%91-%EC%9B%90%EB%A6%AC

![[Pasted image 20260719040056.png]]

- `AuthenticationFilter`가 로그인 요청이 들어오면 가로챔
	- 시큐리티의 기본 설정은 `UsernamePasswordAuthenticationFilter`
- 미인증 토큰을 생성한다 (`UsernamePasswordAuthenticationToken`)
- `AuthenticationManager`에게 토큰을 넘겨 인증을 요청한다
	- `ProviderManager`가 기본 구현체
- `ProviderManager`가 적절한 `Providers` 중 적절한 `Provider`를 찾는다
- 선택된 `AuthenticationProvider`가 `UserDetailsService`의 `loadUserByUsername()`을 호출하여 DB 등에서 사용자 정보를 담은 `UserDetails` 객체를 가져온다 (**DB 조회 발생!!**)
- DB에서 가져온 이용자의 정보와 화면에서 입력한 로그인 정보를 비교하게 되고, 일치하면 `Authentication` 참조를 리턴
- 인증이 완료되면 사용자 정보를 가진 `Authentication` 객체를 [[SecurityContextHolder]]에 담는다

# DelegatingFilterProxy

- 스프링 Bean을 찾아 요청을 넘겨주는 [[servlet|서블릿]] 필터
- DelegatingFilterProxy는 요청을 가로채서 FilterChainProxy 빈에 값을 전달
- 이는 spring security의 특별한 기능이 아닌 단순 전달 역할을 수행

`SecurityFilterAutoConfiguration` → `DelegatingFilterProxyRegistrationBean`  

![[Pasted image 20260714144131.png]]

`DelegatingFilterProxyRegistrationBean`  
→ `extends AbstractFilterRegistrationBean<DelegatingFilterProxy>`

![[Pasted image 20260714144209.png]]

# FilterChainProxy

스프링 시큐리티 의존성을 추가하면 `DelegatingFilterProxy`에 의해 호출되는 `SecurityFilterChain`들을 들고 있는 Bean

내부에 `getFilters()` 메서드에 디버깅 해보면 현재 등록된 필터체인을 확인할 수 있다.  

![[Pasted image 20260714152416.png]]

# SecurityFilterChain

스프링 시큐리티 필터들의 묶음으로 실제 시큐리티 로직이 처리되는 부분이다.  `FilterChainProxy`가 `SecurityFilterChain`들을 들고 있다.

## 등록

우선 의존성 추가시 기본적인 `DefaultSecurityFilterChain`이 등록된다.  

커스텀이 필요할 경우에는 `SecurityFilterChain`을 리턴하는 `@Bean` 메서드를 동록한다.  

```java
@Configuration  
@EnableWebSecurity  
@RequiredArgsConstructor  
public class SecurityConfig {  

    @Bean  
	public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) 
		throws Exception {
			return httpSecurity....
	}
```

### 필터체인을 두 개 이상 등록시

메서드명만 변경한다면 여러 필터체인을 등록할 수 있다.

```java
@Bean  
public SecurityFilterChain adminSecurityFilterChain(HttpSecurity http)
	throws Exception { }

@Bean  
public SecurityFilterChain securityFilterChain(HttpSecurity http)
	throws Exception { }
```

`FilterChainProxy`는 N개의 `SecurityFilterChain` 중 하나를 아래와 같은 기준으로 선택

1. 등록 인덱스 순
2. 필터 체인에 대한 `RequestMatcher` 값이 일치하는지 확인

```java
@Bean  
public SecurityFilterChain adminSecurityFilterChain(HttpSecurity http)
	throws Exception { }

@Bean  
public SecurityFilterChain securityFilterChain(HttpSecurity http)
	throws Exception { }
```

`securityMatcher()`로 설정하여 해당 필터체인이 어떤 요청에 대해서 동작을 요구하는지 경로를 지정할 수 있다.  

```java
@Bean   
public SecurityFilterChain adminSecurityFilterChain(HttpSecurity http) throws Exception {  
    http.securityMatcher("/admin/**");
    // 혹은 securityMatchers를 사용
    // http.securityMatchers((auth) -> auth.requestMatchers("/admin/**"))
    return http.build();  
}
```

![[Pasted image 20260714155032.png]]

또한 `@Order`를 사용하면 필터체인의 순서를 명시할 수 있다.  

```java
@Bean  
@Order(1)
public SecurityFilterChain adminSecurityFilterChain(HttpSecurity http)
	throws Exception { }

@Bean  
@Order(2)
public SecurityFilterChain securityFilterChain(HttpSecurity http)
	throws Exception { }
```

### 특정 요청은 필터를 거치지 않게 할 경우

`SecurityFilterChain`을 거치게 된다면 내부적으로 여러 가지 필터를 거치게 됩니다. 이때 서버의 자원을 사용하고 상주 시간이 발생하기 때문에 원하는 값은 필터를 통과하지 못하도록 설정할 수 있다.

보통 정적 자원 (이미지, CSS)의 경우 필터를 통과하지 않도록 아래 구문을 통해 설정할 수 있다.

설정시 하나의 `SecurityFilterChain`이 0 번 인덱스로 설정되며 해당 필터 체인 내부에는 필터가 없는 상태로 생성된다.

```java
@Bean
public WebSecurityCustomizer webSecurityCustomizer() {
    return web -> web.ignoring().requestMatchers("/img/**");
}
```

## 내부 구조

Spring Security에서 기본적으로 설정되는 필터 체인인 `DefaultSecurityFilterChain`에 디버그를 확인해보면 15가지 정도의 필터들이 묶여 있는 것을 확인할 수 있다.  

### DisableEncodeUrlFilter

- `DefaultSecurityFilterChain`에 등록
- URL 파라미터에 세션 id가 인코딩되어 로그로 유출되는 것을 방지
- 커스텀 `SecurityFilterChain`을 생성해도 등록, disable 방식은 아래와 같이 설정

```java
http.sessionManagement((manage) -> manage.disable());
```

### [[WebAsyncManagerIntegrationFilter]]

비동기로 처리되는 작업에 대해 알맞은 시큐리티 컨텍스트(세션)을 적용

### SecurityContextHolderFilter

접근한 유저에 대해 [[SecurityContextHolder|시큐리티 컨텍스트]]를 관리한다.  

### HeaderWriterFilter

보안을 위한 응답 헤더 추가 (X-Frame-Options, X-XSS-Protection and X-Content-Type-Options)

### CorsFilter

CORS 설정 필터

### CsrfFilter

CSRF 방어 필터

### LogoutFilter

로그아웃 요청 처리 시작점 GET : “/logout”

### [[UsernamePasswordAuthenticationFilter]]

username/password 기반 로그인 처리 시작점 POST : “/login”

### DefaultLoginPageGeneratingFilter

기본 로그인 페이지 생성 GET : “/login”

### DefaultLogoutPageGeneratingFilter

기본 로그아웃 페이지 생성 GET : “/logout”

### BasicAuthenticationFilter

http basic 기반 로그인 처리 시작점

### RequestCacheAwareFilter

이전 요청 정보가 존재하면 처리 후 현재 요청 판단

### SecurityContextHolderAwareRequestFilter

ServletRequest에 서블릿 API 보안을 구현

### AnonymousAuthenticationFilter

최초 접속으로 인증 정보가 없고, 인증을 하지 않았을 경우 세션에 익명 사용자 설정

### [[ExceptionTranslationFilter|ExceptionTranslationFilter]]

인증 및 접근 예외에 대한 처리

### [[AuthorizationFilter]]

경로 및 권한별 인가 (구. `FilterSecurityIntercepter`)

## 커스텀 필터 등록

```java
http.addFilterBefore(추가할필터, 기존필터.class);
http.addFilterAt(추가할필터, 기존필터.class);
http.addFilterAfter(추가할필터, 기존필터.class);
```

## 필터 상속과 요청 전파

Spring Security의 필터들은 아래와 같은 상속구조를 가지고 있다.  
[[servlet-filter|서블릿 필터]] 인터페이스와 Spring 기반의 `GenericFilterBean` 추상 클래스가 있다.  

![[fileter-inheritance.excalidraw.svg|200]]

대표적으로 `UsernamePasswordAuthenticationFilter`가 아래와 같이 구성되어 있다.  

![[Pasted image 20260716175156.png|353]]

## GenericFilterBean과 OncePerRequestFilter

모든 시큐리티 필터는 `GenericFilterBean` or `OncePerRequestFilter`를 기반으로 구현  

![[fileter-inheritance-oncefilter.excalidraw.svg|448]]

- `GenericFilterBean`를 상속
	- 내부적으로 동일한 필터를 여러 번 통과하더라도 통과한 수 만큼 내부 로직이 실행
	- 필터 로직 수행 메서드: `doFilter()`
- `OncePerRequestFilter`를 상속
	- 내부적으로 동일한 필터를 여러 번 통과하더라도 첫 한 번만 내부 로직이 실행
	- 필터 로직 수행 메서드: `doFilterInternal()`

> [!CAUTION]
> `OncePerRequestFilter`를 상속한 필터는 forward 상태와 같이 한 요청에 대해 내부적으로 필터가 반복 실행되는 상황에서만 필터가 동작하는 것이다. redirect와 같은 재요청과 같은 경우는 각 2번의 요청이 실행되는 것이기에 필터가 2번 동작한다.  

%%  %%
# 출처 및 참고자료

https://www.youtube.com/playlist?list=PLJkjrxxiBSFCFM0pjDwm6F98veieD0MER