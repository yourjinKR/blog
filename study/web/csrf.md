---
title: CSRF
---
# CSRF (Cross-Site Request Forgery)

인증된 사용자의 권한을 도용해 사용자의 의지와 무관하게 악의적인 요청을 서버로 보내게 만드는 웹 보안 취약점이다.  

## 사례

### GET 요청 URI에 행위가 나타나는 경우

아래와 같은 URI에 특정 게시물을 삭제하는 GET 메서드가 있다고 가정한다.  

```
https://www.matchuri.com/group/delete/1
```

일반적으로 1번 그룹에 대한 삭제 권한이 없다면 삭제 처리가 되지 않는다.  
그러나 삭제 권한을 가진 유저에게 해당 URI를 보낼 경우에는 유저가 해당 URI에 연결하는 순간 컨텐츠가 삭제될 것이다.  

### Form 요청 hidden

그렇다면 POST Form 태그 기반은 절대적으로 안전할까?  

- 파라미터를 hidden type으로 보이지 않는 Form 태그를 생성
- 해당 Form을 권한이 있는 유저에게 전송

여전히 CSRF로부터 안전하지 않다.  

## 해결 방법

### CSRF 토큰 발급

서버는 로그인한 유저에게 고유의 난수 CSRF 토큰을 발급합니다. 이후 서비스 개발자들이 만든 Form 태그는 해당 CSRF 토큰을 hidden 파라미터로 담도록 설계합니다.

해커가 만든 Form 태그는 CSRF 토큰을 담지 못하기 때문에 Form 요청시 인가가 거부됩니다.

### SameSite 쿠키 속성

쿠키에 `SameSite=Lax` 또는 `SameSite=Strict` 옵션을 주어 다른 사이트에서 온 요청에는 쿠키가 자동으로 전송되지 않도록 제한한다.  

> 기본값은 `Lax`이다.

### Referer 및 Origin 헤더 검증

서버 요청 헤더의 `Referer`나 `Origin` 값을 확인해 허용된 도메인에서 온 요청인지 검사

## 출처 및 참고자료

https://www.youtube.com/watch?v=8H9J8lSPKuw  
https://www.codeit.kr/tutorials/94/%EC%BF%A0%ED%82%A4%EC%9D%98%20SameSite%20%EC%98%B5%EC%85%98%EC%9D%B4%EB%9E%80%3F



