---
title: TCP/IP 계층
tags:
  - Network
aliases:
  - TCP/IP 계층
---
## TCP/IP 4계층이란?

- [[OSI 7 계층]]을 기반으로 상업적이고 실무적으로 이용될 수 있도록 단순화한 것
- 네트워크 전송 시 데이터 표준을 정리한 것이 OSI 7계층이라면 해당 이론을 실제 사용하는 인터넷 표준이 TCP/IP 4계층이다.  

![[IMG-20260909013420893.svg]]

### 애플리케이션 계층 (Application Layer)

응용프로그램이 사용되는 프로토콜 계층이며, 서비스를 실질적으로 사람들에게 제공하는 계층

### 전송 계층 (Transport Layer)

- 통신 노드 간의 연결을 제어하고, **신뢰성 있는 데이터 전송을 보장**한다.
- 패킷들의 전송이 유효한지 확인하고, 전송 실패한 패킷들을 다시 전송한다.
- 프로토콜 : [[TCP]], UDP
- 데이터 단위 : Segment
- 전송 주소 : [[Port]]

### 인터넷 계층 (Interent Layer)

- 여러 개의 패킷 교환망들의 상호 연결을 위한 **비연결성 프로토콜**
- 통신 노드 간의 IP 패킷을 전송하는 기능과 라우팅 기능을 담당한다.
- 데이터 단위 : [[Packet]]
- 전송 주소 : [[IP]]

### 네트워크 연결 계층 (Network Access Layer)

- 물리적인 주소로 MAC을 사용한다. (논리 주소인 IP 사용이 아니다.)
- 전선, 광섬유, 무선 등으로 실질적으로 데이터를 전달하며 장치 간에 신호를 주고받는 '규칙'을 정하는 계층
- 데이터 단위 : 프레임(데이터 링크 계층), 비트(물리 계층)
- 전송 주소 : [[MAC]]


![[OSI 7 계층#OSI 7 계층과 TCP/IP 4 계층]]


## 출처 및 참고자료

```cardlink
url: https://reminisce057.tistory.com/50
title: "TCP/IP 4계층 모델"
description: "IP (Internet Protocol) 데이터를 패킷(Packet) 이라는 단위로 최대한 빠르게 특정 목적지로 보내는 프로토콜 비신뢰성 : 패킷의 순서 보장이 되지 않고 전달여부도 보장되지 않는다.(유실 가능성이 있다.) 비연결성 : 송신자와 수신자가 데이터 전송을 위해 서로 연결될 필요가 없다. (수신자의 받지 못할 상태인지 여부와 상관 없이 데이터를 보낼 수 있다. 이 경우 수신자는 데이터를 받지 못한다.) IP가 비신뢰성과 비연결성을 갖는 이유 : 통신속도를 가장 중요하게 생각하기 때문 인터넷 속도가 빨라지고 데이터의 신뢰성이 중요해지면서 IP패킷 위에 TCP 패킷을 덮은 TCP/IP 프로토콜을 자주 사용한다. TCP/IP 개념 현재 인터넷에서 사용되는 프로토콜로 시스템 간 네트워크 연결과, 데이.."
host: reminisce057.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FmKqDG%2FbtsEhzCtGws%2FAAAAAAAAAAAAAAAAAAAAACCMK2Ru58Pl7YiiZ5evwf3Trip72qS0i9YQFy1Hda8j%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DQyqQAd4ZYyxAtDOu%252BRKlD%252B0N5AE%253D
```
  