---
date: 2026-10-09
tags:
  - DB
aliases:
  - 함수 종속성
  - 함수 종속
---
함수 종속이란 데이터베이스의 릴레이션에서 두 개의 속성 집합 간 제약의 일종이다.  ^intro

|종속|핵심|관련 정규형|
|---|---|---|
|완전 함수 종속|복합키 **전체**가 필요|2NF의 정상적인 상태|
|부분 함수 종속|복합키 **일부**만으로 결정|2NF에서 제거|
|이행 함수 종속|`A → B → C`|3NF에서 제거|
|결정자|`A → B`에서 A|BCNF와 관련|
|다중값 종속|`A ↠ B`, 독립적인 다중값|4NF에서 제거|
|조인 종속|분해 후 JOIN으로 원상복구|5NF에서 다룸|

## 출처 및 참고자료

```cardlink
url: https://velog.io/@busybean3/%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4-%ED%95%A8%EC%88%98-%EC%A2%85%EC%86%8D%EC%84%B1Functional-Dependency
title: "데이터베이스 함수 종속성(Functional Dependency)"
description: "함수 종속(functional dependency)이란 데이터베이스의 릴레이션(relation)에서 두 개의 속성(attribute) 집합 간 제약의 일종이다.어떤 릴레이션 R에서, X와 Y를 각각 R의 속성(attribute) 집합의 부분 집합이라 하자.  속성(at"
host: velog.io
favicon: https://static.velog.io/favicons/favicon-32x32.png
image: https://velog.velcdn.com/images/busybean3/post/c49ce9b5-937a-4de8-ac07-8664600c31a3/image.png
```

```cardlink
url: https://ko.wikipedia.org/wiki/%ED%95%A8%EC%88%98_%EC%A2%85%EC%86%8D
title: "함수 종속 - 위키백과, 우리 모두의 백과사전"
host: ko.wikipedia.org
favicon: https://ko.wikipedia.org/static/favicon/wikipedia.ico
```

```cardlink
url: https://jeongcheogi.edugamja.com/theory/db/functional-dependency
title: "데이터베이스 함수 종속성(Functional Dependency)"
description: "데이터베이스 정규화의 핵심 개념인 함수 종속성에 대해 알아봅니다. 완전 함수 종속, 부분 함수 종속, 이행 함수 종속의 개념과 구체적인 예시를 통해 정규화 과정을 이해해봅니다."
host: jeongcheogi.edugamja.com
favicon: https://jeongcheogi.edugamja.com/favicon.ico?favicon.2ns115htqsj_s.ico
image: https://jeongcheogi.edugamja.com//folder-icons/theory/db/functional-dependency.webp
```

