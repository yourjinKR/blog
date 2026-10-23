---
date: 2026-09-24
title: URL
tags:
  - Network
  - Web
---
# URL (Uniform Resource Locator)

네트워크상에서 **통합 자원(리소스)의 위치**를 나타내기 위한 규약이다.

>특정 웹사이트의 주소에 접속하기 위해서는 웹사이트 뿐만 아니라 [[protocol|프로토콜]]을 함께 알아야 접속이 가능하기 때문이다.  

> [!EXAMPLE]
> https://www.matchuri.com

## 구성

![[Pasted image 20260709023236.png]]  
- **Schema**: 리소스를 요청하기 위해 사용하는 프로토콜을 나타낸다.
- **Authority**: 사용자 정보·호스트명·포트 번호
	- **Domain Name**: 요청하는 웹 서버를 나타낸다.  
	- **Port**:  웹 서버의 리소스에 접근하는 데 사용되는 기술적인 게이트를 나타낸다.  
- **Path**: 리소스가 있는 경로를 의미한다.  
- **Parameter**: key-value 형태로 웹서버에게 제공되는 추가 매개변수이다.
	- `?`로 시작
	- `&`로 추가
- **Achor**: 리소스 자체의 어떤 부분에 대한 앵커이다.

## 출처 및 참고자료

```cardlink
url: https://developer.mozilla.org/ko/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL
title: "URL이란? - Web 개발 학습하기 | MDN"
description: "이 문서에서는 URL(Uniform Resource Locator)이 무엇이며 어떻게 구성되어 있는지 설명합니다."
host: developer.mozilla.org
favicon: https://developer.mozilla.org/favicon.ico
```

```cardlink
url: https://www.elancer.co.kr/blog/detail/74
title: "URI와 URL, 어떤 차이점이 있나요? | 이랜서 블로그"
description: "uri와 url, 비슷한 듯 다른 it 용어, 어떤 차이점이 있는지 확인하기 | uri url 차이, uri 뜻, uri 란, uri url urn, uri vs url"
host: www.elancer.co.kr
favicon: https://www.elancer.co.kr/icon.ico?3088922e6fbc1871
image: https://img-svr.elancer.co.kr/dev/storage2/blog/74_mo_10.png
```
