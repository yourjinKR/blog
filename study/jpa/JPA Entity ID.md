---
date: 2026-11-04
tags:
  - JPA
---
## JPA Entity ID 할당 방식

- `@Id`: 직접 할당
- `@Id` + `@GeneratedValue`: 자동 할당
	- `strategy` 속성을 통해 생성 전략(`GenrationType`)을 선택 

## JPA Entity ID 생성 전략

- `GenrationType.IDENTITY`: 키 생성을 DB에 위임
- `GenrationType.SEQUENCE`: 데이터베이스 시퀀스를 사용
- `GenrationType.TABLE`: 별도의 테이블을 사용
- `GenrationType.AUTO`: JPA가 사용 중인 데이터베이스에 따라 적절한 ID 생성 전략 선택
- `GenrationType.UUID`: UUID를 사용하여 키를 생성

### GenrationType.IDENTITY

- 일반적인 사용법
- [[JPA 쓰기 지연|쓰기 지연]]이 적용되지 않음
- 데이터 삽입시 애플리케이션에서 ID를 관리할 필요 없다는 편의성 보장

### GenrationType.SEQUENCE

- [[Sequence|시퀀스]] 키 생성 전략을 지원하는 DB에 사용 가능
- ID의 초기 값과 증가량을 제어 가능
- 어떤 시퀀스를 사용할지는 `@SequenceGenerator`로 설정 가능
- ID를 미리 생성할 수 없어 pk값을 가져오기 위한 DB Sequence 조회 발생

### GenrationType.TABLE

- 키 생성 전용 테이블을 만들어 관리
- 어떤 테이블을 사용할 것인지를 `@TableGenerator`로 설정
- 내부 동작 방식은 SEQUENCE 방식과 동일
- DB와 한번 더 통신한다는 점에서 SEQUENCE보다 성능 면에서는 좋지 않지만 모든 DB에 적용 가능

### GenrationType.AUTO

- DBMS 과 기본키 자료형에 따라 자동으로 전략을 선택
	- MySQL: `IDENTITY`
	- ORACLE, H2: `SEQUENCE`
- DBMS가 바뀌더라도 코드를 변경하지 않는다는 장점 존재

## IDENTITY 전략에서의 쓰기 지연 제한

`IDENTITY`는 DB에서 INSERT해야 PK를 알 수 있으므로 일반적으로 `persist()` 호출 시 INSERT를 실행한다.  
따라서 일반적인 [[JPA 쓰기 지연|쓰기 지연]]을 활용하기 어렵고, Hibernate의 JDBC INSERT Batching도 지원되지 않는다.  

## 출처 및 참고자료

```cardlink
url: https://github.com/2024-woowacourse-study/level-interview/discussions/221
title: "JPA에서 ID 생성 전략에 대해 설명해주세요. · 2024-woowacourse-study/level-interview · Discussion #221"
description: "."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/c3f4f6faf3d2169badc137dc1ecf2aa46e99266311d060dd11c01e6234d0475a/2024-woowacourse-study/level-interview/discussions/221
```

```cardlink
url: https://velog.io/@skyepodium/JPA-%EA%B8%B0%EB%B3%B8%ED%82%A4-%EB%A7%A4%ED%95%91-%EC%A0%84%EB%9E%B5#3-identity
title: "[JPA] 기본 키 매핑 전략"
description: "JPA 기본키 매핑 전략"
host: velog.io
favicon: https://static.velog.io/favicons/favicon-32x32.png
image: https://velog.velcdn.com/images/skyepodium/post/eac9c592-6299-49a4-94c1-5541103c8b37/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202022-01-02%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%207.25.11.png
```
