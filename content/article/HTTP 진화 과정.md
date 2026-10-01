---
date: 2026-09-16
tags:
  - Network
  - HTTP
---
# HTTP 1.1

HTTP 1.0의 문제를 해결하기 위해 HTTP 1.0이 나온 직후 HTTP 1.1이 등장했다.  

- cacheability (헤더의 확장)
- OPTIONS 메서드
- Upgrade 헤더
- Range 요청
- Transfer-Encoding 압축
- [[#Persistence connection]]
- [[#Pipelining]]

## Persistence connection

기존의 HTTP는 기본적으로 [[TCP]] 기반 위에서 [[HTTP#비연결성|비연결성]]을 만족하기 위해 매 요청마다 [[TCP 3-Way Handshake|TCP 연결]]을 맺고 끊기 때문에 많은 오버헤드가 발생했다.  

이를 해결하기 위해 **하나의 TCP 연결로 지속적으로 요청-응답을 주고받을 수 있는 구조**를 만들었다.  
이러한 방식은 [[HTTP Keep-Alive|Persistence connection]]이라는 이름으로 불렸고 HTTP 헤더에 Keep-alive라는 헤더가 추가됐다.  
그리고 해당 방식은 HTTP 1.1부터 Persistence connection은 기본동작이 되었다.  

아래와 같이 `time-out`가 `max`를 설정하여 언제까지 연결할지 제어할 수 있다.  

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

## Pipelining

또한 네트워크 비용을 줄이기 위해 [[HTTP Pipelining|Pipelining]]을 스펙에 추가했다.  

![[HTTP Pipelining#^intro]]

![[IMG-20260916232341434.png]]

여러 개의 요청을 한꺼번에 보내서 응답을 받음으로서 대기시간은 조금 줄일 수 있었다.  
그러나 해당 방식은 서버의 요청이 들어온 순서대로 처리 후 응답을 반환해야 한다는 문제가 있었다.  

> 만약 순서 상관 없이 서버가 응답값을 전달할 경우에 클라이언트는 각 응답들이 어떤 요청에 대한 응답인지 모른다.  

# HTTP 2.0



# HTTP 3.0

HTTP/3는 기존 HTTP의 의미와 동작을 유지하면서 전송 프로토콜로 [[TCP]] 대신 UDP 기반의 [[QUIC]]을 사용한다.

## HTTP/2와 HTTP/3 비교

| 구분               | HTTP/2                | HTTP/3               |
| ---------------- | --------------------- | -------------------- |
| 전송 프로토콜          | TCP                   | QUIC                 |
| 기반               | TCP                   | UDP                  |
| Multiplexing     | 지원                    | 지원                   |
| Stream 관리        | HTTP/2 + TCP          | QUIC                 |
| TCP HOL Blocking | 발생 가능                 | 발생하지 않음              |
| 암호화              | TCP 위에서 TLS 사용        | QUIC에 TLS 1.3 통합     |
| 신규 연결            | TCP + TLS Handshake   | QUIC + TLS Handshake |
| 패킷 손실 영향         | 여러 Stream에 영향을 줄 수 있음 | 해당 Stream 위주로 영향     |

# 출처 및 참고자료


