---
date: 2026-10-29
tags:
  - Network
aliases:
  - 웹소켓
---
웹소켓은 단일 [[TCP]] 연결로 전이중 통신 채널을 제공하는 실시간 통신 [[protocol|프로토콜]]이다.  

- 연결지향
- 한번 연결 맺은 뒤 유지
- 양방향 통신

> [!INFO] Polling과 비교
> 클라이언트가 n초 간격으로 서버에게 요청을 보내는 방식인 Polling으로도 충분히 양방향 통신이 가능하다.  
> 그러나 HTTP는 헤더가 무거운 단발성 통신이기에 요청을 지속적으로 보낸다면 서버의 부담이 증가한다.  
> Long Polling이라는 비교적 서버의 부담을 줄인 방식도 있지만 결국 데이터가 빈번하게 바뀐다면 소용 없다.  
> 이러한 점들을 고려하여 양방향 통신에 최적화된 WebSocket을 사용한다.  

## 동작 방식

![[IMG-20261030222152360.png|468]]

### WebSocket Handshake

HTTP 업그레이드 헤더를 사용하여 HTTP 프로토콜에서 WebSocket 프로토콜로 변경된다.  
요청 본문에는 아래와 같이 Upgrade: websocket을 담아서 보내야 한다.

```http
GET /chat HTTP/1.1 
Host: server.example.com 
Upgrade: websocket 
Connection: Upgrade 
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw== 
Sec-WebSocket-Protocol: chat, superchat 
Sec-WebSocket-Version: 13 
Origin: <http://example.com>
```

응답에는 Status Code 101로 Switching Protocols를 담아서 보낸다.

```http
TTP/1.1 101 
Switching Protocols Upgrade: websocket 
Connection: Upgrade 
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk= 
Sec-WebSocket-Protocol: chat
```

### 왜 독립적인 프로토콜로 관리하지 않는건가?

기존 웹 인프라를 그대로 통과하고 재사용하기 위해 연결할때만 HTTP를 잠시 사용하고 이후에는 WebSocket 프로토콜로 전환하는 구조를 택했다. HTTP Request를 그대로 사용하기 때문에 기존의 80, 443 포트로 접속을 하므로 추가 방화벽을 열지 않고도 양방향 통신이 가능하고, HTTP 규격인 [[CORS]] 적용이나 인증 등 과정을 기존과 동일하게 가져갈 수 있는 것이 장점이다.   

만약 아래와 같이 별도의 프로토콜로 관리한다면 다음과 같은 문제점이 발생한다.  

```
ws://example.com:12345
```

- 회사/학교 방화벽이 해당 포트를 막을 수 있음
- Proxy가 알 수 없는 프로토콜을 차단할 수 있음
- Load Balancer가 별도 프로토콜을 지원해야 함
- 웹 서버와 별도의 네트워크 설정 필요
- 브라우저의 기존 HTTP 보안 모델을 재활용하기 어려움 (Cookie, Origin, TLS…)

## 단점

- WebSocket 연결이 끊어졌을 때의 처리를 직접 구현해야 한다.
- 브라우저 별로 지원하는 웹소켓 버전이 다르며, 모든 브라우저가 WebSocket을 지원하지는 않는다.
- 서버는 수많은 커넥션을 유지해야 하므로 자원을 많이 사용할 수 있다.
    - 실시간으로 많은 데이터가 오가지 않는다면 필요 시 연결을 하는 게 비용적으로 이득


## 출처 및 참고자료

```cardlink
url: https://ko.wikipedia.org/wiki/%EC%9B%B9%EC%86%8C%EC%BC%93
title: "웹소켓 - 위키백과, 우리 모두의 백과사전"
host: ko.wikipedia.org
favicon: https://ko.wikipedia.org/static/favicon/wikipedia.ico
image: https://upload.wikimedia.org/wikipedia/commons/1/10/Websocket_connection.png?utm_source=ko.wikipedia.org&utm_campaign=index&utm_content=thumbnail_unscaled
```

```cardlink
url: https://jaehoney.tistory.com/362#google_vignette
title: "웹소켓(WebSocket) 개념 이해하기!"
description: "WebSocket(WebSocket)은 클라이언트와 서버를 연결하고 실시간으로 통신이 가능하도록 하는 통신 프로토콜이다. WebSocket은 TCP 접속에 전이중(duplex) 통신 채널을 제공한다. 쉽게 말해, Socket Connection을 유지한 채로 실시간 양방향 통신이 가능하다. 아래 서비스에서 대표적으로 웹소켓을 많이 사용한다. SNS 실시간 채팅 화상 회의 실시간 협업 툴 온라인 게임 증권, 거래소 예시를 보면 동시간 접속자 수가 많으며, 실시간 데이터가 아주 많이 오간다는 것을 알 수 있다. vs HTTP 먼저 일반적으로 사용하는 HTTP 프로토콜과의 차이를 알아보자. 1. State HTTP는 단방향 통신이다. 클라이언트가 서버로 요청을 보내면 응답을 받는 구조로 동작하며, 어떠한 상태.."
host: jaehoney.tistory.com
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FnjBcN%2Fbtso0t4Mgix%2FAAAAAAAAAAAAAAAAAAAAANuzZb16A0bk3FAWUuU--1JbjubiOWpSh5mAszFYqWcC%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DycnL8zhIEjAKgQRAdvl4jOGOn4A%253D
```


```cardlink
url: https://www.youtube.com/watch?v=19TrHkprQ7U&t
title: "[10분 테코톡] 니야의 웹소켓 끊김 대응 전략"
description: "🙋‍♀️ 우아한테크코스의 크루들이 진행하는 10분 테크토크입니다. 🙋‍♂️'10분 테코톡'이란 우아한테크코스 과정을 진행하며 크루(수강생)들이 동료들과 학습한 내용을 공유하고 이야기하는 시간입니다. 서로가 성장하기 위해 지식을 나누고 대화하며 생각해보는 시간으로 자기 주도적인 ..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/5b8fd169/img/favicon_32x32.png
image: https://i.ytimg.com/vi/19TrHkprQ7U/maxresdefault.jpg
```

