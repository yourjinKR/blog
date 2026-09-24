
현대의 TCP는 파이프라이닝 방식을 통해 여러 세그먼트를 동시에 송신한다.  
그 과정에서 수신 호스트가 한번에 얼마나 받아 처리할 수 있는지 고려해야 한다.  

> [[TCP 오류 제어#Stop and Wait ARQ|Stop and Wait ARQ]]를 사용한다면 별도의 흐름 제어는 필요하지 않다.  

### Stop and Wait

매번 전송한 패킷에 대해 확인 응답을 받아야만 그 다음 패킷을 전송하는 기법이다.  

### Sliding Window

> 오늘날의 TCP에서 주로 사용하는 기능

- 수신 측이 한 번에 처리할 수 있는 데이터의 양(**윈도우 크기)을 3 way handshake할 때 송신 측에 전달**한다.
- 상대방에게 **응답을 받지 않아도 범위 내에서 데이터를 보낼 수 있다.**
- 패킷의 왕복 시간(RTT)이 크다면 **네트워크가 혼잡하다고 생각하여 윈도우 크기를 실제 버퍼의 크기보다 작게 설정**한다.
- 통신 과정 중에도 네트워크 혼잡 등의 조건을 통해 **윈도우 크기는 유동적으로 설정**된다.

> [!NOTE] **윈도우**
> 송신 호스트가 파이프라이닝 할 수 있는 최대량을 의미한다.  

## 출처 및 참고자료

```cardlink
url: https://benlee73.tistory.com/186
title: "TCP 의 흐름 제어 / 오류 제어 / 혼잡 제어"
description: "TCP는 크게 3가지 제어 기능이 있다. 전송되는 데이터의 양을 조절하는 흐름 제어 데이터가 유실되거나 잘못된 데이터가 수신되었을 경우 대처하는 방법인 오류 제어 네트워크 혼잡에 대처하는 혼잡 제어 이 기능들 덕분에 예외 상황에 크게 신경쓰지 않고 상위 레이어 동작에 집중할 수 있다. 흐름 제어 송신 측과 수신 측의 데이터 처리 속도가 다를 수 있다. 송신 측이 빠를 때 수신 측 버퍼가 넘치는 오버플로우 문제가 발생한다. 이러한 문제를 줄이기 위해 윈도우 크기로 송신 측의 데이터 전송량을 조절한다. 윈도우 크기 : 자신이 처리할 수 있는 데이터의 양 stop and wait 상대방에게 데이터를 보낸 후 잘 받았다는 응답이 올 때까지 기다리는 방식 sliding winodw 송신 측이 수신 측에서 받은 윈.."
host: benlee73.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FU95D6%2FbtrgCEg591n%2FAAAAAAAAAAAAAAAAAAAAALS0-M34FDKMAGW5_YOtmXfxWPCsQ-49U0zaYnnZJtUv%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DH5R5xfP8QyNmCccENS4XOYreBD8%253D
```
