---
tags:
  - Network
aliases:
  - HTTP 2.0
---
- 구글의 SPDY를 기반으로 기존 HTTP/1.1보다 성능 향상에 초점을 맞춘 프로토콜
- 텍스트 방식의 프로토콜 메시지 대신 이진 포맷을 사용하면서 프로토콜 경량화 시도
- 텍스트 방식인 HTTP/1.1의 헤더와 페이로드가 HTTP/2부터 이진 형태의 Frame으로 추상화되는 과정
- [[Multiplexing|멀티플렉싱]], [[Stream Prioritization|스트림 우선순위]], [[#헤더 압축]], [[#서버 푸시]] 같은 새로운 프로토콜 최적화 기능 추가
- HTTP/2는 HTTP 레벨의 HOL Blocking 문제를 해결 (TCP 레벨의 HOL Blocking 문제는 해결하지 못함)

## Binary Framing Layer

HTTP/2의 모든 성능 향상의 핵심은 클라이언트와 서버간에 메시지를 캡슐화하고 전송하는 방식을 지정하는 새로운 Binary Framing Layer 계층이다.

- 소켓 인터페이스와 애플리케이션에  노출되는 HTTP API 사이에 최적화된 인코딩 매커니즘 적용
- HTTP/2.0에선 1.1에서의 text로 전송되던 것과 달리 binary frame으로 인코딩되어 전송
- 데이터 파싱 및 전송 속도가 증가하였으며, 오류 발생 가능성 감소

![[IMG-20260916220633334.png]]

## HTTP 2.0의 전송 방식

- 기존 HTTP 메시지를 Binary로 구성된 여러 개의 Frame으로 분해
- 각 Frame을 특정 Stream에 매핑되어 전송
- 모든 Stream은 단일 TCP Connection 내에서 다중화되어 병렬처리 

HTTP/2.0은 HTTP 요청/응답 (메시지)을 여러 개의 Frame로 나누고 인코딩하여 데이터를 주고받는다.
그리고 요청/응답 메세지는 특정 Stream에 속하며, 여러 개의 Stream은 하나의 Connection에 속하는 구조이다.

![[IMG-20260916221432842.png]]

### Stream

Stream이란 연결된 Connection 내에서 하나 이상의 메시지를 양뱡향으로 주고 받는 양방향 바이트 흐름이다.  

- 한개의 스트림이 한쌍의 요청과 응답을 처리
- 서버와 클라이언트는 스트림을 상대방과 협상 없이 일방적으로 생성

> [!NOTE] Stream 생성시 협상 과정이 없는 이유
> 스트림을 생성하기 위한 별도의 Handshake 과정은 없다.  
> 새로운 Stream Identifier를 가진 HEADERS 프레임을 전송하면 해당 스트림이 생성된다.

- 한번 사용된 스트림은 재사용 불가능
- 스트림 정보는 이진 데이터 기반 Frame에 `Stream Identifier`에 정의

> [!INFO] Stream Identifier
> 클라이언트에 의해 초기화시 홀수, 서버에 의해 초기화시 짝수로 지정한다.  
> 0번은 연결 제어 메세지를 위해 예약된 지정자이기에 새 스트림에서 해당 식별자는 사용할 수 없다.  

### Message

Message는 HTTP/1.1와 마찬가지로 하나의 요청과 응답을 구성하는 단위이며 다수의 Frame으로 이루어져 있다.  

### Frame

HTTP/2에서 통신에 사용되는 최소 단위이다.

HTTP 메시지는 HTTP/1.1처럼 단순한 텍스트 형태로 전송되는 것이 아니라 HEADERS, DATA 등의 이진 Frame으로 표현되어 전송된다. 각 Frame의 헤더에는 `Stream Identifier`가 포함되어 있어 어떤 Stream에 속하는 Frame인지 구분할 수 있다.

## Server Push

HTTP/2.0에선 [[Multiplexing]]외에도 클라이언트의 요청에 대해 미래에 필요할 것 같은 리소스를 미리 클라이언트에 보낼 수 있다.

예를 들어, 클라이언트가 HTML을 요청했을 때, 서버는 해당 HTML 문서가 링크하고있는 이미지, CSS파일, JS 파일등의 리소스를 스스로 파악하여 클라이언트에 미리 push해서 브라우저 캐시에 가져다놓는 것이다.

서버는 클라이언트가 직접적으로 요청하지않은 리소스를 미리 꺼내서 가까운 미래에 특정 개체가 필요할 때 바로 사용될 수 있도록 성능 향상을 이끌어내는 것이다.

## 헤더 압축

- 이전 Message의 헤더 내용 중 중복되는 필드를 재전송하지 않음
- 중복 헤더는 Static / Dynamic Header Table 개념을 사용하여 중복 헤더를 검출
- 호프만 인코딩을 사용


## 출처 및 참고자료  

```cardlink
url: https://hpbn.co/http2/
title: "HTTP: HTTP/2 - High Performance Browser Networking (O'Reilly)"
description: "What every web developer must know about mobile networks, protocols, and APIs provided by browser to deliver the best user experience."
host: hpbn.co
favicon: https://hpbn.co/assets/icons/icon-192.png
```

```cardlink
url: https://mark-kim.blog/HTTP2_0/
title: "HTTP 진화과정 이해하기 두번째 - HTTP/2.0"
description: "HTTP/1.1에서 HTTP/2.0으로 발전하게되는 과정을 통해 HTTP/2.0를 정리해본다."
host: mark-kim.blog
image: https://mark-kim.blog/static/8c977b4b703a8bd675244af4d5b81f7e/thumbnail.png
```

