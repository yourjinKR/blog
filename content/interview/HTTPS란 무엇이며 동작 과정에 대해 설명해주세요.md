---
tags:
  - 면접
  - 스터디
  - Network
---
[[HTTPS]]는 HTTP 메세지를 [[TLS]]로 보호해서 전송하는 방식입니다. HTTP의 구조는 유지하되 전송 전에 HTTP 메세지가 TLS로 암호화되어 네트워크에서는 평문이 아니라 암호문으로 흐릅니다. 이 과정에서 TLS는 통신 내용을 숨기는 **기밀성**, 중간 변조를 막는 **무결성**, 인증서를 통해 서버가 진짜인지 확인하는 **서버 인증**을 제공합니다. 

## 주요 꼬리질문

> [!QUESTION]- HTTPS는 어떻게 동작하나요? TLS Handshake 과정을 설명해주세요.
> 현재 SSL보다 TLS Handshake라고 부르는 것이 정확합니다.  
> 
> 먼저 클라이언트가 `ClientHello`로 지원하는 TLS 버전, [[Cipher Suite]], 랜덤값과 키 교환 정보를 보냅니다.  
> 서버는 `ServerHello`로 사용할 방식을 선택해 응답합니다.  
> 
> 이어서 서버는 `Certificate`를 보내고, 클라이언트는 브라우저나 OS가 신뢰하는 [[CA]] 체인을 기준으로 인증서의 서명과 유효성을 검증합니다. 이 단계에서 비대칭 키 기반 서명 검증으로 서버 인원을 확인합니다.  
> 
> 인증서가 유효하면 양쪽은 `ECDHE` 같은 키 교환으로 같은 공유 비밀값을 얻고, 그 값을 바탕으로 이 연결에서 사용할 **세션 키**를 만듭니다.  `Finished` 메세지로 지금까지의 핸드셰이크가 변조되지 않았는지 확인하고, 이후 HTTP 요청과 응답은 이 세션 키를 사용하는 대칭 키 암호화로 보호되어 전송됩니다.  

> [!QUESTION]- 인증서는 무엇이며, 왜 신뢰할 수 있나요?
> 인증서는 서버의 공개키와 도메인 등의 정보를 인증기관(CA)의 서명으로 연결한 것입니다. 클라이언트는 중간 인증서를 거쳐 자신이 신뢰하는 루트 CA까지 체인을 검증합니다. 인증서 유효기간과 접속 호스트명도 확인합니다. 인증서를 전달받았다는 사실만으로 신뢰하지는 않습니다.

> [!QUESTION]- 다른 서버의 정상 인증서를 복사하면 서버를 사칭할 수 있나요?
> 인증서는 공개 정보이므로 복사할 수 있지만, 인증서에 대응하는 개인키가 없으면 Handshake의 서명을 생성할 수 없습니다. 또한 다른 도메인의 인증서는 호스트명 검증에 실패합니다.

> [!QUESTION]- TLS 1.2와 TLS 1.3의 차이는 무엇인가요?
> TLS 1.3은 일반적인 전체 Handshake를 1-RTT로 줄이고, 오래된 암호 방식과 RSA 키 전송을 제거했습니다. TLS 1.2의 일반적인 전체 Handshake는 2-RTT입니다. 이는 **TCP 연결 수립 비용을 제외한 TLS 단계**의 비교입니다. TLS 1.2에서도 ECDHE를 사용할 수 있으므로 TLS 1.2 전체를 RSA 키 전송 방식으로 설명하면 안 됩니다.

> [!QUESTION]- Forward Secrecy란 무엇인가요?
> 서버의 장기 개인키가 나중에 유출되어도 과거에 수집한 통신을 복호화하기 어렵게 하는 성질입니다. 임시 (EC)DHE 키를 사용하는 연결에서는 장기 인증키와 세션 키를 분리합니다. 다만 TLS 1.3의 모든 모드가 동일한 보장을 제공하는 것은 아니며, PSK-only나 0-RTT는 별도로 봐야 합니다.

