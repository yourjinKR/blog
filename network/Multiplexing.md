---
tags:
  - Network
  - HTTP
aliases:
  - HTTP Multiplexing
  - 멀티플렉싱
---
[[HTTP 2|HTTP 2.0]]에서 하나의 [[TCP 3-way handshake|TCP 연결]] 안에서 요청마다 별도의 Stream을 만들어 여러 요청/응답을 동시에 처리하는 방식이다.  

- 송신자는 HTTP 메시지를 [[HTTP 2#Frame|Frame]] 단위로 **인터리빙**  
- 수신자는 같은 `Stream Identifier`를 가진 프레임들을 모아, 원래의 HTTP 메시지로 재조립 (Demultiplexing)

> [!INFO] 인터리빙
> 하나의 TCP 연결을 통해 여러 개의 요청과 응답을 작은 프레임(Frame) 단위로 쪼개어 번갈아 주고받는 기술

1. 하나의 TCP 연결을 생성한다.
2. 각 요청마다 서로 다른 Stream을 생성한다.
	- 요청 A → Stream 1
	- 요청 B → Stream 3
	- 요청 C → Stream 5
3. 각 요청과 응답은 `HEADERS`, `DATA` 등의 Frame으로 표현된다.
4. 송신자는 여러 Stream의 Frame을 하나의 TCP 연결 위에서 번갈아 전송한다.
5. 수신자는 Frame의 `Stream Identifier`를 확인하여 각각의 Stream으로 분류한다.
6. 같은 Stream의 Frame들을 처리하여 각각의 HTTP 요청/응답을 완성한다.

## 한계점  

다만, HTTP 계층의 HOL Blocking은 해결했지만, TCP 계층의 HOL Blocking까지 해결한 것은 아니다.  

HTTP/2도 하나의 TCP 연결을 사용하기 때문에 TCP 패킷 하나가 유실되면 해당 패킷이 재전송될 때까지 뒤의 TCP 데이터도 전달되지 않을 수 있습니다.

그래서 HTTP/3는 TCP 대신 QUIC을 사용하여 Stream 간 독립성을 더 강화했다.  

![[IMG-20260916173256724.png]]




## 출처 및 참고자료


```cardlink
url: https://go-gradually.tistory.com/entry/HTTP20-HTTP-%EB%A9%80%ED%8B%B0%ED%94%8C%EB%A0%89%EC%8B%B1-HoL-Blocking-%EA%B7%B8%EB%A6%AC%EA%B3%A0-HTTP30%EC%9D%98-%EB%93%B1%EC%9E%A5-%EB%B0%B0%EA%B2%BD
title: "HTTP/2.0 - HTTP 멀티플렉싱, HoL Blocking, 그리고 HTTP/3.0의 등장 배경"
description: "HTTP/2.0의 등장 배경HTTP/1.1은 그 구현의 단순성과 명료함, 접근성으로 많은 사랑을 받아왔고, 받고 있다.하지만, 하나의 커넥션으로 여러 요청/응답을 처리하기 어렵고, 응답을 받아야만 그 다음 요청을 보낼 수 있는 것은 분명한 아쉬움으로 남아있었다.그리하여, 다양한 곳에서 속도를 개선하기 위한 다양한 방법의 연구가 진행되었다.최종적으로, 구글의 \"SPDY\" 가 HTTP/2.0의 표준으로 결정되었다.하나의 TCP 커넥션에 여러 요청을 동시에 보내, 레이턴시를 줄이는 것 - HTTP 멀티플렉싱RTT가 20ms인 경우, 12.34% 성능 개선 효과를 보았다.RTT가 80ms인 경우, 23.85% 성능 개선 효과를 보았다.RTT가 200ms인 경우, 26.79% 성능 개선 효과를 보았다.HTTP/2.."
host: go-gradually.tistory.com
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fbte6Lu%2FbtsNt9pwvY2%2FAAAAAAAAAAAAAAAAAAAAAKxhKjkV7elVt0zRhFMREBYz6000tVwGiu4UMX5QiD9d%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3Du8mgErGW1bGcrPmwSp8PMkwRaHk%253D
```

```cardlink
url: https://medium.com/@devfallingstar/network-http-2%EC%97%90%EC%84%9C-multiplexing%EC%9D%B4%EB%9E%80-565a7b184c
title: "Medium"
host: medium.com
favicon: https://miro.medium.com/v2/5d8de952517e8160e40ef9841c781cdc14a5db313057fa3c3de41c6f5b494b19
```

https://freecontent.manning.com/animation-http-1-1-vs-http-2-vs-http-2-with-push/


