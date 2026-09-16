---
tags:
  - Network
aliases:
  - Pipelining
---
Pipelining이란 클라이언트가 이전 요청에 대한 응답을 기다리지 않고 단일 TCP 연결을 통해 여러 개의 HTTP 요청을 연속으로 전송하는 기술이다.  ^intro

![[IMG-20260916171232501.png|455]]

## 한계점

응답의 순서는 여전히 요청된 순서와 동일하게 보내야 하기에 근본적으로 HOL Blocking 문제를 해결하지 못했다.  
이러한 한계점과 호환성 이슈로 인해 HTTP/2의 [[Multiplexing]]으로 대체되었다.  

![[IMG-20260916172919636.png]]

## 출처 및 참고자료

```cardlink
url: https://go-gradually.tistory.com/entry/HTTP20-HTTP-%EB%A9%80%ED%8B%B0%ED%94%8C%EB%A0%89%EC%8B%B1-HoL-Blocking-%EA%B7%B8%EB%A6%AC%EA%B3%A0-HTTP30%EC%9D%98-%EB%93%B1%EC%9E%A5-%EB%B0%B0%EA%B2%BD
title: "HTTP/2.0 - HTTP 멀티플렉싱, HoL Blocking, 그리고 HTTP/3.0의 등장 배경"
description: "HTTP/2.0의 등장 배경HTTP/1.1은 그 구현의 단순성과 명료함, 접근성으로 많은 사랑을 받아왔고, 받고 있다.하지만, 하나의 커넥션으로 여러 요청/응답을 처리하기 어렵고, 응답을 받아야만 그 다음 요청을 보낼 수 있는 것은 분명한 아쉬움으로 남아있었다.그리하여, 다양한 곳에서 속도를 개선하기 위한 다양한 방법의 연구가 진행되었다.최종적으로, 구글의 \"SPDY\" 가 HTTP/2.0의 표준으로 결정되었다.하나의 TCP 커넥션에 여러 요청을 동시에 보내, 레이턴시를 줄이는 것 - HTTP 멀티플렉싱RTT가 20ms인 경우, 12.34% 성능 개선 효과를 보았다.RTT가 80ms인 경우, 23.85% 성능 개선 효과를 보았다.RTT가 200ms인 경우, 26.79% 성능 개선 효과를 보았다.HTTP/2.."
host: go-gradually.tistory.com
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fbte6Lu%2FbtsNt9pwvY2%2FAAAAAAAAAAAAAAAAAAAAAKxhKjkV7elVt0zRhFMREBYz6000tVwGiu4UMX5QiD9d%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3Du8mgErGW1bGcrPmwSp8PMkwRaHk%253D
```

```cardlink
url: https://en.wikipedia.org/wiki/HTTP_pipelining
title: "HTTP pipelining - Wikipedia"
host: en.wikipedia.org
favicon: https://en.wikipedia.org/static/favicon/wikipedia.ico
image: https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/HTTP_pipelining2.svg/1280px-HTTP_pipelining2.svg.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail
```
