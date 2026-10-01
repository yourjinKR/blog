---
date: 2026-10-01
tags:
  - Network
aliases:
  - Content Delivery Network
  - 콘텐츠 전송 네트워크
---
CDN이란 웹 콘텐츠를 세계 곳곳에 있는 여러 서버에 분산하여 저장하는 분산 서버 네트워크 시스템이다. ^intro

![[IMG-20261001031316003.png]]

사용자가 웹사이트에 접속했을 때, 아래와 같은 일이 발생한다.

- DNS 서버는 사용자의 위치를 기준으로 가장 가까운 엣지 서버의 IP 주소를 반환
- 엣지 서버는 요청된 컨텐츠가 캐싱되어 있는지 확인, 없다면 오리진 서버에서 최신 컨텐츠를 가져온다
- 엣지 서버는 사용자에게 컨텐츠를 제공

## CDN 무효화

엣지 서버와 오리진 서버의 정합성을 위해 캐시 무효화와 같이 CDN 또한 무효화 작업이 필요하다.  

> 무효화한다고 해서 CDN에 새로운 컨텐츠를 넣는게 아니라 캐시를 삭제시켜 Cache MISS가 발생하도록 유도한다.  

CDN 무효화 뿐만 아니라 **Cache Busting** / **URL Versioning**과 같은 방식으로도 관리한다.  
**URL Versioning**은 아래와 같이URL에 버전을 명시하거나 hash값을 넣어 컨텐츠가 바뀔때마다 구분하는 방식이다.  

```
/profile.jpg?v=2
app.b029fa2.js
```

혹은 [[HTTP Cache|HTTP 캐시]]를 활용하여 TTL 만료에 의해 자연스럽게 캐시가 무효화된다.  

```http
Cache-Control: public, max-age=3600
```

## CDN 도입 근거

국내 서비스여도 CDN을 사용할 수 있으며 우선 2가지를 기억하자.

- 정적 자원을 캐싱하여 Origin 서버나 스토리지의 부하를 줄일 수 있다.
- 글로벌 서비스로 확장하면 사용자와 가까운 Edge 서버에서 응답하여 지역별 Latency를 줄일 수 있다.

추가적으로 다음과 같은 이유로 CDN 도입을 고려할 수 있다.

- 정적 자원 요청이 많은 서비스에서는 CDN 캐싱을 통해 Origin의 요청 수와 데이터 전송량을 줄여 비용을 절감할 수 있다.
- 스토리지에 대한 직접 접근을 제한하고 CDN을 통해서만 접근하도록 구성하면 Origin을 외부 요청으로부터 보호할 수 있다.


## 출처 및 참고자료

```cardlink
url: https://docs.tosspayments.com/resources/glossary/cdn
title: "CDN(Content Delivery Network) | 토스페이먼츠 개발자센터"
description: "CDN(Content Delivery Network)이란 웹 콘텐츠를 세계 곳곳에 있는 여러 서버에 분산하여 저장하는 분산 서버 네트워크 시스템입니다."
host: docs.tosspayments.com
favicon: https://static.toss.im/tds/favicon/favicon-16x16.png
image: https://docs.tosspayments.com/api/open-graph/image?pathname=/resources/glossary/cdn
```

```cardlink
url: https://www.youtube.com/watch?v=8rGwIe86U6Y&t=105s
title: "개발 면접 : 국내 서비스에 CDN?"
description: "개발자 면접 상황에서 받을 수 있는 질문에 대한 명확한 대답을 찾아가는 시리즈입니다.내용 정리 Docs : https://cafe.naver.com/xxxjjhhh/60800:00 - 면접 QnA01:45 - 결론 : CDN의 장점03:18 - 추가로04:55 - CDN 관련 추가..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/e6aecce7/img/favicon_32x32.png
image: https://i.ytimg.com/vi/8rGwIe86U6Y/maxresdefault.jpg
```
