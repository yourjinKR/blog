---
title: HTTP Header
aliases:
  - HTTP Header
  - HTTP 헤더
---
# HTTP Header

- HTTP 전송에 필요한 모든 부가정보를 저장
- 표준헤더가 굉장히 많으니 참고
- 필요시 임의의 헤더 또한 추가 가능

## Representation Header (표현 헤더)

- `Content-Type`: 표현 데이터의 데이터 형식 (`text/html`, `application/json`)
- `Content-Encoding`: 표현 데이터의 압축 방식 (`gzip`, `deflate`, `identity`)
- `Content-Language`: 표현 데이터의 자연 언어 (`ko` `en` `en-US`)
- `Content-Location`: 표현 데이터의 길이
	- 바이트 단위이며 Transfer-Encoding 사용시 `Content-Length`를 사용하지 않는다

### Representation

표현은 특정 리소스의 다양한 형태입니다. 예를 들어, 동일한 데이터가 XML 또는 JSON과 같은 특정 미디어 타입으로 형식화되거나, 작성된 언어 또는 지리적 지역으로 지역화되거나, 전송을 위해 압축되거나 인코딩될 수 있습니다. 기본 리소스는 각 경우에 동일하지만, 표현은 다릅니다.

https://developer.mozilla.org/ko/docs/Glossary/Representation_header

## 전송 방식

- 단순 전송: `Content-Length`
- 압축 전송: `Content-Encoding`
- 분할 전송: `Transfer-Encoding`
- 범위전송: `Content-Range`

## 일반 정보

- `form`: 유저 에이전트의 이메일 정보
- `referer`: 현재 요청된 페이지의 이전 웹 페이지 주소
- `user-agent`: 클라이언트의 애플리케이션 정보 (웹 브라우저 정보)
- `server`: 요청을 처리하는 ORIGIN 서버의 소프트웨어 정보
- `date`: 메세지가 발생한 날짜와 시간

## 특별 정보

### Host

- 요청에서 사용하며 필수 정보
- 하나의 서버가 여러 도메인을 처리할 때
- **하나의 IP 주소에 여러 도메인이 적용**되어 있을 때 

### Location

- 201 Created의 Location: 요청에 의해 생성된 리소스 URI
- 3XX Redirection의 Location: 요청을 자동으로 리다이렉션하기 위한 대상 리소스를 표현

### Retry-After

유저 에이전트가 다음 요청을 하기까지 기다려야 하는 시간

## 인증 헤더

### Authorization

클라이언트 인증 정보를 서버에 전달

### WWW-Authenticate

리소스 접근시 필요한 인증 방법 정의

## 출처 및 참고자료

https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/Content_negotiation  