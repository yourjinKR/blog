---
date: 2026-10-21
aliases:
  - 서킷 브레이커 패턴
tags:
  - DesignPattern
---
Circuit Breaker 패턴이란  마이크로서비스 아키텍처에서 서비스 장애가 전체 시스템에 미치는 영향을 방지하기 위해 사용되는 디자인 패턴이다.  ^intro

마치 가전제품을 보호하기 위해 전기의 흐름을 차단하는 전기 회로 차단기와 유사하게, 소프트웨어 기반 회로 차단기는 서비스 간 상호 작용을 모니터링합니다. 타임아웃, 서버 과부하 또는 네트워크 문제 등 다양한 원인으로 장애가 증가하는 것을 감지하면 해당 서비스로의 트래픽을 차단하여 시스템이 원활하게 복구되고 병목 현상을 방지하며 시스템 안정성을 유지할 수 있도록 합니다.

> [!quote] What is Circuit Breaker?
> The circuit breaker pattern is a design pattern used in microservices architecture to prevent service failures from impacting an entire system. Much like an electrical circuit breaker that interrupts the flow of electricity to protect appliances, the software-based circuit breaker monitors service interactions. When it detects an increase in failures—whether due to timeouts, server overload, or network issues—it "trips," halting traffic to the failing service. This allows the system to recover gracefully, avoid bottlenecks, and maintain system stability.
> 
> https://aerospike.com/blog/circuit-breaker-pattern/

## 출처 및 참고자료

```cardlink
url: https://mangkyu.tistory.com/261
title: "[디자인패턴] 서킷 브레이커 패턴(Circuit Breaker Pattern)의 필요성 및 동작 원리"
description: "이번에는 특히 MSA 환경에서 필수 패턴 중 하나인 서킷브레이커 패턴에 대해 알아보도록 하겠습니다. 1. 서킷 브레이커 패턴(Circuit Breaker Pattern)의 등장 및 개념 [ 서킷 브레이커 패턴(Circuit Breaker Pattern)의 등장 ] 개발을 하다 보면 외부 API를 호출해야 하는 경우가 있다. 특히나 전체적인 시스템 구성이 MSA로 되어 있다면 다른 서비스를 호출하는 경우가 매우 빈번하다. 문제는 서버들에 장애가 발생할 수 있다는 점인데, 호출한 다른 서비스에 장애가 발생했다면 장애가 전파되어, 해당 서비스까지 문제가 발생할 수 있다. 또한 장애가 발생한 서버에 계속 요청을 보내는 것은 장애 복구를 힘들게 만든다. 그래서 장애가 발생한 서비스를 탐지하고, 요청을 보내지 않도.."
host: mangkyu.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcyjR6q%2FbtrFBHFUdBv%2FAAAAAAAAAAAAAAAAAAAAAG3Szk9JBGjjVcB8n7F0gv-THXBJOCChbNK7D0OBtRi3%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DAxXrneOYPnSGk7fwkYFHrGaCu9M%253D
```

```cardlink
url: https://oliveyoung.tech/2023-08-31/circuitbreaker-inventory-squad/
title: "Circuitbreaker를 사용한 장애 전파 방지 | 올리브영 테크블로그"
description: "Circuitbreaker와 Resilience4j A to Z"
host: oliveyoung.tech
favicon: https://oliveyoung.tech/favicon.png
image: https://oliveyoung.tech/blog-images/2023-08-31/banner.png
```
