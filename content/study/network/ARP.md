---
tags:
  - Network
aliases:
  - Address Resolution Protocol
---
ARP(주소 결정 프로토콜)는 네트워크 상에서 논리적 주소인 [[IP]] 주소를 물리적 주소인 [[MAC]] 주소로 변환(매핑)해 주는 통신 프로토콜이다.  ^intro

> [!INFO]
> IPv6에서는 ARP 대신 **NDP(Neighbor Discovery Protocol)**를 사용

%%%%
## 동작 과정

1. 송신자는 목적지 IP에 대응하는 MAC 주소를 ARP Cache에서 확인한다.
2. MAC 주소가 없다면 ARP Request를 Broadcast로 전송한다.
3. 해당 IP를 가진 장치는 자신의 MAC 주소를 담은 ARP Reply를 응답한다.
4. 송신자는 IP-MAC 매핑 정보를 ARP Cache에 저장한다.
5. 알아낸 MAC 주소를 목적지 MAC으로 사용하여 Frame을 전송한다.

## RARP

- ARP: IP → MAC
- RARP: MAC → IP

RARP(Reverse ARP)를 현재 사용하지 않는 가장 결정적인 이유는 IP 주소만 알려줄 뿐, 서브넷 마스크, 게이트웨이, DNS 서버 같은 필수 네트워크 정보를 전혀 제공하지 못하기 때문입니다.과정상으로 보면 RARP는 과거 디스크가 없는 컴퓨터(정적 호스트)가 자신의 MAC 주소를 이용해 서버로부터 IP 주소를 할당받기 위해 개발되었습니다. 하지만 인터넷이 발전하면서 단순히 IP 주소 하나만으로는 정상적인 네트워크 통신을 할 수 없게 되었고, 이를 보완한 BOOTP를 거쳐 현재는 DHCP(Dynamic Host Configuration Protocol)로 완전히 대체되었습니다.  

## 출처 및 참고자료

```cardlink
url: https://ko.wikipedia.org/wiki/%EC%A3%BC%EC%86%8C_%EA%B2%B0%EC%A0%95_%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C
title: "주소 결정 프로토콜 - 위키백과, 우리 모두의 백과사전"
host: ko.wikipedia.org
favicon: https://ko.wikipedia.org/static/favicon/wikipedia.ico
```
