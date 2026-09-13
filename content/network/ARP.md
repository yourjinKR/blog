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

## 출처 및 참고자료

```cardlink
url: https://ko.wikipedia.org/wiki/%EC%A3%BC%EC%86%8C_%EA%B2%B0%EC%A0%95_%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C
title: "주소 결정 프로토콜 - 위키백과, 우리 모두의 백과사전"
host: ko.wikipedia.org
favicon: https://ko.wikipedia.org/static/favicon/wikipedia.ico
```
