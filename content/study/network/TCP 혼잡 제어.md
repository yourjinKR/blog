---
tags:
  - Network
---
**송신 호스트**가 **혼잡**한 정도에 맞춰 유동적으로 전송량을 조절하는 기능이다.  
송신 호스트는 혼잡 윈도우를 혼잡 제어 알고리즘을 통해 혼잡 윈도우 크기를 설정해야 한다.  

> **혼잡**: 많은 트래픽으로 인해 패킷의 처리 속도가 늦어지거나 유실될 수 있는 네트워크 상황  
> **혼잡 윈도우**: 혼잡 없이 전송할 수 있는 데이터의 양

%%%%
## AMID (Additive Increase / Multiplicative Decrease)

가장 기본적인 혼잡 제어 알고리즘이다.  

- 처음에 패킷을 하나씩 보내고 문제가 발생하지 않으면 혼잡 윈도우 사이즈를 [[RTT]]마다 1씩 증가
- 패킷 전송에 실패하거나 일정 시간을 넘으면 패킷 전송 속도를 절반으로 감소
- 네트워크에 늦게 들어온 호스트가 처음에는 불리하지만, 시간이 흐르면서 평형상태로 수렴한다.
- 단점으로 처음에 전송 속도를 올리는 데 시간이 오래걸리고 네트워크가 혼잡해지는 상황을 미리 감지하지 못한다.

![[IMG-20260915222623794.png]]

### Slow Start

- 혼잡 윈도우 사이즈를 1부터 시작하여 문제 없이 수신된 ACK 세그먼트 하나당 1씩 증가
- RTT마다 2배씩 지수적으로 증가 (초기 전송 속도를 빠르게 확보)
- **느린 시작 임계치**까지 윈도우 값을 증가

#### 느린 시작 임계치

| 상황 분류              | 방법                                                                            |
| ------------------ | ----------------------------------------------------------------------------- |
| 타임아웃 발생            | 혼잡 윈도우 값을 1로 설정, 느린 시작 임계치를 혼잡이 감지되었을 시점의 혼잡 윈도우 값의 절반으로 초기화한 뒤 **느린 시작**을 재개 |
| 혼잡 윈도우 ≥ 느린 시작 임계치 | 느린 시작 종료, **혼잡 회피 알고리즘** 수행                                                   |
| 세번의 중복 ACK 발생      | 빠른 재전송 후 **빠른 회복 알고리즘** 수행                                                    |

### 혼잡 회피 알고리즘

- 혼잡 윈도우가 느린 시작 임계치를 넘어서면 발생 
- 혼잡 여지가 있으니 혼잡 윈도우를 RTT마다 1 MSS 씩 증가시키는 알고리즘이다.  

![[IMG-20260915222312953.png|328]]

### 빠른 회복 알고리즘

- 3번의 중복된 ACK 세그먼트 수신시 동작
- 빠른 전송률 회복을 위해 느린 시작은 건너뛰고 혼잡 회피를 수행하는 알고리즘이다.  
- 단, 빠른 회복 도중에 타임아웃이 발생하면 다시 느린 시작을 수행한다.  



## 출처 및 참고자료

```cardlink
url: https://gyoogle.dev/blog/computer-science/network/%ED%9D%90%EB%A6%84%EC%A0%9C%EC%96%B4%20&%20%ED%98%BC%EC%9E%A1%EC%A0%9C%EC%96%B4.html
title: "TCP/IP (흐름제어/혼잡제어) | 👨🏻‍💻 Tech Interview"
description: "Ready for Tech-Interview"
host: gyoogle.dev
favicon: https://gyoogle.dev/blog/images/logo.png
```

```cardlink
url: https://evan-moon.github.io/2019/11/26/tcp-congestion-control/
title: "사이 좋게 네트워크를 나눠 쓰는 방법, TCP의 혼잡 제어"
description: "혼잡 제어란, 말 그대로 네트워크의 혼잡 상태를 파악하고 그 상태를 해결하기 위해 데이터 전송을 제어하는 것을 이야기한다. 네트워크는 워낙 광대한 블랙박스이기 때문에 정확히 어디서 어떤 이유로 전송이 느려지는지는 파악하기 힘들지만, 단순히 “느려지고있다”라는 상황 정도는 각 종단에서도 충분히 파악할 수 있다. 그냥 데이터를 보냈는데 상대방으로부터 응답이 늦게 오거나 안오면 뭔가 문제가 있다는 것이니 말이다."
host: evan-moon.github.io
favicon: https://evan-moon.github.io/favicon-32x32.png?v=ca2900ba22e6cb371f21c7ebc3be0a4c
image: https://evan-moon.github.io/static/45252c4560c0c973b1e5157d6a3c19ce/d803c/thumbnail.png
```

```cardlink
url: https://www.youtube.com/watch?v=zEZbCULOQdY
title: "[네트워크 기초 강의] 32강. TCP의 오류·흐름·혼잡 제어"
description: "본 강의는 『혼자 공부하는 네트워크』를 바탕으로 제작하였습니다. 👨‍🏫주요 강의 내용Ch 04. 전송 계층04-3 TCP의 오류·흐름·혼잡 제어00:23 TCP의 오류·흐름·혼잡 제어01:19 재전송 기반 오류 제어12:35 흐름 제어-----✅어떤 내용을 다루고 있나요?• 거..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/3a93864d/img/favicon_32x32.png
image: https://i.ytimg.com/vi/zEZbCULOQdY/maxresdefault.jpg
```
