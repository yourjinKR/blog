---
date: 2026-10-14
tags:
  - Spring
aliases:
  - "@Transactional"
  - Spring Transaction
  - 스프링 트랜잭션
---
클래스나 메서드에 붙여 [[Transaction|트랜잭션]]을 선언적으로 관리할 구현할 수 있는 [[Java Annotation|어노테이션]]이다.  

## 동작 과정

1. 어노테이션 메서드 호출 감지: `TransactionInterceptor`가 메서드 호출을 가로채 트랜잭션 준비
2. 트랜잭션 매니저 결정: 메서드와 클래스의 트랜잭션 속성에 따라 `TransactionManager`를 선택 
	- JPA에서는 `JPATransactionManager`
3. 커넥션 생성: `DataSource`를 통해 `Connection` 생성
4. 트랜잭션 시작 ([[JDBC]]의 `autoCommit`을 `false`)
5. 트랜잭션 동기화 매니저에게 커넥션 저장: 트랜잭션동안 동일한 커넥션을 하나의 스레드에서 일관되게 사용
	- `TransactionSynchronizationManager`
	- DB 접근 작업이 있을때마다 커넥션을 꺼내다 씀

## 전파 속성

기본적으로 여러 트랜잭션을 묶어서 커다란 하나의 트랜잭션 경계를 만든다. (`REQUIRED`)
이때 기존에 트랜잭션이 진행중일 때 추가적인 트랜잭션을 어떻게 수행할지를 결정하는 것이 **전파 속성**이다.  

| Propagation     | 기존 트랜잭션 O              | 기존 트랜잭션 X  |
| --------------- | ---------------------- | ---------- |
| `REQUIRED`      | 참여                     | 새로 생성      |
| `REQUIRES_NEW`  | 기존 트랜잭션 중단 + 새로 생성     | 새로 생성      |
| `SUPPORTS`      | 참여                     | 트랜잭션 없이 실행 |
| `NOT_SUPPORTED` | 기존 트랜잭션 중단             | 트랜잭션 없이 실행 |
| `MANDATORY`     | 참여                     | 예외         |
| `NEVER`         | 예외                     | 트랜잭션 없이 실행 |
| `NESTED`        | 중첩 트랜잭션 (Savepoint 사용) | 새로 생성      |

`REQUIRES_NEW`와 `NESTED`를 비교한건 다음과 같다.  

|                | REQUIRES_NEW  | NESTED       |
| -------------- | ------------- | ------------ |
| 물리 트랜잭션        | 별도            | 동일           |
| Connection     | 별도 필요 가능      | 동일           |
| 구현             | 새 Transaction | Savepoint    |
| 내부 Commit      | 실제 Commit 가능  | 독립 Commit 아님 |
| 외부 Rollback 영향 | 내부 Commit 유지  | 전체 Rollback됨 |

## 읽기 전용 트랜잭션

읽기 작업을 위한 트랜잭션도 제공하며 속성에 `readOnly = true`를 추가 (기본값은 `false`)

우선 읽기 작업에도 트랜잭션을 설정하는 이유는 다음과 같다.  

1. **일관성**: 여러 `SELECT` 작업이 묶여 있을 경우 일관성을 유지할 수 있다.   
2. **DB 라우팅 기준**: 읽기/쓰기 DB 분리 구조에서 라우팅 기준으로 사용 가능하다.  
3. **JPA 최적화**: JPA 사용 시, 읽기 전용 힌트나 `flush` 모드로 인한 최적화 여지가 존재한다.  

`readOnly=true`를 설정한다고 해서 `INSERT`, `UPDATE`, `DELETE`가 불가능한건 아니다.  
공식문서에서는 다음과 같이 언급한다.  

> [!quote]
> 
> 이는 실제 트랜잭션 하위 시스템에 대한 힌트일 뿐이며, 쓰기 접근 시도 실패를 반드시 유발하는 것은 아닙니다. 읽기 전용 힌트를 해석할 수 없는 트랜잭션 관리자는 읽기 전용 트랜잭션 요청을 받았을 때 예외를 발생시키지 않고 힌트를 묵묵히 무시합니다.  
> 
> > [!quote]- 원본
> >
> > This just serves as a hint for the actual transaction subsystem; it will not necessarily cause failure of
> > write access attempts. A transaction manager which cannot interpret the read-only hint will not
> > throw an exception when asked for a read-only transaction but rather silently ignore the hint.  
> > 
> > https://docs.spring.io/spring-framework/docs/6.2.14/javadoc-api/org/springframework/transaction/annotation/Transactional.html?utm_source=chatgpt.com

