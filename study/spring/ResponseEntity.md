---
date: 2026-11-20
tags:
  - Spring
---
`ResponseEntity`는 [[Spring MVC]]에서 HTTP 요청에 대한 응답을 제어하는 데 사용하는 클래스이다. 

기존에 `HttpHeaders`와 `body`를 가진 `HttpEntity` 클래스에서 HTTP 상태값을 나타내는 `HttpStatusCode` 타입의 `status` 필드를 추가했다.  

![[IMG-20261120183329779.png]]

`ResponseEntity`는 `@RestController`와 함께 사용되어 JSON 또는 XML과 같은 [[REST|RESTful]] 서비스를 제공하는데 이상적이다.

## static Method

정적 메서드를 통해 HTTP 상태값을 쉽게 제어할 수 있으며 대표적으로 아래와 같이 주로 사용된다.  

| 메서드명                          | HTTP Status     |
| ----------------------------- | --------------- |
| `ResponseEntity.ok()`         | 200 OK          |
| `ResponseEntity.created()`    | 201 Created     |
| `ResponseEntity.accepted()`   | 202 Accepted    |
| `ResponseEntity.noContent()`  | 203 No Content  |
| `ResponseEntity.badRequest()` | 400 Bad Request |

## 직렬화

우선 ResponseEntity는 `HttpMessageConverter`에 의해 직렬화된다. Spring Boot에서는 기본적으로 Jackson의 `MappingJackson2HttpMessgaeConverter`에 의해 json 형태로 직렬화된다.  

![[IMG-20261120190707110.png]]

Spring 7.0 부터는 Jackson 3 기본 지원 전환을 위해 `JacksonXmlHttpMessageConverter`로 대체됐다.  

어노테이션 기반의 Controller에서는 `RequestMappingHandlerAdapter`가 메서드를 호출한다.  
그리고 해당 클래스는 


## 출처 및 참고자료

```cardlink
url: https://burningfalls.github.io/java/what-is-response-entity/
title: "[Spring] ResponseEntity란?"
description: "ResponseEntity란? ResponseEntity의 주요 특징 및 기능은? ResponseEntity의 사용 방법은? ResponseEntity의 주요 메서드들의 사용 방법은?"
host: burningfalls.github.io
image: https://burningfalls.github.io/assets/images/squirrel.png
```
