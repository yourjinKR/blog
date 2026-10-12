---
date: 2026-10-12
tags:
  - 맛추리
  - 트러블슈팅
---
2026년 10월 12일, UT에 앞서 테스트 하던 와중 로딩이 너무 오래 걸리는 것을 파악

![[IMG-20261012205225365.png]]

기본적으로 서버 API도 오래 걸리지만 Client 측 네트워크 요청에서 병목 발견

![[IMG-20261012205400891.png]]

우선 HAR 파일을 기반으로 AI에게 분석 요청
현재 병목의 구조는 다음과 같았음.  

```
0s
│
├─ GET /group/28
│    └─ 4.24초
│
├─ Next.js CSS / JS 다운로드 시작
│
├─ DOMContentLoaded
│    └─ 16.06초
│
├─ JS chunk 다운로드 계속...
│
├─ Load
│    └─ 40.55초
│
└─ 그 뒤 실제 API 요청 시작
     ├─ auth/refresh       ~1.34초
     ├─ groups             ~1.08초
     ├─ groups/28          ~2.04초
     └─ recommendations    ~2.03초
```

작은 파일 전송에도 시간이 오래 걸리고 있으며, 실행시간을 쪼개도 다음과 같은 결과라고 함.  


> Matchuri 애플리케이션 연산이 40초 걸리는 것이 아니라, Cloudflare 캐시에 이미 존재하는 Next.js 정적 파일을 브라우저가 전달받는 데 수십 초가 소요되고 있으며, 한국에서 테스트했다면 Cloudflare 요청이 Seattle(SEA) PoP로 향하는 점을 우선 조사해야 합니다.  

라고 하는데 무슨 의미인지 파악 불가.

## 해결 방식

> Matchuri의 심각한 체감 지연은 애플리케이션 성능 문제가 아니라 특정 도서관 공용망에서 Cloudflare로 향하는 네트워크 경로 문제였다. 프론트는 Cloudflare Proxy 제거로 해결

### `www.matchuri.com`만 Cloudflare DNS-only로 전환

일단 Vercel 자체가 이미 글로벌 CDN이기에 Client는 추가적인 Cloudflare 단의 CDN을 추가적으로 제공할 필요가 전혀 없기에 제거함.  

Cloudflare에서는 끄기

DNS Records → 특정 Record 클릭 → Proxy Status 끄기

![[IMG-20261012213821954.png]]

### 서버는 어떻게 대응할까?

서버 또한 Nginx를 서버 앞단에 두어 최소한의 보완을 하였지만 기존에 Cloudflare가 제공해주던 WAF/DDoS/Edge Rate Limit를 어떻게 보완할지 고민할 필요가 있다.  

## 왜 유독 클라언트만 더더욱 지연이 더 심한가?

> 프론트 정적 리소스에서는 **latency + 낮은 throughput + 여러 파일 의존성**으로 더 큰 지연이 발생한걸까?

### 용량의 차이

이는 당연한 이유인데, 리소스의 크기 자체가 API 응답값에 비해 Client의 정적 리소스가 압도적으로 크기 떄문이다.  
API는 수천 byte 수준, JS chunk 하나는 약 133KB 정도이기에,,

### 동기적

또한 파일 자체가 동기적으로 받아야 

### TCP의 혼잡제어

높은 RTT 환경에서 packet이 유실되면 TCP는 이를 기반으로 혼잡 제어를 기반으로 네트워크 전송률을 낮출 것으로 예상????

→ TCP Level에서의 Head-of-Line Blocking 발생 가능성 존재

## 출처 및 참고자료

```cardlink
url: https://chatgpt.com/share/6accd9ca-dca4-83ec-b2db-f707e124f7a8
title: "이 채팅을 확인해 보세요"
description: "누군가 회원님이 보고 싶어 할 것 같다고 생각한 채팅입니다."
host: chatgpt.com
favicon: https://chatgpt.com/favicon.ico
image: https://ogimg.chatgpt.com/conversation/6accd9ca-dca4-83ec-b2db-f707e124f7a8/response_multicolor_v1.png
```
