---
title: SSE 구현 방식에 대해
---
# SSE란?

- 서버에서 클라이언트에게 실시간으로 데이터를 전송하는 기술

![[Pasted image 20260605042254.png|525]]

## 동작원리

### 1. 클라이언트는 서버와의 연결을 요청한다

- mediaType은 text/event-stream으로 보낸다.

### 2. 서버는 연결을 받는다

- Transfer-Encoding 방식을 [[chunked-encoding|chunked]]로 한다.
- 응답 패킷의 해더에는 Content-Length가 존재하지 않는다.

> [!NOTE]
> 청크 인코딩이란, HTTP 응답을 한번에 다 만들고 보내는 방식이 아니라, 작은 조각 단위로 나누어 계속 보내는 방식

> [!TIP]
> SSE에서 청크 인코딩을 수행하는 이유는, chunked는 데이터의 사이즈를 계산하는 과정을 거치지 않기 때문에 큰 데이터를 응답할때 효과적이다. 서버에서는 요청에 대해 응답을 계산할때 시간이 소요된다. Chunked를 통해 이와 같은 과정을 생략하는 것이다.

https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Headers/Transfer-Encoding  
https://en.wikipedia.org/wiki/Chunked_transfer_encoding  

### 3. 비동기적으로 클라이언트에게 이벤트를 전송

- 데이터는 utf-8로 인코딩된 텍스트 데이터만 가능
- 각 이벤트는 한 개 이상의 name:value로 이루어져 있다.

![[Pasted image 20260605042336.png|550]]

## 이벤트 스트림 형식

WHATWG HTML Standard의 **Server-sent events** 섹션에 정의된 `text/event-stream` 형식

- event
- data
- id
- retry

[자세히](https://developer.mozilla.org/ko/docs/Web/API/Server-sent_events/Using_server-sent_events#%EC%9D%B4%EB%B2%A4%ED%8A%B8_%EC%8A%A4%ED%8A%B8%EB%A6%BC_%ED%98%95%EC%8B%9D)

## 웹소켓과 다른점

|              | Socket                       | Server-Sent-Event                                |
| ------------ | ---------------------------- | ------------------------------------------------ |
| 브라우저 지원      | 대부분 브라우저에서 지원                | 대부분 모던 브라우저 지원(polyfills 가능)                     |
| 통신 방향        | 양방향                          | 일방향(서버에서 클라이언트로)                                 |
| 리얼타임         | Yes                          | Yes                                              |
| 데이터 형태       | Binary, UTF-8                | UTF-8                                            |
| 자동 재접속       | No                           | Yes(3초마다 제시도)                                    |
| 최대 동시 접속 수   | 브라우저 연결 한도는 없지만 서버 셋업에 따라 다름 | HTTP를 통해서 할 때는 브라우저당 6개 까지 가능 / HTTP2로는 100개가 기본 |
| 프로토콜         | websocket                    | HTTP                                             |
| 베터리 소모량      | 큼                            | 작음                                               |
| Firewall 친화적 | Nope                         | Yes                                              |
## 장단점

### 장점

1. HTTP를 통해 통신하므로 다른 프로토콜은 필요가 없고, 구현이 굉장히 쉽다는 것이다.  
2. 네트워크 연결이 끊겼을 때 자동으로 재연결을 시도한다.  
3. 실시간으로 서버에서 클라이언트로 데이터를 전송할 수 있다. 폴링 같은 경우는 실시간이라고 보기 어려운 점이 있는데, 이러한 한계를 극복한다.

### 단점

1. GET 메소드만 지원하고, 파라미터를 보내는데 한계가 있다.  
2. 단방향 통신이며, 한 번 보내면 취소가 불가능하다는 단점이 있다.  
3. 클라이언트가 페이지를 닫아도 서버에서 감지하기가 어렵다는것도 단점이다.  
4. SSE는 지속적인 연결을 유지해야 하므로, 많은 클라이언트가 동시에 연결을 유지할 경우 서버 부담이 커질 수 있다.


# EventSource

- HTML5 웹 표준에 정의
- SSE를 구현할 때 브라우저에서 기본적으로 제공하는 `EventSource` 인스턴스를 주로 활용한다.  

```js
const source = new EventSource("/api/v1/realtime/event");
```

## 우리는 EventSource를 사용하지 못할까?

현재 프로젝트는 Authorization Header를 통해 인증을 수행한다.  

그러나 브라우저에서 기본적으로 제공하는 `EventSource`에는 Header를 추가하지 못한다.  

```js
new EventSource("/api/v1/realtime/events");
// Authorization: Bearer ... 설정 불가능
```

그렇기에 `fetch`로 직접 구현해야 한다.  

## fetch로 직접 구현시

`EventSource`를 사용하지 못하면서 기본적으로 제공하는 기능들을 전부 직접 구현해야 한다.  

- SSE frame 파싱
- 연결 종료 감지
- 재연결 및 backoff
- 요청 취소를 위한 AbortController
- heartbeat와 일반 이벤트 구분
- Last-Event-ID 처리

## 대안

- `event-source-polyfill` 라이브러리를 사용하여 수동으로 담기 ([참고자료](https://velog.io/@ongsim123/Devlog-SSE%EB%A1%9C%EC%A7%81-%EA%B5%AC%ED%98%84-%EC%A4%91-EventSource%EC%97%90-headers%EB%8B%B4%EA%B8%B0))
- 마이크로 소프트에서 사용 중인 라이브러리 ([참고자료](https://www.npmjs.com/package/@microsoft/fetch-event-source))