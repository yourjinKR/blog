---
date: 2026-09-24
tags:
  - Network
  - Web
aliases:
  - Domain Name System
---
도메인 이름과 [[IP]] 주소를 상호 변환해주는 시스템이다.  

> [!NOTE]
> 사용자가 브라우저에 도메인 이름을 입력하면, DNS는 여러 서버(Recursive Resolver, Root Server, TLD Server, Authoritative Name Server)를 거쳐 해당 도메인에 매핑된 IP 주소를 찾아 반환합니다. 이 과정을 **DNS 쿼리**라고 합니다.

DNS는 주로 53번 포트를 사용하며, [[UDP]] 프로토콜을 기반으로 동작하여 빠른 응답 속도를 제공한다.  

## DNS Lookup

DNS를 이용하여 도메인 주소에 해당하는 IP주소를 받아오는 일련의 과정이다.  


## 출처 및 참고자료

```cardlink
url: https://jeongcheogi.edugamja.com/theory/network-os/application-layer-protocol#dns-domain-name-system
title: "응용 계층 프로토콜"
description: "SSH, HTTP, FTP, SMTP 등 응용 계층 프로토콜의 역할과 포트 번호를 정리합니다."
host: jeongcheogi.edugamja.com
favicon: https://jeongcheogi.edugamja.com/favicon.ico?favicon.2ns115htqsj_s.ico
image: https://jeongcheogi.edugamja.com//folder-icons/theory/network-os/application-layer-protocol.webp
```

https://medium.com/@mysunghun585/http-dns-lookup-e414aa24179e  