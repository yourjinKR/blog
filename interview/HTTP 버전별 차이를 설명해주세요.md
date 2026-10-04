---
date: 2026-09-16
tags:
  - 면접
  - 스터디
  - Network
  - HTTP
  - Web
---
HTTP 1.0은 요청마다 [[TCP 3-Way Handshake|TCP 연결]]을 새로 맺고 끊는 구조라 연결 비용이 컸습니다.  
HTTP 1.1은 [[HTTP Keep-Alive]]로 TCP 연결을 재사용하고, [[HTTP Pipelining]]으로 응답을 기다리지 않고 요청을 연달아 보낼 수 있게 했습니다.  

[[HTTP 2|HTTP 2.0]]은 바이너리 기반 [[HTTP 2#Frame|Frame]]으로 메세지 구조를 바꾸고 [[Multiplexing]]과 헤더 압축으로 하나의 연결에서 여러 요청과 응답을 더 효율적으로 처리했습니다.  

[[HTTP 3|HTTP 3.0]]은 [[TCP]] 대신 [[UDP]] 위의 [[QUIC]]를 사용해 연결 수립 비용을 줄이고, TCP 계층의 [[HTTP Keep-Alive#HOL Blocking|HOL Blocking]] 현상을 줄일 수 있었습니다. 

> [!QUESTION]- HTTP/1.1 Pipelining과 HTTP/2 Multiplexing은 어떻게 다른가요?
> Pipelining은 응답을 기다리지 않고 요청을 연달아 보내지만, HTTP/1.1 응답은 요청 순서대로 보내야 하므로 앞 응답이 늦으면 뒤 응답도 기다립니다. HTTP/2는 스트림 ID로 요청·응답을 구분하고 여러 스트림의 프레임을 섞어 보낼 수 있습니다. Pipelining을 HTTP/1.1 클라이언트가 모두 적극 활용한다고 가정하지는 않습니다. [RFC 9112 §9.3.2](https://www.rfc-editor.org/rfc/rfc9112.html#section-9.3.2), [RFC 9113](https://www.rfc-editor.org/rfc/rfc9113.html#section-5)

> [!QUESTION]- HTTP/2가 다중화한다면 왜 HOL Blocking이 남나요?
> 여러 HTTP 스트림이 하나의 TCP 바이트 스트림을 공유하기 때문입니다. TCP에서 앞부분이 유실되면 순서대로 전달하기 위해 복구를 기다리므로 다른 HTTP 스트림의 데이터도 애플리케이션에 전달되지 못할 수 있습니다. HTTP 응답 순서의 제약과 TCP 전달 순서의 제약을 구분해야 합니다.

> [!QUESTION]- HTTP/3는 UDP를 쓰는데 유실과 순서를 어떻게 처리하나요?
> UDP 위의 QUIC이 ACK·손실 복구·흐름 제어·혼잡 제어와 스트림별 순서 보장을 제공합니다. 따라서 UDP를 쓴다는 이유로 신뢰성이 없는 것은 아닙니다. 한 스트림의 데이터 손실이 다른 독립 스트림의 전달 순서를 직접 막는 문제를 줄이지만, 같은 스트림의 대기나 연결이 공유하는 혼잡 제어의 영향까지 사라지지는 않습니다. [RFC 9000](https://www.rfc-editor.org/rfc/rfc9000.html#section-2)

> [!QUESTION]- 헤더 압축은 왜 필요하며 본문 압축과 같은가요?
> 쿠키나 공통 헤더처럼 요청마다 반복되는 정보의 전송량을 줄이기 위해서입니다. HTTP/2는 HPACK, HTTP/3는 QPACK을 사용하며, gzip·Brotli 같은 본문 압축과는 별개입니다. HTTP/2의 바이너리 프레임도 메시지 표현 방식이지 그 자체가 본문을 압축한다는 뜻은 아닙니다. [RFC 9113의 헤더 압축](https://www.rfc-editor.org/rfc/rfc9113.html#section-4.3), [RFC 9114](https://www.rfc-editor.org/rfc/rfc9114.html#section-4.2)

> [!QUESTION]- 클라이언트와 서버는 어떤 HTTP 버전을 사용할지 어떻게 정하나요?
> 일반적인 HTTPS 연결에서는 TLS의 ALPN으로 h2나 http/1.1 등을 협상합니다. HTTP/3는 Alt-Svc나 DNS의 HTTPS 레코드 등으로 지원 정보를 얻은 뒤 QUIC 연결에서 h3를 협상할 수 있습니다. 클라이언트·서버·중간 경로의 지원 여부에 따라 이전 버전으로 연결할 수도 있습니다. [RFC 9113 §3.2](https://www.rfc-editor.org/rfc/rfc9113.html#section-3.2), [RFC 9114 §3](https://www.rfc-editor.org/rfc/rfc9114.html#section-3), [RFC 9460의 HTTPS 레코드](https://www.rfc-editor.org/rfc/rfc9460.html)

> [!QUESTION]- HTTP/3가 연결 수립과 HOL Blocking을 개선했다면 언제나 더 빠른가요?
> 아닙니다. 이미 연결을 재사용 중인지, 네트워크 RTT와 손실이 어느 정도인지, UDP 경로가 허용되는지 등에 따라 효과가 달라집니다. 서버의 DB 처리 시간이 대부분인 요청이라면 HTTP 버전 변경만으로 큰 개선을 얻기 어려울 수 있습니다. 같은 조건에서 연결 시간과 실제 응답 지연을 비교해야 합니다.

## 출처 및 참고자료

```cardlink
url: https://www.youtube.com/watch?v=nKIqI6BA2Mw
title: "CS 면접 대비 (네트워크편) - 4.3. (꼬리 질문) HTTP 버전 별 특징(1.0 / 1.1 / 2.0 / 3.0)을 설명해주세요. ⭐️⭐️⭐️"
description: "📙 JSCODE 박재성 & 시니 📙✔️ https://linktr.ee/jscode📗 프로그래밍 무료 강의 📗✔️ https://www.youtube.com/@jscode-official/playlists"
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/dc4e66d7/img/favicon_32x32.png
image: https://i.ytimg.com/vi/nKIqI6BA2Mw/maxresdefault.jpg
```
