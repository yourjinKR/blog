---
tags:
  - Network
aliases:
  - Transport Layer Security
---
TLS는 네트워크에서 데이터를 안전하게 주고받기 위한 암호화 프로토콜이다.  

## TLS Handshake

TLS 암호화를 사용하는 통신 세션을 실행하는 프로세스이다. TLS 핸드셰이크 중에, 통신하는 양측에서는 메시지를 교환하여 서로를 인식하고 서로를 검증하며 사용할 암호화 알고리즘을 구성하고 세션 키에 합의한다.  

TLS 핸드셰이크 과정 중은 다음과 같이 요약할 수 있다.  

- 클라이언트는 SSL/TLS 버전, 지원하는 [[Cipher Suite]] 목록, 기타 정보 전달
- 서버는 SSL/TLS 버전, 선택한 [[Cipher Suite]], [[CA]], 기타 정보 전달
- 서버의 공개 키와 SSL 인증서 기관의 [[CA]]을 통해 서버 ID를 인증한다.  
- 핸드셰이크가 완료된 후에 대칭 암호화를 사용하기 위해 세션 키를 생성합니다.  

### 동작 과정

1. **'클라이언트 헬로' 메시지:** 클라이언트가 서버로 "헬로" 메시지를 전송하면서 핸드셰이크를 개시합니다. 이 메시지에는 클라이언트가 지원하는 TLS 버전, 지원되는 암호 제품군, 그리고 "클라이언트 무작위"라고 하는 무작위 바이트 문자열이 포함됩니다.
2. **'서버 헬로' 메시지:** 클라이언트 헬로 메시지에 대한 응답으로 서버가 서버의 [SSL 인증서](https://www.cloudflare.com/learning/ssl/what-is-an-ssl-certificate/), 서버에서 선택한 암호 제품군, 그리고 서버에서 생성한 또 다른 무작위 바이트 문자열인 "서버 무작위"를 포함하는 메시지를 전송합니다.
3. **인증:** 클라이언트가 서버의 SSL 인증서를 인증서 발행 기관을 통해 검증합니다. 이를 통해 서버가 인증서에 명시된 서버인지, 그리고 클라이언트가 상호작용 중인 서버가 실제 해당 도메인의 소유자인지를 확인합니다.
4. **예비 마스터 암호:** 클라이언트가 "예비 마스터 암호"라고 하는 무작위 바이트 문자열을 하나 더 전송합니다. 예비 마스터 암호는 공개 키로 암호화되어 있으며, 서버가 개인 키로만 해독할 수 있습니다. (클라이언트는 서버의 SSL 인증서를 통해 [공개 키](https://www.cloudflare.com/learning/ssl/how-does-public-key-encryption-work/)를 받습니다.)
5. **개인 키 사용:** 서버가 예비 마스터 암호를 해독합니다.
6. **세션 키 생성:** 클라이언트와 서버가 모두 클라이언트 무작위, 서버 무작위, 예비 마스터 암호를 이용해 세션 키를 생성합니다. 모두 같은 결과가 나와야 합니다.
7. **클라이언트 준비 완료:** 클라이언트가 세션 키로 암호화된 "완료" 메시지를 전송합니다.
8. **서버 준비 완료:** 서버가 세션 키로 암호화된 "완료" 메시지를 전송합니다.
9. **안전한 대칭 암호화 성공:** 핸드셰이크가 완료되고, 세션 키를 이용해 통신이 계속 진행됩니다.


## 출처 및 참고자료

```cardlink
url: https://docs.tosspayments.com/resources/glossary/tls
title: "TLS(Transport Layer Security) | 토스페이먼츠 개발자센터"
description: "TLS(Transport Layer Security)는 온라인 네트워크에서 데이터를 안전하게 주고받기 위한 암호화 프로토콜이에요."
host: docs.tosspayments.com
favicon: https://static.toss.im/tds/favicon/favicon-16x16.png
image: https://docs.tosspayments.com/api/open-graph/image?pathname=/resources/glossary/tls
```

```cardlink
url: https://www.cloudflare.com/ko-kr/learning/ssl/what-happens-in-a-tls-handshake/
title: "TLS 핸드셰이크란? | 세션키 교환"
description: "TLS 핸드셰이크로 안전한 연결과 세션 키를 생성합니다. 자세히 알아보세요."
host: www.cloudflare.com
image: https://cf-assets.www.cloudflare.com/slt3lc6tev37/53qCYhQbir5WtIU0VDWESo/954a48bfb17f429acf469e5f14345d83/unnamed-3.png
```