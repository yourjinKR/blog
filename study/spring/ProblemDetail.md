---
date: 2026-11-21
tags:
  - Spring
---
ProblemDetail은 RFC 7807 – Problem Details for HTTP APIs를 구현한 클래스다.  
이 RFC는 REST API에서 에러가 발생했을 때 일관된 JSON 응답 구조를 제공하기 위한 규격이다.  
Spring 6 이상에서 기본으로 제공하며, 응답은 application/problem+json 형태로 내려간다.

| 필드         | 설명              |
| ---------- | --------------- |
| `type`     | 오류 유형을 식별하는 URI |
| `title`    | 오류 제목           |
| `status`   | HTTP 상태 코드      |
| `detail`   | 오류에 대한 상세 설명    |
| `instance` | 오류가 발생한 리소스 경로  |
## 출처 및 참고자료

```cardlink
url: https://velog.io/@youngho0620/Spring-6%EC%9D%98-%EC%83%88%EB%A1%9C%EC%9A%B4-%EC%97%90%EB%9F%AC-%EC%9D%91%EB%8B%B5-%ED%91%9C%EC%A4%80-ProblemDetail
title: "새로운 에러 응답 표준, ProblemDetail"
description: "최근 새 프로젝트에서 에러 처리 방식을 통합하는 일을 맡았다.그동안은 예외가 발생하면 서비스마다 직접 만든 ErrorResponse DTO를 만들어서 반환하는 방식이었다.문제는 이 구조가 팀마다 제각각이라 API 문서 표준화가 힘들고, 공통 에러 코드나 필드 체계가 맞"
host: velog.io
favicon: https://static.velog.io/favicons/favicon-32x32.png
image: https://images.velog.io/velog.png
```
