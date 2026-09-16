---
tags:
  - Network
  - HTTP
aliases:
  - HTTP 3.0
---
HTTP/3는 월드 와이드 웹에서 정보를 교환하기 위해 사용하는 HTTP 프로토콜의 최신 메이저 버전이다.  
HTTP/3는 기존의 [[TCP]] 대신 [[QUIC]]를 전송 프로토콜로 사용하여 속도, 보안, 안정성을 크게 높였다.  

QUIC은 [[UDP]] 위에서 동작하지만 신뢰성 있는 전송, 재전송, 흐름 제어, 혼잡 제어 등을 자체적으로 제공하며, 여러 Stream을 전송 계층 수준에서 독립적으로 관리한다.  

- QUIC 연결 설정과 [[TLS]] 1.3 Handshake를 함께 수행하여 신규 연결 시 약 1-[[RTT]] 만에 데이터 전송 가능
- 이전 연결 정보가 존재하는 경우 **0-RTT**를 통한 빠른 연결 재개 지원
- **Stream 단위 Multiplexing**으로 특정 Stream의 패킷 손실이 다른 Stream을 차단하지 않음
- TCP 기반 HTTP/2에서 발생할 수 있는 **Head-of-Line Blocking 완화**
- **Connection ID**를 이용해 네트워크가 변경되어도 연결을 유지할 수 있는 **Connection Migration** 지원
- QUIC 자체에 [[TLS]] 1.3이 통합되어 통신 암호화

## 출처 및 참고자료

```cardlink
url: https://www.cloudflare.com/ko-kr/learning/performance/what-is-http3/
title: "HTTP/3란?"
description: "HTTP/3은 하이퍼 텍스트 전송 프로토콜(HTTP)의 다음 주요 수정 버전입니다. 속도, 보안, 안정성 측면의 개선 사항을 알아보세요."
host: www.cloudflare.com
image: https://cf-assets.www.cloudflare.com/slt3lc6tev37/53qCYhQbir5WtIU0VDWESo/954a48bfb17f429acf469e5f14345d83/unnamed-3.png
```

```cardlink
url: https://www.youtube.com/watch?v=xcrjamphIp4
title: "[10분 테코톡] 🧃쿨라임의 HTTP/1.1, HTTP/2, 그리고 QUIC"
description: "🙋‍♀️ 우아한테크코스의 크루들이 진행하는 10분 테크토크입니다. 🙋‍♂️'10분 테코톡'이란  우아한테크코스 과정을 진행하며 크루(수강생)들이 동료들과 학습한 내용을 공유하고 이야기하는 시간입니다. 서로가 성장하기 위해 지식을 나누고 대화하며 생각해보는 시간으로 자기 주도적인..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/dc4e66d7/img/favicon_32x32.png
image: https://i.ytimg.com/vi/xcrjamphIp4/maxresdefault.jpg
```
