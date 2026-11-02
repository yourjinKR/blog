---
date: 2026-10-31
tags:
  - Network
aliases:
  - Simple Text Oriented Messaging Protocol
---
메세지 브로커를 활용하여 쉽게 메세지를 주고 받을 수 있는 프로토콜

- Pub/Sub(발행/구독): 발신자가 메세지를 발행하면 수신자가 그것을 수신하는 메세징 패러다임
- 메세지 브로커: 발신자의 메세지를 받아와서 수신자들에게 메세지를 전달하는 요소

## WebSocket과 STOMP

[[WebSocket|웹소켓]]과 같은 실시간 기능의 하위(서브) 프로토콜로도 주로 활용한다.  

Frame 단위의 프로토콜이다.  

- 커맨드
- 헤더
- 바디