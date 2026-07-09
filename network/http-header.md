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

## 표현 헤더s

표현은 특정 리소스의 다양한 형태입니다.  
예를 들어, 동일한 데이터가 XML 또는 JSON과 같은 특정 미디어 타입으로 형식화되거나,  
작성된 언어 또는 지리적 지역으로 지역화되거나, 전송을 위해 압축되거나 인코딩될 수 있습니다. 기본 리소스는 각 경우에 동일하지만, 표현은 다릅니다.

- `Content-Type`: 표현 데이터의 데이터 형식 (`text/html`, `application/json`)
- `Content-Encoding`: 표현 데이터의 압축 방식 (`gzip`, `deflate`, `identity`)
- `Content-Language`: 표현 데이터의 자연 언어 (`ko` `en` `en-US`)
- `Content-Location`: 표현 데이터의 길이
	- 바이트 단위이며 Transfer-Encoding 사용시 Content-Length를 사용하지 않는다

## 출처 및 참고자료

https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/Content_negotiation  