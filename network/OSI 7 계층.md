---
tags:
  - Network
aliases:
  - OSI 7 Layers
---
컴퓨터 네트워크 [[protocol|프로토콜]] 디자인과 통신을 7개의 계층으로 나누어 설명한 것이다.  ^intro

- 네트워크에서 통신이 일어나는 과정을 7단계로 나눈 모델
- 한 계층의 변화가 다른 계층에 미치는 영향을 최소화하도록 설계
- 개념적 모델이므로 네트워크를 설계하거나 문제를 분석할 때 유용

## 계층

### Application Layer

응용 계층은 응용 프로세스와 직접 관계하여 일반적인 응용 서비스를 수행한다.  

> 대표 프로토콜로는 [[HTTP]], FTP, [[DNS]]

### Presentation Layer

표현 계층은 애플리케이션 간의 통신에서 **메세지 포맷**을 관리한다. 

> [[mime-type|MIME]] 인코딩이나 암호화 등의 동작이 해당 계층에서 이루어진다.  

### Session Layer

세션 계층은 양 끝단의 응용 프로세스가 통신을 관리하기 위한 방법을 제공한다.  

> API, Socket

### Transport Layer

전송 계층은 **서로 다른 호스트의 프로세스 간에 데이터를 끝까지 전달하는 역할**을 담당한다.  

애플리케이션 간의 통신 담당, 안정적이고 신뢰할 수 있는 데이터 전송 보장한다.  
[[TCP 3-way handshake]] 과정을 통해 [[TCP]] 연결 설정/종료를 수행한다.  

> TCP, UDP

### Network Layer

네트워크 계층은 서로 다른 네트워크에 위치한 **호스트 간 데이터 전달**을 담당한다.  

논리 주소를 이용하여 목적지를 식별하며, 목적지까지의 경로를 결정하고 [[Packet|패킷]]을 다음 네트워크로 전달한다.  
대표적인 프로토콜로는 [[IP]]가 있으며, 라우터가 네트워크 게층에서 패킷을 전달하는 대표적인 장비이다.  

> 라우팅, 흐름 제어, 오류 제어, 세그멘테이션 등을 수행한다.  

### Data Link Layer

데이터 링크 계층은 같은 링크 또는 로컬 네트워크 내에서 인접한 장치 간 Frame 전달을 담당한다.  

Network Layer의 Packet을 Frame으로 캡슐화하며, [[MAC]] Address를 이용해 목적지를 식별한다.  
또한 전송 매체 접근 제어와 오류 검출 등의 기능을 수행한다.  
대표적인 장비는 Switch이며, 대표적인 기술로 Ethernet과 Wi-Fi가 있다.

> [[ARP]]를 통해 IP를 MAC으로 변환한다.  

### Physical Layer

물리 계층은 **0과 1의 비트를 실제 전기적·광학적·무선 신호로 변환하여 물리 매체를 통해 전달하는 계층**이다.
물리 계층은 데이터의 의미나 주소를 해석하지 않고 Bit의 실제 전송만 담당한다.

> 데이터를 전송하는 역할 수행

## 송수신 흐름 과정

| 계층           | 송신 측 (캡슐화)                  | 수신 측 (역캡슐화)          |
| ------------ | --------------------------- | -------------------- |
| 7. 응용 계층     | [[HTTP]] 데이터 생성             | 웹 브라우저에서 HTTP 데이터 해석 |
| 6. 표현 계층     | 데이터 암호화·압축 (SSL/TLS 적용)     | 데이터 복호화·압축 해제        |
| 5. 세션 계층     | 세션 연결 설정 (예: TCP 소켓 생성)     | 세션 유지 또는 해제          |
| 4. 전송 계층     | [[TCP]]/UDP 헤더 추가 (세그먼트 생성) | TCP/UDP 헤더 제거        |
| 3. 네트워크 계층   | [[IP]] 헤더 추가 (패킷 생성)        | IP 헤더 제거             |
| 2. 데이터 링크 계층 | MAC 헤더·트레일러 추가 (프레임 생성)     | MAC 헤더·트레일러 제거       |
| 1. 물리 계층     | 신호(비트)로 변환 후 전송             | 비트를 데이터로 변환          |
각 계층 별로 [[캡슐화와 역캡슐화]] 과정을 통해 데이터가 전송된다.  


![[캡슐화와 역캡슐화]]


## OSI 7 계층과 TCP/IP 4 계층

아래 표는 OSI 7계층과 [[TCP IP 계층|TCP/IP 계층]]을 나란히 놓고 각 계층의 역할과 대표 프로토콜을 정리한 것이다.  

![[IMG-20260913210951494.png]]

> [!NOTE]
> OSI 모델의 상위 3개 계층(응용·표현·세션)은 TCP/IP 모델에서 하나의 **응용 계층**으로 통합됩니다.  
> 반대로 OSI의 물리·데이터 링크 계층은 TCP/IP에서 **네트워크 인터페이스 계층**으로 묶입니다.

%%%%
## 출처 및 참고자료

```cardlink
url: https://ko.wikipedia.org/wiki/OSI_%EB%AA%A8%ED%98%95
title: "OSI 모형 - 위키백과, 우리 모두의 백과사전"
host: ko.wikipedia.org
favicon: https://ko.wikipedia.org/static/favicon/wikipedia.ico
image: https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/OSI-model-Communication.svg/1280px-OSI-model-Communication.svg.png?utm_source=ko.wikipedia.org&utm_campaign=index&utm_content=thumbnail
```

```cardlink
url: https://wikidocs.net/275243
title: "04-02 OSI 7 계층과 TCP/IP"
description: "네트워크를 제대로 이해하려면 **OSI 7계층**과 **TCP/IP 모델**의 구조와 역할을 파악하는 것이 중요합니다. 이 장에서는 네트워크의 기본 흐름을 살펴보고, 각 계층에 …"
host: wikidocs.net
favicon: https://static.wikidocs.net/static/img/favicon.ico?v=2
image: https://static.wikidocs.net/images/book/book_1772365770_1772365832.jpg
```
