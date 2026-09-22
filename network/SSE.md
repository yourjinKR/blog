---
tags:
  - Network
  - SSE
aliases:
  - Server Sent Event
---
Server-Sent Events는 서버가 클라이언트로 **단방향 실시간** 데이터를 전송하는 프로토콜이다.

![[IMG-20260921172243023.png|405]]

주요 특징으로는 다음과 같다.  

1. 단방향 통신 (서버 → 클라이언트)
2. [[HTTP]] 프로토콜을 기반으로 동작
3. `Content-Type` 헤더에 `text/event-stream`을 사용
4. 연결이 끊어지면 브라우저가 자동으로 재연결 시도
5. WebSocket처럼 핸드 셰이크 과정이 없으며, HTTP를 기반으로 동작하므로 상대적으로 구현이 간단하다.  
6. 클라이언트와 서버 간 하나의 HTTP 연결을 통해 여러 이벤트를 스트리밍한다.  

## 언제 사용할까?

알람 기능과 같이 서버가 클라이언트로부터 명시적인 요청 없이도 실시간으로 데이터를 전달하고자 할 때 주로 사용한다.  


![[실시간 통신 방식 비교#간단 비교]]


## 동작 방식

1. 클라이언트가 서버의 SSE 엔드포인트로 **HTTP 요청을 보내 연결을 생성**합니다.
2. 서버는 일반 HTTP 응답처럼 바로 연결을 종료하지 않고, `text/event-stream` 형식으로 **응답 스트림을 계속 열어둡니다.**
3. 이 상태에서는 클라이언트와 서버 사이의 **TCP 연결도 유지**됩니다.
4. 서버에서 전달할 이벤트가 발생하면, 열려 있는 연결을 통해 **서버 → 클라이언트 방향으로 데이터를 전송**합니다.
5. 클라이언트는 이벤트를 수신하면 해당 데이터를 처리하고, 이후에도 연결을 유지하면서 다음 이벤트를 기다립니다.
6. 일정 시간 동안 이벤트가 없으면 프록시나 네트워크 장비가 연결을 끊을 수 있으므로, 서버는 주기적으로 **Heartbeat 이벤트**를 보내 연결이 살아 있음을 확인할 수 있습니다.
7. 클라이언트가 페이지를 닫거나 네트워크가 끊기면 연결도 종료되며, 서버는 해당 SSE 연결에 사용하던 **리소스를 정리**합니다.
8. 연결이 끊어진 경우 클라이언트는 필요에 따라 **재연결**하고, 이후 다시 서버의 이벤트를 받을 수 있습니다.

### HTTP 요청으로 연결 시작

SSE는 별도의 프로토콜로 연결을 생성하는 것이 아니라 **HTTP를 이용하여 연결을 시작**한다.  
클라이언트가 SSE 엔드포인트로 HTTP 요청을 보내면 서버는 일반적인 HTTP 요청처럼 응답을 반환한다.  
다만 일반 HTTP 응답과 달리 응답을 모두 전송한 뒤 연결을 종료하지 않는다.

### 서버가 `text/event-stream` 응답을 반환

서버는 SSE 연결임을 나타내기 위해 응답의 `Content-Type`을 다음과 같이 설정한다.  

```http
HTTP/1.1 200
Content-Type: text/event-stream
Transfer-Encoding: chunked
Connection: keep-alive
```

SSE에서는 서버가 응답을 완료하지 않고 응답 스트림을 계속 열어둔다.
SSE 연결이 만들어진 이후 서버에서 클라이언트에게 전달할 이벤트가 발생하면 새로운 HTTP 요청을 생성하지 않는다.  

### SSE 이벤트는 정해진 텍스트 형식을 사용

기본적으로 텍스트 기반 프로토콜이기에 JSON을 전달하려면 JSON 문자열을 통째로 `data` 담아 전송한다.  

```
id: 123
event: notification
data: {"message":"hello"}
retry: 3000
```

- `data`: 실제 전달할 데이터
- `event`: 이벤트 종류
- `id`: 이벤트 식별자
- `retry`: 재연결 시도 간격

이벤트 종료시에는 빈 줄을 기준으로 종료된다.  

```
event: notification 
data: hello

```

### 연결 유지 동안 하위 네트워크의 상태

SSE는 HTTP 위에서 동작하고 [[HTTP]]는 다시 [[TCP]]와 같은 전송 계층 위에서 동작한다.  
그렇기에 일반적으로 SSE 연결이 유지되는 동안 TCP 연결 역시 유지된다.  

HTTP/2에서는 하나의 TCP 연결 안에서 여러 HTTP Stream을 [[Multiplexing]]할 수 있기 때문에 SSE는 그중 하나의 HTTP Stream을 통해 동작할 수 있다.  

### 하트비트를 통해 유휴 연결이 종료되는 것을 방지

장시간 SSE에서 이벤트가 발생하지 않았을 때 서버와 클라이언트 사이에 존재하는 프록시, 로드밸런서 또는 네트워크 장비가 일정 시간 동안 데이터 전송이 없는 연결을 유휴 연결로 판단하여 종료할 수 있다.  

이를 방지하고자 단순히 연결 유지를 위해 의미 없는 이벤트를 서버가 주기적으로 보내주며 이를 **하트비트**라고 부른다.  
SSE에서는 `:`로 시작하는 줄이 comment로 처리되므로 다음과 같은 형태로 주로 사용한다.  

```
: heartbeat
```

## 출처 및 참고자료

```cardlink
url: https://api7.ai/ko/blog/what-is-sse
title: "SSE(Server-Sent Events) 이해와 그 장점 - API7.ai"
description: "Server-Sent Events(SSE)의 실시간 데이터 업데이트 기능과 네트워크 부하 감소, 자동 재연결과 같은 이점을 알아보세요."
host: api7.ai
image: https://static.api7.ai/uploads/2024/01/30/sskEdu4w_SSE-cover.png?imageMogr2/format/webp
```

```cardlink
url: https://techblog.woowahan.com/23199/
title: "Server-Sent Events로 실시간 알림 전달하기 | 우아한형제들 기술블로그"
description: "들어가며 식당에 있다 보면 “배달의민족 주문~!” 알림을 한 번쯤 들어보셨을 거예요. 이 알림은 주문이 들어올 때 사장님이 빠르게 확인하고 처리할 수 있도록 도와주는 주문 접수 프로그램에서 발생합니다. 이 프로그램을 만드는 팀이 바로 주문접수채널팀으로, Windows·macOS PC, 모바일 앱(Android, iOS), Android POS 등 다양한 환경에서 사용할 수 있도록 개발하고 있습니다. 그동안 알림 시스템은 큰 문제 없이 잘"
host: techblog.woowahan.com
favicon: https://techblog.woowahan.com/wp-content/uploads/2020/08/favicon.ico
image: https://techblog.woowahan.com/wp-content/uploads/2025/07/우아한테크-기술블로그-배너.png
```