%%%%
### 이점

> 주로 사용하는 환경인 Spring + JPA + Hibernate을 기준으로 설명

- Spring Transaction에 readOnly 정보가 기록, Spring은 이 정보를 Hibernate나 JDBC 같은 하위 계층에 전달
- Hibernate에서 `FlushMode.MANUAL` 설정, JPA에서는 더티 체킹을 수행하지 않는다. (CPU/메모리 비용 감소)
- 락 획득 최소화, 모든 락이 아닌 읽기 락만 획득함
- 트랜잭션 로그 생성 생략


## 출처 및 참고자료

```cardlink
url: https://mangkyu.tistory.com/269
title: "[Spring] 스프링의 트랜잭션 전파 속성(Transaction propagation) 완벽하게 이해하기"
description: "아래의 내용은 김영한님의 디비 접근 기술 2편 강의와 토비의 스프링 등을 바탕으로 정리한 내용입니다.    1. 트랜잭션의 시작과 종료 및 전파 속성(Transaction Propagation)[ 트랜잭션의 시작과 종료 ]트랜잭션은 시작 지점과 끝나는 지점이 존재한다. 시작하는 방법은 1가지이지만 끝나는 방법은 2가지이다. 트랜잭션이 끝나는 방법에는 모든 작업을 확정짓는 커밋(commit)과 모든 작업을 무효화하는 롤백(rollback)이 있다.  트랜잭션의 시작트랜잭션은 하나의 Connection을 가져와 사용하다가 닫는 사이에서 일어난다. 트랜잭션의 시작과 종료는 Connection 객체를 통해 이뤄지기 때문이다. JDBC의 기본 설정은 DB 작업을 수행한 직후에 바로 커밋을 하는 자동 커밋 옵션이 .."
host: mangkyu.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbFg3yL%2FbtrIH6dAJRK%2FAAAAAAAAAAAAAAAAAAAAAEj-qi-UiiUnJEqOzWpMCxWX8jqvAWpHdxLDM-tz6njK%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DXqh%252Fjv2yrOFMCSH388DGDCo64Do%253D
```

```cardlink
url: https://seongminlife.tistory.com/55
title: "@Transactional(readOnly=true)는 왜 써야하는걸까?"
description: "백엔드 학습을 하며 DB에 대한 학습을 진행하면 필수로 익혀야 하는 부분이 바로 트랜잭션이다.`org.springframework.transaction.annotation` 패키지에 속한 `@Transactional` 어노테이션을 이용하면 우리가 원하는 메소드에 트랜잭션을 걸어 영속성 컨텍스트를 활용할 수 있다. 파일을 수정, 삭제를 할 때 일관성과 정합성을 위해 `@Transactional` 어노테이션을 사용하는 것은 이제는 너무 당연하게 느껴지는 사항이다. 그런데 트랜잭션의 옵션에 보면 readOnly 라는 옵션이 존재한다.트랜잭션을 사용하는 가장 단순한 이유에서 생각해본다면, 수정 혹은 삭제 등의 변경사항이 일어났을 때 오류가 발생해 하나의 연결된 로직이 부분 수정이 되는 현상을 방지하기 위해 트랜.."
host: seongminlife.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FcIJnzX%2FbtsQFEynr9u%2FAAAAAAAAAAAAAAAAAAAAAF2PKpGeSaAimw0Tyuynn91bwadVmZTdnXQO1_qRTj1s%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Dy9DHXdRMz3HevBGrxycmqozA3HQ%253D
```


```cardlink
url: https://www.youtube.com/watch?v=idncmjH1_7g
title: "[10분 테코톡] 밤밤의 단순 조회에도 읽기 전용 트랜잭션이 필요할까?"
description: "🙋‍♀️ 우아한테크코스의 크루들이 진행하는 10분 테크토크입니다. 🙋‍♂️'10분 테코톡'이란 우아한테크코스 과정을 진행하며 크루(수강생)들이 동료들과 학습한 내용을 공유하고 이야기하는 시간입니다. 서로가 성장하기 위해 지식을 나누고 대화하며 생각해보는 시간으로 자기 주도적인 ..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/eae06bf0/img/favicon_32x32.png
image: https://i.ytimg.com/vi/idncmjH1_7g/maxresdefault.jpg
```
