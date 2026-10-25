---
date: 2026-10-26
tags:
  - DB
aliases:
  - 카테시안 곱
---
> [!NOTE] 핵심 요약
> Cartesian Product는 두 집합의 모든 가능한 조합을 만드는 연산이며, SQL에서 여러 1:N 관계를 동시에 JOIN할 경우 자식 Row끼리 조합되면서 결과 Row 수가 곱셈 형태로 증가하는 원인이 될 수 있다.

카테시안 곱은 발생가능한 모든 경우의 수의 행이 출력되는 것을 의미한다.  ^intro

아래와 같은 2개의 집합이 있다고 가정한다.  

```js
A = {1, 2}
B = {a, b, c}
```

카테시안 곱 수행시 다음과 같은 결과가 나온다.  

```js
A × B

(1, a)
(1, b)
(1, c)
(2, a)
(2, b)
(2, c)
```

> [!INFO]
> 카티션 프로덕트는 조건 없이 모든 조합을 만들기 때문에, 결과의 튜플 수는 R의 튜플 수 × S의 튜플 수가 됩니다. 합병 가능 조건이 필요한 합집합·교집합·차집합과 달리, 카티션 프로덕트는 속성이 달라도 사용할 수 있습니다.

## SQL로 보는 카테시안 곱

일반적인 SQL에서 다음과 같은 연산으로 카테시안 곱을 수행한다.  

```sql
SELECT * FROM member, board
```

아래는 PostgreSQL를 기준으로 아래 연산 모두 카테시안 곱을 수행한다.  

```sql
SELECT * FROM member CROSS JOIN board;
SELECT * FROM FROM member INNER JOIN board ON TRUE
```

## 카테시안 곱의 문제점

여러 개의 `1:N` 관계를 한 번의 쿼리로 조인하면 각 자식 데이터의 조합만큼 결과 행이 증가할 수 있다.

예를 들어 하나의 게시물에 리뷰가 100개 있다면 게시물과 리뷰를 조인했을 때 100개의 행이 생성된다.

여기에 각 리뷰와 별개로 게시물에 연결된 또 다른 `1:N` 관계의 데이터가 N개 존재하고 이를 함께 조인한다면 결과 행은 다음과 같이 증가할 수 있다.

```
1 × 100 × N

N = 5   → 500 rows
N = 100 → 10,000 rows
```

즉, 여러 `1:N` 관계를 동시에 조인할수록 결과 행이 **곱셈 형태로 증가**하며, 동일한 상위 데이터가 반복되어 전송된다.
이는 불필요한 데이터 조회와 네트워크 전송량 증가, DB 및 애플리케이션의 처리 비용 증가로 이어질 수 있다.

%%%%
## 출처 및 참고자료

```cardlink
url: https://jeongcheogi.edugamja.com/theory/db/relational-algebra?highlight=%EA%B4%80%EA%B3%84%20%EB%8C%80%EC%88%98
title: "관계대수와 관계해석"
description: "정보처리기사 실기 시험의 핵심 개념인 관계 대수의 연산자와 관계 해석의 특징을 알아봅니다. 절차적 언어와 비절차적 언어의 차이, 튜플 관계 해석과 도메인 관계 해석을 이해하고, 실제 기출문제 유형을 통해 시험을 완벽하게 대비하세요."
host: jeongcheogi.edugamja.com
favicon: https://jeongcheogi.edugamja.com/favicon.ico?favicon.2ns115htqsj_s.ico
image: https://jeongcheogi.edugamja.com//folder-icons/theory/db/relational-algebra.webp
```
