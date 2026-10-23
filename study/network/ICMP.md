---
date: 2026-10-12
tags:
  - Network
aliases:
  - Internet Control Message Protocol
  - 인터넷 제어 메세지 프로토콜
---
ICMP는 네트워크 장치에서 네트워크 통신 문제를 진단하는 데 사용하는 네트워크 계층 프로토콜이다.  ^intro

- **주요 메시지 유형**:
    - **Echo Request/Reply**: 네트워크 연결 상태를 확인 (`ping` 명령어)
    - **Destination Unreachable**: 목적지에 도달할 수 없음
    - **Time Exceeded**: 패킷의 TTL(Time To Live)이 0이 되어 패킷이 폐기됨
    - **Redirect**: 더 나은 경로를 알려줌

## 출처 및 참고자료

```cardlink
url: https://jeongcheogi.edugamja.com/theory/network-os/network-protocol#icmp-internet-control-message-protocol
title: "네트워크 계층 프로토콜"
description: "네트워크의 핵심인 네트워크 계층 프로토콜(IP, ARP, RARP, ICMP, IGMP)과 주요 기술(라우팅, NAT)의 개념과 특징을 알아보고, 정보처리기사 시험에 대비한 예상 문제까지 풀어봅니다."
host: jeongcheogi.edugamja.com
favicon: https://jeongcheogi.edugamja.com/favicon.ico?favicon.2ns115htqsj_s.ico
image: https://jeongcheogi.edugamja.com//folder-icons/theory/network-os/network-protocol.webp
```

```cardlink
url: https://www.cloudflare.com/ko-kr/learning/ddos/glossary/internet-control-message-protocol-icmp/
title: "ICMP란?| 네트워크레이어 프로토콜"
description: "네트워크간 통신을 위해 사용되는 네트워크 레이어인 ICMP에 대해 알아보세요."
host: www.cloudflare.com
image: https://cf-assets.www.cloudflare.com/slt3lc6tev37/dyoDxOK6E2FMohWlBz5yG/ddfed013002607cae294417c23bcdf74/ddos-lc.png
```
