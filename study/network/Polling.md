---
date: 2026-11-19
tags:
  - Network
  - HTTP
---
**폴링**이란 하나의 장치가 충돌 회피 또는 동기화 처리 등을 목적으로 다른 장치의 상태를 주기적으로 검사하여 일정한 조건을 만족할 때 송수신 등의 자료처리를 하는 방식을 말한다.

## 등장배경

HTTP는 기본적으로 [[HTTP#비연결성|비연결성]]을 가진 프로토콜이다. 그렇기에 **실시간성이 요구되는 서비스**와 같은 기능을 구현하는데 제약이 있다. 이를 해결하기 위한 방법 중 하나가 Polling이다. Polling은 클라이언트가 일정 주기마다 서버에게 반복적으로 요청을 보내어 마치 실시간성을 흉내내는 기술이다.  

## 동작원리

1. **클라이언트**는 일정 주기마다 서버에 HTTP 요청을 보낸다.
2. **서버**는 새로운 데이터가 있다면 응답 본문에 전달한다.
3. 데이터가 없다면 `204 No Content`와 같은 상태 코드를 반환한다.
4. 클라이언트는 일정 시간 대기 후 다시 요청을 반복한다.

## 폴링의 장단점

실시간성 기능을 구현하는 방식들 중 가장 직관적이고 단순하다.  
폴링은 기본적으로 서버에게 지속적으로 요청을 보내기에 서버에 부하가 발생할 수 있다.  
또한 클라이언트와 서버간 아무런 상태 변화가 없음에도 불구하고 Polling을 계속 보내는 것은 다소 비효율적일 것이다.  
부하를 줄이기 위해 Long Polling을 고려할 수 있지만 이는 정밀한 실시간성이 요구되는 서비스에는 부적절할 것이다.  

### 장점

- 구현이 단순하다
- 특별한 프로토콜이나 라이브러리 없이 HTTP로 가능하다
- 빠르게 테스트하거나 프로토타입을 만들 때 유용하다

### 단점

- **비효율적**: 데이터가 없어도 주기적으로 요청을 발생
- **네트워크 비용 증가**: 불필요한 요청이 많음
- **실시간성 한계**: 요청 주기에 따라 지연 발생
- **서버 부하**: 클라이언트 수가 많으면 서버에 부담

## Long Polling

서버 측에서 접속을 열어두는 시간을 길게하는 방식의 Polling이다.  

- 클라이언트가 서버로 요청를 보냄
- 지정된 시간동안 보낼 데이터가 생긴다면 서버는 즉시 클라이언트에게 응답을 보냄
- 만약 제한 시간동안 보낼 데이터가 없다면 그 사실을 알리는 응답을 보냄
- 클라이언트는 서버에게 응답을 받은 후 즉시 새로운 요청을 다시 보냄

Long Polling 방식은 주기적으로 요청을 보내는 기존의 Polling 방식에 비해 서버 부하를 줄일 수 있다.  
그러나 그 만큼 실시간성이 저하되기에 사용 시 해당 서비스의 특성을 고려하고 사용할 필요가 있다.  

## 폴링에 대한 오해 – 폴링은 무조건 지양한다?

폴링이 왜 비효울적인가 라는 질문을 듣는다면 자연스럽게 이렇게 답할것이다.  

> _지속적으로 질의하는건 비효율적입니다._

그렇다면 폴링은 나쁜 기술이며 무조건 지양해야되는가?  
실시간 서비스라면 무조건  [[WebSocket]]을 활용하는 것이 적절한가?

대용량 환경에서는 WebSocket의 [[WebSocket#연결 유지 비용|연결 유지 비용]]이 오히려 Polling의 반복 Request보다 더 비쌀 수 있다.  

여러 제약조건을 비교해본다면 Polling도 충분히 좋은 선택지가 될 수 있다.  
더 나아가 Long Polling, Adaptive Polling을 목적에 맞게 활용한다면 폴링의 반복 질의로 인한 부하도 줄일 수 있다. 

> [!INFO] Adaptive Polling
> 시스템 상태에 따라 요청 시점과 요청량을 조정하는 폴링 방식을 말한다.  
> 예약 시스템과 같은 경우에는 예약 순번이 낮아질수록 호출 주기를 짧게 두는 것이 대표적인 예시이다.  

```cardlink
url: https://www.youtube.com/watch?v=c6infBpWiIE
title: "엄청난 폴링 횟수. 과연 웹소켓에 비해 유리한가?"
description: "#개발자 #프로그래밍 #아키텍트대규모 트래픽 환경에서 폴링에 대한 서버부하 우려를 많이 하십니다. 한번 연결하면 계속 연결을 유지 한채로 필요시 서버에서 값을 전달하는 웹소켓이 더 유리하지 않느냐 하는 의견도 많습니다. 이 영상에서는 왜 폴링을 사용하는지 설명합니다.'아키텍트 인사..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/444d69ff/img/favicon_32x32.png
image: https://i.ytimg.com/vi/c6infBpWiIE/maxresdefault.jpg
```

## 출처 및 참고자료

```cardlink
url: https://ko.wikipedia.org/wiki/%ED%8F%B4%EB%A7%81_(%EC%BB%B4%ED%93%A8%ED%84%B0_%EA%B3%BC%ED%95%99)
title: "폴링 (컴퓨터 과학) - 위키백과, 우리 모두의 백과사전"
host: ko.wikipedia.org
favicon: https://ko.wikipedia.org/static/favicon/wikipedia.ico
```

```cardlink
url: https://www.yolog.co.kr/post/http-polling
title: "HTTP 통신 기법 - 폴링(Polling) 이해와 구현 | 개발자 매튜"
description: "폴링(Polling)이란 무엇이며 실시간 데이터 갱신에 어떻게 사용할까? HTTP 폴링의 요청 흐름, 서버·클라이언트 구현, 요청 주기와 부하, 장단점을 코드와 비유로 설명한다."
host: www.yolog.co.kr
favicon: https://www.yolog.co.kr/favicon.ico
image: https://www.yolog.co.kr/_astro/thumbnail.HnHankYf_1mhumS.webp
```

https://nhimg.org/glossary/adaptive-polling/
