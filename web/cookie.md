---
title: 쿠키
aliases:
  - 쿠키
  - cookie
---
# 쿠키 (Cookie)

쿠키는 서버가 생성하여 웹 브라우저로 전송하는 작은 정보 파일이다.  

- Set-Cookie: 서버에서 클라이언트로 쿠키 전달
- Cookie: 클라이언트가 서버에서 받은 쿠키를 저장하고, [[http|HTTP]] 요청시 서버로 전달

## 쿠키 생성

서버에서 [[http-header|HTTP 헤더]] 내 `Set-Cookie`에 정보를 담아 클라이언트로 전달하면 클라이언트는 쿠키 저장소에 해당 정보를 저장한다.

```http
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: name=yourjin
Set-Cookie: info=handsome
```

 쿠키 저장소에 쿠키가 있다면 클라이언트는 모든 요청에 **쿠키 정보를 자동으로 포함**한다.  

```http
GET /sample_page.html HTTP/1.1
Host: www.matchuri.com
Cookie: name=yourjin; info=handsome
```

> [!INFO]
> 클라이언트에서도 쿠키는 생성이 가능하다.  
> 자세한 내용는 [[client-can-make-cookie|해당 글]]을 참고

%%%%

## 주 사용처

- **세션 관리**: 서버가 저장해야 할 로그인, 장바구니, 게임 스코어 등의 정보 관리
- **개인화**: 사용자 선호, 테마 등의 세팅
- **트래킹**: 사용자 행동을 기록하고 분석하는 용도

> [!CAUTION]
> 클라이언트가 HTTP 요청시 쿠키 정보를 자동으로 전달하기에 쿠키를 생성하는 만큼 추가적인 네트워크 트래픽이 발생한다. 그렇기에 최소한의 정보만 담는 것을 권장하며 사용자의 민감한 정보는 저장하지 않는 것을 강력히 권장한다.   

- 네트워크 트래픽 추가 유발
- 최소한의 정보만 사용
- 서버 전송 없이 웹 브라우저 내부에 데이터를 저장하고 싶다면 LocalStorage, SessionStorage
- 민감한 정보는 절대 저장 X

## 생명주기

- expires: 만료일 설정
- max-age: 초 단위 설정
- 세션 쿠키: 만료날짜 생략시 브라우저 종료시 까지만 유지
- 영속 쿠키: 만료 날짜를 입력하면 해당 날짜까지 유지

## 도메인

- 명시한 문서 기준 도메인에만 동작
- 생략시 현재 문서 기준 도메인에만 적용 (서브도메인 X)

## 경로

- 이 경로를 포함한 하위 경로 페이지에만 접근

```
path=/home
```

## 보안

```http
Set-Cookie: session_id=abc12345; Secure; HttpOnly; SameSite=Strict
```

### Secure

- 원래 쿠키 HTTP, HTTPS를 구분하지 않고 전송
- Secure를 적용하면 HTTPS인 경우에만 전송
### HttpOnly

- [[xxs|XXS]] 공격 방지
- 자바스크립트에서 접근 불가
- HTTP 전송에만 사용

### SameSite

- [[csrf|CSRF]] 공격 방지
- 요청 도메인과 쿠키에 설정된 도메인이 같은 경우만 쿠키 전송

```http
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly
```

## 출처 및 참고자료

https://www.cloudflare.com/ko-kr/learning/privacy/what-are-cookies/  
https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/Cookies  