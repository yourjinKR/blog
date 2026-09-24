---
title: 쿠키는 서버만 만들 수 있다
---
## 쿠키는 서버에서만 생성 가능하다?

많은 사이트에서 쿠키는 서버가 생성한다고 설명한다.   

![[Pasted image 20260710153551.png]]  
https://www.cloudflare.com/ko-kr/learning/privacy/what-are-cookies/  

![[Pasted image 20260710153607.png]]
https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/Cookies

하지만 기술적으로는 Javascipt에서도 쿠키를 생성할 수 있다. 정확히 말하자면 Javascript 코드로 쿠키 저장소에 값을 등록하고 실질적인 저장과 전송 동작은 브라우저가 담당한다.

```javascript
document.cookie = "theme=dark; Path=/";
```

그렇다면 왜 여러 글들에서는 이와 같이 표현하는걸까?

### HTTP 쿠키의 원래 사용 흐름이 서버 중심이기 때문

쿠키는 상태가 없는 HTTP에서 서버가 클라이언트를 식별하거나 상태를 유지하기 위해 주로 사용한다. 따라서 세션 쿠키 같은 핵심 쿠키는 서버가 생성한 값을 브라우저에 전달한다.  

### 로그인용 쿠키는 보통 서버에서만 안전하게 만든다

인증 쿠키에는 일반적으로 `HttpOnly` 속성을 사용하여 서버가 `Set-Cookie` 방식으로만 쿠키를 설정할 수 있게끔 자바스크립트를 통한 접근을 제어한다.  

## 결론

1. 클라이언트에서도 쿠키는 만들 수 있다.
2. 쿠키의 본래 목적은 클라이언트에서 보내주는 응답간 상태를 서버가 알기 위해서이다.