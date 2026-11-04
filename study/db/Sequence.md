---
date: 2026-11-04
tags:
  - DB
aliases:
  - DB Sequence
  - 데이터베이스 시퀀스
  - 시퀀스
ai: true
---
데이터베이스 시퀀스란, 데이터베이스에서 일정한 규칙에 따라 숫자를 자동으로 생성하는 객체이다.

> [!INFO]
> 시퀀스의 주목적은 연속된 식별자의 보장이 아닌, 식별자 발급시 중복을 방지하는 것이다.  

%%%%
## 주요 특징

- **자동 생성**: 애플리케이션이 직접 다음 번호를 계산할 필요가 없다.
- **독립성**: 특정 테이블에 종속되지 않고 여러 테이블에서 공유할 수 있다.
- **동시성 안전**: 여러 트랜잭션이 동시에 요청하더라도 서로 다른 값을 발급받는다(순환이나 재설정 등의 예외 제외).
- **규칙 설정**: 시작값, 증가량, 최솟값, 최댓값 등을 설정할 수 있다

## 생성 방식

```sql
CREATE SEQUENCE member_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 10000
    NO CYCLE
    CACHE 1;
```

|옵션|설명|
|---|---|
|`START WITH`|처음 생성할 숫자|
|`INCREMENT BY`|숫자 증가량. 음수라면 감소|
|`MINVALUE`|생성 가능한 최솟값|
|`MAXVALUE`|생성 가능한 최댓값|
|`CYCLE`|한계에 도달하면 반대쪽 경계값부터 다시 생성|
|`NO CYCLE`|한계에 도달하면 다음 값 생성 시 오류|
|`CACHE`|성능 향상을 위해 미리 확보할 숫자의 개수|
## 사용

PostgreSQL에서는 `nextval()` 함수를 통해 다음 시퀀스 값을 가져올 수 있다.

```sql
SELECT nextval('member_seq'); -- 1
SELECT nextval('member_seq'); -- 2
SELECT nextval('member_seq'); -- 3
```

테이블의 기본값으로도 설정 가능하다.  

```sql
CREATE TABLE member (
    id BIGINT PRIMARY KEY DEFAULT nextval('member_seq'),
    name VARCHAR(50)
);

-- INSERT 시 ID를 직접 지정하지 않아도 된다.

INSERT INTO member (name) VALUES ('Kim');
INSERT INTO member (name) VALUES ('Lee');
```

## Sequence와 CACHE

시퀀스는 값을 생성할 때 매번 필요한 상태를 갱신하는 대신, 여러 값을 미리 확보하여 성능을 개선할 수 있다.

> 시퀀스 캐시의 목적은 동기화 비용 감소, 상태 갱신 비용 감소, 동시성 처리 성능 개선이다.  

세션 A가 1과 2만 사용하고 종료되면 확보해 둔 나머지 값은 사용되지 못할 수 있다.  
따라서 `CACHE`는 성능 개선에 유리하지만 번호가 건너뛰는 현상이 발생할 수 있다.  

## Sequence와 트랜잭션

```sql
BEGIN;

SELECT nextval('member_seq'); -- 1

ROLLBACK;

SELECT nextval('member_seq'); -- 2
```

첫 번째 트랜잭션이 롤백되더라도 이미 발급된 `1`은 반환되지 않는다.  
이는 여러 트랜잭션이 시퀀스를 요청할 때 불필요하게 대기하거나 경쟁하는 상황을 줄이기 위한 설계다.

따라서 시퀀스가 보장하는 것은 연속된 번호가 아니라, 정상적인 사용 조건에서 중복되지 않는 번호의 발급이다.

## MySQL과 PostgreSQL의 차이

|구분|PostgreSQL|MySQL(InnoDB)|
|---|---|---|
|ID 생성|`SEQUENCE`, `IDENTITY` 등|`AUTO_INCREMENT`|
|별도 시퀀스 객체|지원|기본적으로 미지원|
|여러 테이블에서 공유|가능|일반적인 `AUTO_INCREMENT`로는 불가능|
|JPA 전략|`SEQUENCE` 사용 가능|주로 `IDENTITY` 사용|
JPA에서 사용하는 `GenerationType.SEQUENCE`도 이러한 데이터베이스 시퀀스를 활용한다.  

## 출처 및 참고자료

```cardlink
url: https://www.geeksforgeeks.org/sql/sql-sequences/
title: "SQL SEQUENCES - GeeksforGeeks"
description: "Your All-in-One Learning Portal: GeeksforGeeks is a comprehensive educational platform that empowers learners across domains-spanning computer science and programming, school education, upskilling, commerce, software tools, competitive exams, and more."
host: www.geeksforgeeks.org
favicon: https://media.geeksforgeeks.org/wp-content/uploads/gfg_200X200-100x100.png
image: https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png
```


