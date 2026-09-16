---
tags:
  - 면접
  - 스터디
  - Network
  - HTTP
---
HTTP 1.0은 요청마다 [[TCP 3-way handshake|TCP 연결]]을 새로 맺고 끊는 구조라 연결 비용이 컸습니다.  
HTTP 1.1은 [[HTTP Keep-Alive]]로 TCP 연결을 재사용하고, [[HTTP Pipelining]]으로 응답을 기다리지 않고 요청을 연달아 보낼 수 있게 했습니다.  

[[HTTP 2|HTTP/2]]은 바이너리 기반 [[HTTP 2#Frame|Frame]]으로 메세지 구조를 바꾸고 [[Multiplexing]]과 헤더 압축으로 하나의 연결에서 여러 요청과 응답을 더 효율적으로 처리했습니다.  

[[HTTP 3|HTTP/3]]은 [[TCP]] 대신 [[UDP]] 위의 [[QUIC]]를 사용해 연결 수립 비용을 줄이고, TCP 계층의 [[HTTP Keep-Alive#HOL Blocking|HOL Blocking]] 현상을 줄일 수 있었습니다. 

## 출처 및 참고자료

```cardlink
url: https://www.youtube.com/watch?v=nKIqI6BA2Mw
title: "CS 면접 대비 (네트워크편) - 4.3. (꼬리 질문) HTTP 버전 별 특징(1.0 / 1.1 / 2.0 / 3.0)을 설명해주세요. ⭐️⭐️⭐️"
description: "📙 JSCODE 박재성 & 시니 📙✔️ https://linktr.ee/jscode📗 프로그래밍 무료 강의 📗✔️ https://www.youtube.com/@jscode-official/playlists"
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/dc4e66d7/img/favicon_32x32.png
image: https://i.ytimg.com/vi/nKIqI6BA2Mw/maxresdefault.jpg
```

