---
tags:
  - Network
---
[[TCP]] 세그먼트의 체크섬 필드는 데이터가 훼손됐는지만 표현하기에 데이터의 유실과 같은 오류를 제어할 수 없다.  
그리고 오류를 발견했더라도 해당 세그먼트를 재전송하는 과정도 필요하다.  

## 대표적인 사례

대표적으로 아래 2가지 상황에서 재전송이 발생한다.  

### 중복된 ACK 세그먼트를 수신했을 때

수신 측에서 중복된 ACK 세그먼트를 요청했다면 해당 ACK 세그먼트를 받지 못하였다고 판단하여 재전송이 발생한다.  

### 타임아웃이 발생했을 때 

호스트가 세그먼트를 전송할 때마다 **재전송 타이머**가 시작된다.  
타임아웃이 발생할 때까지 ACK 세그먼트를 받지 못하면 재전송이 발생한다.  

> 재전송 타이머가 만료되기 전이라도 **세번의 동일한 ACK 세그먼트를 받았다면 곧바로 재전송**한다.  
> 이를 **빠른 재전송**이라고 부르며 빠른 재전송을 통해 타이머가 끝날 때까지 기다리는 시간을 줄일 수 있다.   
> 오늘날의 TCP에서는 대부분 해당 기능이 켜져있다.  

## ARQ

ARQ(Automatic Repeat Request, 자동 재전송 요구)는 수신 **호스트의 답변**과 **타임아웃**을 토대로 문제를 진단하고,  
문제가 생긴 메세지를 재전송함으로써 TCP의 신뢰성을 확보하는 오류 제어 방식입니다.  

ARQ의 대표적인 방식은 아래와 같다.  

1. Stop and Wait ARQ
2. Go-Back-N ARQ
3. Selective Repeat ARQ

### Stop and Wait ARQ

송신 측이 패킷 1개를 보내고 수신 측의 `ACK`를 기다린 뒤 다음 패킷을 보내는 방식입니다.

- 장점: 단순성, 높은 신뢰성 보장
- 단점: 네트워크의 이용 효율이 낮으며 성능이 저하

> **파이프라이닝**을 사용한다면 각 세그먼트에 대한 ACK 세그먼트가 도착하기 전이라도  
> 여러 세그먼트를 보낼 수 있게 만들어 위 문제를 해결할 수 있다.

### Go-Back-N ARQ

여러 개의 패킷을 연속으로 보내고(파이프라이닝), 도중에 오류나 유실이 발생하면 해당 패킷부터 그 뒤에 전송된 모든 패킷을 다시 전송하는 방식이다.  

- 파이프라이닝 기반 ARQ 일종
- 여러 세그먼트 전송 중 오류가 발생하면 해당 세그먼트부터 전부 재전송

### Selective Repeat ARQ

여러 개의 패킷을 연속으로 전송하다가, **오류가 발생한 특정 패킷만 골라서 재전송**하는 방식이다.

- 네트워크 자원을 가장 효율적으로 사용
- 수신 측에 별도의 버퍼 필요하고 순서를 재조립해야 하기에 구현 복잡성이 높다

> Go-Back-N ARQ의 세그먼트가 누적 확인 응답이라면, Selective Repeat ARQ의 세그먼트는 개별 확인 응답이다.  

## 출처 및 참고자료

```cardlink
url: https://benlee73.tistory.com/186
title: "TCP 의 흐름 제어 / 오류 제어 / 혼잡 제어"
description: "TCP는 크게 3가지 제어 기능이 있다. 전송되는 데이터의 양을 조절하는 흐름 제어 데이터가 유실되거나 잘못된 데이터가 수신되었을 경우 대처하는 방법인 오류 제어 네트워크 혼잡에 대처하는 혼잡 제어 이 기능들 덕분에 예외 상황에 크게 신경쓰지 않고 상위 레이어 동작에 집중할 수 있다. 흐름 제어 송신 측과 수신 측의 데이터 처리 속도가 다를 수 있다. 송신 측이 빠를 때 수신 측 버퍼가 넘치는 오버플로우 문제가 발생한다. 이러한 문제를 줄이기 위해 윈도우 크기로 송신 측의 데이터 전송량을 조절한다. 윈도우 크기 : 자신이 처리할 수 있는 데이터의 양 stop and wait 상대방에게 데이터를 보낸 후 잘 받았다는 응답이 올 때까지 기다리는 방식 sliding winodw 송신 측이 수신 측에서 받은 윈.."
host: benlee73.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FU95D6%2FbtrgCEg591n%2FAAAAAAAAAAAAAAAAAAAAALS0-M34FDKMAGW5_YOtmXfxWPCsQ-49U0zaYnnZJtUv%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DH5R5xfP8QyNmCccENS4XOYreBD8%253D
```
