---
date: 2026-09-24
title: REST
tags:
  - Network
  - HTTP
  - Web
aliases:
  - RESTful
---
# REST (Representational State Transfer)

분산 하이퍼미디어 시스템을 설계하기 위한 소프트웨어 아키텍처 스타일을 말한다.  
[[HTTP|HTTP]] 프로토콜을 기반으로 한 웹 서비스 설계에서 주로 사용된다.  

> [!INFO]
> 2000년 컴퓨터 과학자 로이 필딩(Roy Fielding) 박사가 자신의 박사 학위 논문에서 처음 정의한 REST는 개발자에게 비교적 높은 수준의 유연성, 일관성, 확장성, 그리고 효율성을 제공합니다. REST API는 웹 API를 구축하는 가벼운 방법을 제공하며, 애플리케이션, 웹 서비스, 데이터베이스 간의 데이터 교환을 촉진하고 마이크로서비스 아키텍처에서 구성 요소를 연결하는 데 일반적으로 사용됩니다.

%%  %%
## REST의 구성

- **자원(RESOURCE)**:  [[URI]]
- **행위(Verb)**: [[HTTP Method|HTTP 메서드]]
- **표현(Representations)**

## REST의 특징

### 1) Uniform (유니폼 인터페이스)

Uniform Interface는 [[URL]]로 지정한 리소스에 대한 조작을 통일되고 한정적인 인터페이스로 수행하는 아키텍처 스타일을 말합니다.

### 2) Stateless (무상태성)

REST는 무상태성 성격을 갖습니다. 다시 말해 작업을 위한 상태정보를 따로 저장하고 관리하지 않습니다. 세션 정보나 쿠키정보를 별도로 저장하고 관리하지 않기 때문에 API 서버는 들어오는 요청만을 단순히 처리하면 됩니다. 때문에 서비스의 자유도가 높아지고 서버에서 불필요한 정보를 관리하지 않음으로써 구현이 단순해집니다.

### 3) Cacheable (캐시 가능)

REST의 가장 큰 특징 중 하나는 HTTP라는 기존 웹표준을 그대로 사용하기 때문에, 웹에서 사용하는 기존 인프라를 그대로 활용이 가능합니다. 따라서 HTTP가 가진 캐싱 기능이 적용 가능합니다. HTTP 프로토콜 표준에서 사용하는 Last-Modified태그나 E-Tag를 이용하면 캐싱 구현이 가능합니다.

### 4) Self-descriptiveness (자체 표현 구조)

REST의 또 다른 큰 특징 중 하나는 REST API 메시지만 보고도 이를 쉽게 이해 할 수 있는 자체 표현 구조로 되어 있다는 것입니다.

### 5) Client - Server 구조

REST 서버는 API 제공, 클라이언트는 사용자 인증이나 컨텍스트(세션, 로그인 정보)등을 직접 관리하는 구조로 각각의 역할이 확실히 구분되기 때문에 클라이언트와 서버에서 개발해야 할 내용이 명확해지고 서로간 의존성이 줄어들게 됩니다.

### 6) 계층형 구조

REST 서버는 다중 계층으로 구성될 수 있으며 보안, 로드 밸런싱, 암호화 계층을 추가해 구조상의 유연성을 둘 수 있고 PROXY, 게이트웨이 같은 네트워크 기반의 중간매체를 사용할 수 있게 합니다.

# 출처

```cardlink
url: https://ko.wikipedia.org/wiki/REST
title: "REST - 위키백과, 우리 모두의 백과사전"
host: ko.wikipedia.org
favicon: https://ko.wikipedia.org/static/favicon/wikipedia.ico
```

```cardlink
url: https://spoqa.github.io/2012/02/27/rest-introduction.html
title: "REST 아키텍처를 훌륭하게 적용하기 위한 몇 가지 디자인 팁"
description: "최근의 서버 프로그램은 여러 웹 브라우저는 물론이며, 아이폰, 안드로이드 애플리케이션과의 통신에 대응해야 합니다. 이번 글에선 여러 문제를 지혜롭게 대처할 수 있는 REST 아키텍처에 대해 알아봅니다."
host: spoqa.github.io
image: https://spoqa.github.io/images/og-logo.png
```

```cardlink
url: https://nesoy.github.io/blog/REST-API
title: "REST API"
description: "REST API Web에 관련된 자료를 보게 되거나 혹은 API를 보게 되었을 때 가장 많이 보이는 단어가 REST란 단어였다. 하지만 REST란 단어만 알고만 있을 뿐 자세한 의미는 알지 못했다."
host: nesoy.github.io
favicon: ../static/icon.png
image: https://nesoy.github.io/static/og-image.png
```