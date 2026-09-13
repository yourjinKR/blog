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
	- [[packet|패킷]] 손실, 중복, 순서 바뀜 등이 없도록 보장
	- TCP 하위 계층인 IP 계층의 신뢰성 없는 서비스를 보완하여 신뢰성 제공
- **연결 지향적**
	- 같은 전송 계층인 UDP가 비연결성인 것과는 달리, TCP는 연결지향적
	- 양단간 애플리케이션/프로세스는 TCP가 제공하는 연결성 회선을 통하여 통신
- **흐름 제어**
	- 흐름 제어 기능을 활용하여 송신 및 수신 속도를 일치
- **혼잡 제어**
	- 네트워크가 혼잡하다고 판단될 때는 혼잡제어 기법을 사용하여 송신율을 감속

## 동작 방식

TCP 또한 데이터를 패킷 형태로 쪼개어 전송한다.  

1. 데이터 스트림에서 받은 데이터를 일정 단위로 분할
2. 분할된 데이터 단위에 TCP 헤더를 붙여서 TCP 세그먼트를 생성
3. TCP 세그먼트를 IP 데이터그램으로 변환
4. IP 데이터그램을 수신 애플리케이션에 보내요.

> [!info]
> IP 데이터그램은 인터넷 통신에 사용되는 데이터 패킷

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
