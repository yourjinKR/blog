---
tags:
  - Network
aliases:
  - 전송 제어 프로토콜
---
## TCP란?

 애플리케이션 사이에서 안전하게 데이터를 통신하는 네트워크 [[protocol|프로토콜]]이다.

## TCP 특징

- **신뢰성 보장**
	- [[Packet|패킷]] 손실, 중복, 순서 바뀜 등이 없도록 보장
	- TCP 하위 계층인 [[IP]] 계층의 신뢰성 없는 서비스를 보완하여 신뢰성 제공
- **연결 지향적**
	- 양단간 애플리케이션/프로세스는 TCP가 제공하는 연결성 회선을 통하여 통신
	- 같은 전송 계층인 [[UDP]]가 비연결성인 것과는 달리, TCP는 연결지향적
- [[TCP 오류 제어]]: 데이터 유실 및 훼손 시 재전송(ARQ)을 통해 오류를 복구
- [[TCP 흐름 제어]]: 송신자와 수신자 간의 데이터 처리 속도 차이(슬라이딩 윈도우 등)를 해결
- [[TCP 혼잡 제어]]: 네트워크 전체의 혼잡도를 파악하여 송신량(AIMD, Slow Start 등)을 조절

## 동작 방식

TCP는 [[TCP 3-Way Handshake|통신 전 연결]]을 수립하고 통신이 끝나면 [[TCP 4-way handshake|연결을 종료]]한다.  
통신 과정에서 아래와 같이 데이터를 패킷 형태로 쪼개어 송수신한다.  

1. 바이트 스트림에서 받은 데이터를 일정 단위로 분할
2. 분할된 데이터 단위에 TCP 헤더를 붙여서 TCP 세그먼트를 생성
3. TCP 세그먼트를 IP 데이터그램으로 변환
4. IP 데이터그램을 수신 애플리케이션에 보냄

> [!info]
> IP 데이터그램은 인터넷 통신에 사용되는 데이터 패킷

%%%%
### TCP 세그먼트

TCP 세그먼트는 헤더와 데이터 필드가 나뉘어져 있다.  
내부에는 발송/수신 각각의 **포트**와 **시퀀스 번호**가 담겨져 있다.

- **Source Port:** 데이터를 발송하는 애플리케이션의 포트 번호입니다.
- **Destination Port:** 데이터를 수신하는 애플리케이션의 포트 번호입니다.
- **Sequence Number(SYN):** TCP 통신 과정에서 데이터를 일정 단위로 분할하는데요. 분할된 데이터의 순서입니다.
- **Acknowledgment Number(ACK):** 데이터를 수신하는 애플리케이션 입장에서, 다음으로 받고 싶은 TCP 세그먼트의 Sequence Number입니다.

> [!info]
> 통신 과정에서 분할된 데이터가 순서대로 전달되지 않거나 각자 다른 경로로 통신될 수 있다.  
> 그러나 TCP 헤더가 있어서 데이터를 안전하고 정확하게 원상복구할 수 있다.  

- MSS: TCP로 전송할 수 있는 최대 페이로드 크기
- MTU: MSS + 헤더 크기

![[IMG-20260903105019876.png]]  
%%%%
## 출처 및 참고자료

```cardlink
url: https://docs.tosspayments.com/resources/glossary/tcp#tcp-%EC%84%B8%EA%B7%B8%EB%A8%BC%ED%8A%B8
title: "TCP(Transmission Control Protocol) | 토스페이먼츠 개발자센터"
description: "TCP(Transmission Control Protocol)는 애플리케이션 사이에서 안전하게 데이터를 통신하는 규약이에요."
host: docs.tosspayments.com
favicon: https://static.toss.im/tds/favicon/favicon-16x16.png
image: https://docs.tosspayments.com/api/open-graph/image?pathname=/resources/glossary/tcp
```

```cardlink
url: https://www.youtube.com/watch?v=d6pUy1Z56h8
title: "[네트워크 기초 강의] 31강. TCP와 UDP"
description: "본 강의는 『혼자 공부하는 네트워크』를 바탕으로 제작하였습니다. 👨‍🏫주요 강의 내용Ch 04. 전송 계층04-2 TCP와 UDP00:12 전송 계층의 가장 중요한 프로토콜, TCP와 UDP01:17 TCP 통신 단계03:29 TCP 세그먼트 구조13:08 TCP 연결 수립과 ..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/3a93864d/img/favicon_32x32.png
image: https://i.ytimg.com/vi/d6pUy1Z56h8/maxresdefault.jpg
```