> [!QUESTION]- 세션 재개와 0-RTT는 무엇인가요?
> 세션 재개는 이전 연결에서 얻은 PSK 등의 정보를 이용해 새 TLS 연결의 인증 비용을 줄이는 방식입니다. 0-RTT는 조건이 맞으면 Handshake 완료 전에 데이터를 보내는 기능이며 재전송 공격 위험이 있습니다. 주문 생성처럼 중복 실행되면 안 되는 요청에는 별도 재실행 방지 설계 없이 적용하면 안 됩니다. 기존 연결을 계속 쓰는 [[HTTP Keep-Alive]]와는 다릅니다.

TLS 버전 차이와 보안 특성은 [RFC 8446 §1.2·§2·§8](https://www.rfc-editor.org/rfc/rfc8446.html)을 참고합니다.

> [!QUESTION]- HTTPS를 사용하면 URL과 모든 정보가 숨겨지나요?
> HTTP 경로·쿼리·헤더·본문은 TLS로 보호됩니다. 하지만 목적지 IP, 통신량 등은 관찰할 수 있고, DNS나 SNI를 통해 도메인이 드러날 수도 있습니다. 또한 TLS를 종료하는 프록시와 서버는 복호화한 내용을 볼 수 있으므로 URL에 넣은 민감 정보가 서버 로그 등에 남을 수 있습니다.

> [!QUESTION]- HTTPS만 적용하면 안전한 서비스인가요?
> HTTPS는 통신 구간을 보호합니다. SQL Injection, XSS, 잘못된 권한 검사, 서버나 DB에서의 평문 저장 문제까지 해결하지는 않습니다. 서버 인증도 로그인 사용자의 인증과는 다른 개념입니다.

> [!QUESTION]- Nginx나 로드 밸런서에서 TLS를 종료하면 Spring 서버까지 암호화되나요?
> 자동으로 암호화되지는 않습니다. `브라우저 → 프록시`와 `프록시 → Spring`은 별도의 연결이므로 각 구간의 프로토콜을 확인해야 합니다. 뒤쪽 구간도 보호하려면 TLS를 별도로 구성합니다. 전달된 원래 요청의 scheme·host를 Spring이 인식하도록 할 때는 신뢰하는 프록시가 설정한 헤더만 사용해야 합니다. [Spring의 ForwardedHeaderFilter 설명](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/filter/ForwardedHeaderFilter.html)

> [!QUESTION]- HTTP/3도 TCP 연결 후 TLS Handshake를 하나요?
> 아닙니다. [[HTTP 3]]은 UDP 위의 [[QUIC]]을 사용하며 TLS 1.3 Handshake를 QUIC 연결 수립에 통합합니다. 앞의 TCP → TLS 순서는 HTTP/1.1·HTTP/2 기준입니다. [RFC 9114](https://www.rfc-editor.org/rfc/rfc9114.html#section-2)

## 함께 복습하기

- [[대칭키와 비대칭키에 대해 설명해주세요]]
- [[HTTP 버전별 차이를 설명해주세요]]
- [[Network 기초를 Java Spring RDB에 연결]]

## 출처 및 참고자료

```cardlink
url: https://www.youtube.com/watch?v=V2HIN7P2Z40&list=PLcEVSvEsvv9Q&index=17
title: "CS 면접 대비 (네트워크편) - 5.1. HTTPS란 무엇이고, HTTP와의 차이는? ⭐️⭐️⭐️"
description: "📙 JSCODE 박재성 & 시니 📙✔️ https://linktr.ee/jscode📗 프로그래밍 무료 강의 📗✔️ https://www.youtube.com/@jscode-official/playlists"
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/dc4e66d7/img/favicon_32x32.png
image: https://i.ytimg.com/vi/V2HIN7P2Z40/maxresdefault.jpg
```
