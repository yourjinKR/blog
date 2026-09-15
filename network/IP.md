---
tags:
  - Network
aliases:
  - internet protocol
  - 인터넷 프로토콜
---
인터넷 프로토콜(IP)은 데이터 패킷이 네트워크를 통해 이동하고 올바른 대상에 도착할 수 있도록 데이터 [[Packet|패킷]]을 라우팅하고 주소를 지정하기 위한 프로토콜 또는 규칙의 집합이다.  

- 인터넷의 기본적인 통신 [[protocol|프로토콜]]
- 조각들의 순서가 뒤바뀌거나 일부가 누락되더라도 크게 상관하지 않고 보내는 데 집중

순서가 보장되지 않는 이러한 문제를 극복하기에 위해 [[TCP|TCP]]가 등장

## IP 주소

인터넷에 연결하는 장치나 도메인에 할당된 고유 식별자이다.  

![DNS 요청|697](https://images.ctfassets.net/slt3lc6tev37/54NvR4ArYd9isJUmbz5wbW/5abc7d8ece3a915683f8ed71d47ea28e/ddos-dns.svg)  
- IP 주소 체계에는 IPv4와 IPv6 두 가지가 있습니다.
- IPv6는 IPv4 주소 부족 문제를 해결하기 위해 개발되었습니다.

| 구분    | IPv4           | IPv6                                    |
| ----- | -------------- | --------------------------------------- |
| 주소 체계 | 32비트           | 128비트                                   |
| 주소 개수 | 약 43억 개        | 무한대 (약 43억 x 43억 x 43억 x 43억)           |
| 표시 방법 | 8비트씩 4부분(10진수) | 16비트씩 8부분(16진수)                         |
| 주소 예  | 192.168.0.100  | 2001:0000:3238:DFE1:0063:0000:0000:FEFB |
| 보안성   | 추가적인 보안 필요     | 기본 IPSec 지원                             |

- IP 주소는 네트워크 ID와 호스트 ID 두 가지 부분으로 나뉘며 이는 [[Subnet#서브넷 마스크|서브넷 마스크]]로 나뉜다.  

## 출처 및 참고자료

```cardlink
url: https://www.cloudflare.com/learning/dns/glossary/what-is-my-ip-address/
title: "What is My IP Address?"
description: "An IP Address is a unique numerical identifier used to keep track of who is who on the Internet."
host: www.cloudflare.com
favicon: https://www.cloudflare.com/favicon.ico
image: https://www.cloudflare.com/preview.png
```

```cardlink
url: https://wikidocs.net/275073
title: "04-03 IP 주소와 서브넷팅"
description: "안정적인 통신 환경을 구축하려면 **IP 주소**와 **서브넷 마스크**의 원리를 이해해야 합니다. IP 주소는 네트워크에서 기기를 식별하는 주소이고, 서브넷팅은 하나의 IP 네…"
host: wikidocs.net
favicon: https://static.wikidocs.net/static/img/favicon.ico?v=2
image: https://static.wikidocs.net/images/book/book_1772365770_1772365832.jpg
```
  