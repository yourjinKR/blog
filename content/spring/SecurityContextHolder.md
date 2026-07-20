---
title: SecurityContextHolder
aliases:
  - SecurityContextHolder
  - 시큐리티 컨텍스트 홀더
tags:
  - Spring-Security
---
# SecurityContextHolder

[[#SecurityContext]] 객체를 저장하고 감싸고 있는 wrapper 클래스이다.    
실질적인 인증 정보는 [[#Authentication]]이 갖고 있다.  

![[Pasted image 20260714200016.png]]  
https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html

![[Pasted image 20260715005752.png|425]]

## SecurityContext

[[#Authentication]] 객체가 저장되는 보관소로 필요 시 언제든지 Authentication 객체를 꺼내어 쓸 수 있도록 제공되는 클래스

사용자당 `SecurityContext`가 생성되며 객체들은 하나의 `SecurityContextHolder`에서 관리

```java
public interface SecurityContext extends Serializable {
	@Nullable Authentication getAuthentication();
	void setAuthentication(@Nullable Authentication authentication);
}
```

### 생명주기

사용자의 요청이 서버로 들어오면 생성되고, 처리가 끝난 후 응답되는 순간에 초기화 된다.

## Authentication

사용자 정보를 저장하는 객체이다.  

1. `principal`: 사용자 아이디 혹은 User객체를 저장 
2. `credentials`: 증명 (사용자 비밀번호, 토큰)
3. `authorities`: 인증된 사용자의 권한 목록 
4. `details`: 인증 부가 정보 
5. `authenticated`: 인증 여부(Bool)

![[Pasted image 20260715014557.png|400]]

내부 메서드가 전부 `static`으로 선언되어 아래와 같이 가져와 사용할 수 있다.  

```java
Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();  
Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();  
Object credentials = SecurityContextHolder.getContext().getAuthentication().getCredentials();
```

### 전략 패턴 사용

`SecurityContextHolder`의 내부 코드를 살펴보면 인증 객체를 직접 가져오는 것이 아닌 `strategy` 객체에 책임시키는 구조로 설계된 것을 확인할 수 있다.  

```java
private static SecurityContextHolderStrategy strategy = new ThreadLocalSecurityContextHolderStrategy();
```

![[Pasted image 20260715005913.png|531]]

이는 사용자별로 다른 저장소에 저장해야 하는 구조를 고려한 확장성이다.  
기본적으로 [[ThreadLocal]] 방식을 사용한다.  

![[Pasted image 20260715010434.png]]

`ThreadLocalSecurityContextHolderStrategy`에서 `SecurityContext`를 `ThreadLocal`로 저장되는걸 확인할 수 있다. 

```java
private static final ThreadLocal<Supplier<SecurityContext>> contextHolder = new ThreadLocal<>();
```

## 출처 및 참고자료

https://cafe.naver.com/xxxjjhhh/53  
https://dgjinsu.tistory.com/90