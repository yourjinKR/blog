---
tags:
  - Network
aliases:
  - TCP 연결
---
데이터를 발송하는 애플리케이션, 수신하는 애플리케이션 모두 준비가 됐다는 것을 보장하기 위해 [[TCP]] 연결을 생성할때는 3-way 핸드쉐이크를 사용한다.  

> [!INFO]
> 물리적인 전용선 연결 없이 상호 통신을 기반으로 논리적 연결이기에 가상 연결이라고 표현

1. **SYN:** 클라이언트가 서버에게 SYN(synchronize) 플래그가 설정된 메시지를 보냅니다. 이때 SYN은 클라이언트의 임의 시퀀스 번호 A를 포함합니다.
2. **SYN-ACK:** 서버는 클라이언트의 SYN에 응답하여 SYN-ACK 메시지를 보냅니다. 서버는 자신만의 새로운 시퀀스 번호 B를 포함한 SYN을 전송하고, 클라이언트의 시퀀스 번호 A에 1을 더한 ACK(acknowledgment)를 함께 보냅니다(A+1).
3. **ACK:** 클라이언트는 서버로부터 받은 SYN에 대해 ACK 메시지를 전송합니다. 이때 ACK는 서버의 시퀀스 번호 B에 1을 더한 값(B+1)을 포함합니다.

![[IMG-20260916232338927.png]]

> [!EXAMPLE]
> - 야! 너 받을 준비 됐어? (SYN)
> - 응, 준비됐어! 너도? (ACK + SYN)
> - 응 준비됐어! (ACK)

%%%%
## 출처 및 참고자료

```cardlink
url: https://docs.tosspayments.com/resources/glossary/tcp#tcp-%EC%84%B8%EA%B7%B8%EB%A8%BC%ED%8A%B8
title: "TCP(Transmission Control Protocol) | 토스페이먼츠 개발자센터"
description: "TCP(Transmission Control Protocol)는 애플리케이션 사이에서 안전하게 데이터를 통신하는 규약이에요."
host: docs.tosspayments.com
favicon: https://static.toss.im/tds/favicon/favicon-16x16.png
image: https://docs.tosspayments.com/api/open-graph/image?pathname=/resources/glossary/tcp
```
