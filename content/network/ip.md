---
title: IP
aliases:
  - ip
  - internet protocol
  - 인터넷 프로토콜
---
## IP란?

인터넷 프로토콜(IP)은 데이터 패킷이 네트워크를 통해 이동하고 올바른 대상에 도착할 수 있도록 데이터 [[packet|패킷]]을 라우팅하고 주소를 지정하기 위한 프로토콜 또는 규칙의 집합이다.  

- 인터넷의 기본적인 통신 [[protocol|프로토콜]]
- 조각들의 순서가 뒤바뀌거나 일부가 누락되더라도 크게 상관하지 않고 보내는 데 집중

순서가 보장되지 않는 이러한 문제를 극복하기에 위해 [[tcp|TCP]]가 등장

## IP 주소

인터넷에 연결하는 장치나 도메인에 할당된 고유 식별자이다.  

![DNS 요청|697](https://images.ctfassets.net/slt3lc6tev37/54NvR4ArYd9isJUmbz5wbW/5abc7d8ece3a915683f8ed71d47ea28e/ddos-dns.svg)  
https://www.cloudflare.com/learning/dns/glossary/what-is-my-ip-address/  

- IP 주소 체계에는 IPv4와 IPv6 두 가지가 있습니다.
- IPv6는 IPv4 주소 부족 문제를 해결하기 위해 개발되었습니다.

|구분|IPv4|IPv6|
|---|---|---|
|주소 체계|32비트|128비트|
|주소 개수|약 43억 개|무한대 (약 43억 x 43억 x 43억 x 43억)|
|표시 방법|8비트씩 4부분(10진수)|16비트씩 8부분(16진수)|
|주소 예|192.168.0.100|2001:0000:3238:DFE1:0063:0000:0000:FEFB|
|보안성|추가적인 보안 필요|기본 IPSec 지원|

## 서브넷팅

- 하나의 큰 네트워크를 여러 개의 작은 네트워크로 나누는 과정
- 이를 통해 IP 주소를 보다 효율적으로 활용하고, 네트워크 성능과 보안을 향상




## 출처

https://www.cloudflare.com/ko-kr/learning/network-layer/internet-protocol/  
https://wikidocs.net/275073  