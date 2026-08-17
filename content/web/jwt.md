---
title: JWT
---
# JWT (JSON Web Toke)

> **JWT는 온라인 네트워크에서 정보를 안전하게 통신할 때 사용하는 인터넷 표준 토큰**

JWT는 웹 표준으로, JSON 객체를 사용하여 두 개체 간에 정보를 안전하게 전송하는 가볍고 자가수용적인 방식이다. 이 토큰은 모든 필수 정보를 자체적으로 담고 있어 서버에서 **데이터베이스 조회 없이** 토큰만으로 사용자 인증 및 권한 확인이 가능하다. 또한 **무상태 구조**로 서버 측 세션의 저장 및 동기화 부담을 줄이고, [[http-header|HTTP 헤더]]나 [[URL]] 파라미터로 손쉽게 전달되어 분산 환경에서 확장과 전달이 용이하다는 점으로 인해 JWT는 현대 웹/마이크로서비스 환경의 핵심 인증 방식으로 자리 잡았다.

## 구성 요소

JWT는 Base64Url로 인코딩 된 세 부분이 마침표(`.`)로 구분되어 결합된 형태로 구성된다.  

### 헤더

일반적으로 헤더는 토큰의 유형과 서명 알고리즘을 명시

### 페이로드

JSON 형식으로 표현된 사용자의 정보나 클레임이 키-값으로 포함된 부분이다.
아래는 RFC 7519에 정의된 키이며 이 외에도 새로운 클레임을 자유롭게 추가 가능하다.  

- `iss`: issuer
- `exp`: expiration time
- `sub`: subject
- `aud`: audience

### 서명

헤더와 페이로드를 결합한 후 지정된 알고리즘과 비밀 키 또는 공개 키로 서명한 값이다.  
해당 서명은 JWT의 무결성을 보장한다.  

## 한계점

- 토큰을 강제 만료 불가, 즉 공격자가 토큰 탈취시 대응 방법 부재
	- 이에 대한 방안으로 [[access-token-and-refresh-token|Refresh Token]]을 발급
- 정보를 많이 담을수록 토큰이 길어지므로 네트워크 대역폭 낭비 가능성이 존재

## Spring에서

```kotlin
implementation("io.jsonwebtoken:jjwt-api:0.12.7")
runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.7")  
runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.7")
```

```java
public String createJwtToken(Member member) {  
    Clock clock = Clock.systemUTC();  
    Instant now = clock.instant();  
  
    return Jwts.builder()  
            .issuer("유어진")  
            .subject(String.valueOf(member.getId()))  
            .claim("role", member.getMemberRole().name())  
            .claim("loginId", member.getLoginId())  
            .issuedAt(Date.from(now))  
            .expiration(Date.from(now.plusSeconds(3600)))  
            .compact();  
}
```


## 출처 및 참고자료

https://asec.ahnlab.com/ko/91594/  
https://docs.tosspayments.com/resources/glossary/jwt  