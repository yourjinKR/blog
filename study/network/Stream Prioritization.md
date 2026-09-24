---
tags:
  - Network
  - HTTP
aliases:
  - 스트림 우선순위
---
HTTP/2.0에선 HTTP 메세지를 여러 Binary Frame으로 분할하고, 여러 Frame을 멀티플렉싱 할 수 있게되면서 요청과 응답이 동시에 병렬적으로 이루어져 비약적인 속도 향상이 되었다.

하지만 하나의 TCP Connection에 여러 요청과 응답이 뒤섞이면서 Stream의 우선순위를 지정할 필요가 생기게되었다.

이로인해 HTTP/2.0 표준엔 각 Stream에 우선순위 관련된 가중치와 의존성을 추가했다.

- 각 Stream에는 1부터 256사이의 가중치가 할당될 수 있다.
- 각 Stream에는 다른 Stream에 대한 명시적인 의존성이 부여될 수 있다.