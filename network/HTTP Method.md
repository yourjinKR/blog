---
tags:
  - Network
  - HTTP
aliases:
  - HTTP 메서드
---
# HTTP 메서드

[[HTTP|HTTP]] 메서드는 클라이언트가 서버에게 "이 리소스에 대해 어떤 동작을 할 것인지"를 알려주는 약속입니다. 이를 목적에 맞게 사용하는 것이 [[rest-api|REST API]] 설계의 핵심입니다.

##  주요 메서드

### GET

- **역할** : 서버로부터 특정 데이터를 가져올 때
- **특징** : URL의 쿼리 파라미터를 통해 전달하며, 메세지 바디는 사용하지 않는 것이 권장
- **성질** : 안전하고 멱등하다

### POST

- **역할** : 서버에 새로운 데이터를 생성하거나 복잡한 처리를 요청시
- **특징** : 데이터는 메세지 바디에 담아 보낸다
- **성질** : 멱등하지 않음

#### 복잡한 처리에 대한 POST 요청 사용


### PUT

- **역할** : 대상 리소스를 통채로 덮어쓰기
- **특징** : 만약 해당 리소스가 없다면 새로 생성, 있다면 삭제 후 재생성
- **성질** : 멱등하다

### PATCH

- **역할** : 리소스의 일부분 변경
- **특징** : PUT과 달리 수정하고 싶은 필드만 보냄
- **성질** : 구현 방식에 따라 멱등하거나 아닐 수도 있다

### DELETE

- **역할** : 리소스 삭제
- **성질** : 멱등하다

## 기타 메서드

- HEAD
- OPTIONS
- CONNECT
- TRACE


## 요약표

- **[[멱등성]]**: 동일한 요청을 한 번 보내는 것과 여러 번 연속으로 보내는 것이 서버의 상태에 동일한 효과를 미치는 성질
- **안전성**: 호출하더라도 서버의 리소스(상태)를 변경하지 않는 성질

| HTTP 메소드 | RFC                                                                                                                                 | 요청에 Body가 있음 | 응답에 Body가 있음 | 안전  | 멱등(Idempotent) | 캐시 가능 |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------ | --- | -------------- | ----- |
| GET      | [RFC](https://ko.wikipedia.org/wiki/RFC_\(%EC%8B%9D%EB%B3%84%EC%9E%90\) "RFC (식별자)") [9110](https://www.rfc-editor.org/rfc/rfc9110) | 선택 사항        | 예            | 예   | 예              | 예     |
| HEAD     | [RFC](https://ko.wikipedia.org/wiki/RFC_\(%EC%8B%9D%EB%B3%84%EC%9E%90\) "RFC (식별자)") [9110](https://www.rfc-editor.org/rfc/rfc9110) | 선택 사항        | 아니요          | 예   | 예              | 예     |
| POST     | [RFC](https://ko.wikipedia.org/wiki/RFC_\(%EC%8B%9D%EB%B3%84%EC%9E%90\) "RFC (식별자)") [9110](https://www.rfc-editor.org/rfc/rfc9110) | 예            | 예            | 아니요 | 아니요            | 예     |
| PUT      | [RFC](https://ko.wikipedia.org/wiki/RFC_\(%EC%8B%9D%EB%B3%84%EC%9E%90\) "RFC (식별자)") [9110](https://www.rfc-editor.org/rfc/rfc9110) | 예            | 예            | 아니요 | 예              | 아니요   |
| DELETE   | [RFC](https://ko.wikipedia.org/wiki/RFC_\(%EC%8B%9D%EB%B3%84%EC%9E%90\) "RFC (식별자)") [9110](https://www.rfc-editor.org/rfc/rfc9110) | 선택 사항        | 예            | 아니요 | 예              | 아니요   |
| CONNECT  | [RFC](https://ko.wikipedia.org/wiki/RFC_\(%EC%8B%9D%EB%B3%84%EC%9E%90\) "RFC (식별자)") [9110](https://www.rfc-editor.org/rfc/rfc9110) | 선택 사항        | 예            | 아니요 | 아니요            | 아니요   |
| OPTIONS  | [RFC](https://ko.wikipedia.org/wiki/RFC_\(%EC%8B%9D%EB%B3%84%EC%9E%90\) "RFC (식별자)") [9110](https://www.rfc-editor.org/rfc/rfc9110) | 선택 사항        | 예            | 예   | 예              | 아니요   |
| TRACE    | [RFC](https://ko.wikipedia.org/wiki/RFC_\(%EC%8B%9D%EB%B3%84%EC%9E%90\) "RFC (식별자)") [9110](https://www.rfc-editor.org/rfc/rfc9110) | 아니요          | 예            | 예   | 예              | 아니요   |
| PATCH    | [RFC](https://ko.wikipedia.org/wiki/RFC_\(%EC%8B%9D%EB%B3%84%EC%9E%90\) "RFC (식별자)") [5789](https://www.rfc-editor.org/rfc/rfc5789) | 예            | 예            | 아니요 | 아니요            | 아니요   |

## 출처 및 참고자료

```cardlink
url: https://ko.wikipedia.org/wiki/HTTP
title: "HTTP - 위키백과, 우리 모두의 백과사전"
host: ko.wikipedia.org
favicon: https://ko.wikipedia.org/static/favicon/wikipedia.ico
image: https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/HTTP_logo.svg/1280px-HTTP_logo.svg.png?utm_source=ko.wikipedia.org&utm_campaign=index&utm_content=thumbnail
```
