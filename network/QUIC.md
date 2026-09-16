---
tags:
  - Network
  - HTTP
---
구글이 발표한 [[UDP]] 기반의 차세대 전송 계층 통신 프로토콜이다.  

![[IMG-20260916194305694.png|454]]

- QUIC은 HTTP/2의 TCP 수준에서 Stream 간 HOL Blocking 문제를 해결 (독립 스트림을 사용)
- TCP 연결과 TLS 연결을 UDP 위에서 통합하여 신규 QUIC 연결시 1-RTT 수준으로 데이터 전송
- 이전에 연결했던 서버라면 세션 정보를 캐싱하여 0-RTT 전송 (Replay Attack 위험 존재, 무조건적 사용 금지)
- Connection Migration을 사용하여 IP 주소나 UDP Port가 변경되어도 연결을 유지 가능

## 출처 및 참고자료

https://www.cdnetworks.com/ko/blog/media-delivery/what-is-quic/

```cardlink
url: https://ko.wikipedia.org/wiki/QUIC
title: "QUIC - 위키백과, 우리 모두의 백과사전"
host: ko.wikipedia.org
favicon: https://ko.wikipedia.org/static/favicon/wikipedia.ico
```
