---
title: HTTP Keep-Alive
aliases:
  - HTTP keep-alive
  - HTTP persistent connection
  - HTTP connection reuse
---
# HTTP 지속적 연결 상태

하나의 [[TCP]] 연결을 사용하여 복수의 [[HTTP]] 요청/응답을 주고받는다는 개념으로, 매 요청/응답 쌍마다 새로운 요청을 여는 것과는 반대되는 개념

![[Pasted image 20260710011510.png]]  
저자: helix84 - own work, based on [1], 퍼블릭 도메인, https://commons.wikimedia.org/w/index.php?curid=1328207

## 사용 방법

`Keep-Alive`를 헤더에 추가

```http
HTTP/1.1 200 OK
Connection: Keep-Alive
Content-Encoding: gzip
Content-Type: text/html; charset=utf-8
Date: Thu, 11 Aug 2016 15:23:13 GMT
Keep-Alive: timeout=5, max=1000
Last-Modified: Mon, 25 Jul 2016 04:32:39 GMT
Server: Apache

(body)
```


> [!INFO]
> HTTP 1.1 부터 기본적으로 활성화, 수동으로 비활성화하려면 `Connection: close`를 명시

## 출처 및 참고자료

https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Headers/Keep-Alive
https://bin-repository.tistory.com/185  