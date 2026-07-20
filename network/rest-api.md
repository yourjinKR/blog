---
title: REST API
---
# REST API (Representational State Transfer API)

[[rest|REST]] 원칙을 준수하는 API이다.  

> [!TIP]
> **REST API**란 웹의 장점(HTTP)을 최대한 활용하여 서버의 자원을 정의하고, 이를 주고받는 가장 대중적인 규칙(아키텍처 스타일)입니다.

![[Pasted image 20260715221911.png]]
## REST API 디자인 가이드

**첫 번째,** [[uri|URI]]는 정보의 자원을 표현해야 한다.  
**두 번째,** 자원에 대한 행위는 [[http-method|HTTP 메서드]]로 표현한다.

### REST API 중심 규칙

```
GET /members/update/1 (X)
```

```
PATCH /members/1 (O)
```

- URI는 정보의 자원을 표현
- 자원에 대한 행위는 HTTP Method로 표현

### 설계시 주의 사항

- `/`는 계층을 표현 하는 것이기에 URI의 경로 마지막은 `/`를 붙이지 않는다.
- URI가 불가피하게 길 경우에는 `-`를 사용한다.
- `_`를 사용하지 않는다.
- URI 경로에는 소문자가 적합하다.
- 파일 확장자는 URI에 포함 금지
- 자원은 복수형으로 표현

### 리소스 간 관계를 표현하는 방법

```
GET : /users/{userid}/devices (특정 id를 가진 유저의 device를 조회)
```

- 위처럼 has 관계를 표현할 때는 다음과 같이 사용

```
GET : /users/{userid}/likes/devices (특정 id를 가진 유저가 좋아하는 device를 조회)
```

- 관계명이 애매하거나 구체적 표현이 필요할 때는 다음과 같이 사용

### Collectio과 Document

자원은 크게 `Collection`과 `Document`로 나누어 표현할 수 있다.

```
http://example.com/projects
```

```
http://example.com/projects/todo-app/docs/erd
```

위 예시를 기준으로는 `projects`가 `Collection`이고, `todo-app`이 `Document`에 대항된다.

## 주요 특징

- **무상태** : 클라이언트가 서버로 보내는 각 요청에는 서버가 요청을 처리하는 데 필요한 모든 정보가 포함되어야 합니다. 서버에는 세션 상태가 저장되지 않습니다.
- **클라이언트-서버 아키텍처** : RESTful API는 클라이언트와 서버가 독립적으로 작동하는 클라이언트-서버 모델을 기반으로 하며, 이를 통해 확장성을 확보할 수 있습니다.
- **캐시 가능** : 서버 응답은 성능 향상을 위해 명시적으로 캐시 가능 또는 캐시 불가능으로 표시될 수 있습니다.
- **균일한 인터페이스** : REST API는 원활한 통신을 보장하기 위해 일관된 URL 경로, 표준화된 HTTP 메서드 및 상태 코드와 같은 일련의 규칙과 제약 조건을 따릅니다.
- **계층형 시스템** : REST API는 여러 계층에 배포할 수 있어 확장성과 보안에 도움이 됩니다.

## 출처 및 참고자료

[geeksforgeeks](https://www.geeksforgeeks.org/node-js/rest-api-introduction/)  
https://f-lab.kr/insight/understanding-rest-api-and-restful?gad_source=1&gbraid=0AAAAACGgUFf1SpiLDNYBYkS1w5GZ35XkG  
https://aws.amazon.com/ko/what-is/restful-api/  
https://wikidocs.net/blog/@dragonhappy9/1262/  
https://meetup.nhncloud.com/posts/92  
