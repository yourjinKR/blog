---
date: 2026-09-24
tags:
  - DB
aliases:
  - Isolation Level
  - 격리 수준
---
## Isolation Level

여러 [[Transaction|트랜잭션]]이 동시에 실행될 때, 다른 트랜잭션의 변경 데이터를 어느 정도까지 가시적으로 허용할 것인가를 결정하는 설정을 말한다.  ^intro

격리 수준에 따라 동시성과 데이터 정합성이 달라진다. (대체로 반비례 관계)  
상황에 따라 제어가 필요하며 낮은 단계의 격리 단계를 활용할때는 [[Anomaly|이상 현상]]이 발생한다.  

> [!EXAMPLE] 여러 트랜잭션이 동시에 실행될 때
> - 한명씩 처리: 데이터의 정합성은 완벽하지만 응답 속도는 굉장히 느려진다.  
> - 동시에 처리: 병렬 처리로 인해 성능은 매우 빠르지만 데이터의 정합성에 문제가 생긴다.

### Read Uncommited

SELECT 문장이 수행되는 동안 해당 데이터에 Shared Lock이 걸리지 않는 계층

- 트랜잭션에 처리중이거나, 아직 Commit되지 않은 데이터를 다른 트랜잭션이 읽는 것을 허용  
- 데이터베이스의 일관성을 유지하는 것이 불가능하다.  

> [[Anomaly#Dirty Read|Dirty Read]] 현상 발생 가능

### Read Committed

SELECT 문장이 수행되는 동안 해당 데이터에 Shared Lock이 걸리는 계층

- 트랜잭션이 수행되는 동안 다른 트랜잭션이 접근할 수 없어 대기하게 됨
- **Commit**이 이루어진 트랜잭션만 조회 가능
- 대부분의 SQL 서버가 Default로 사용하는 Isolation Level (Oracle, PostgreSQL의 기본 전략)

> [[Anomaly#Non-Repeatable Read|Non-Repeatable Read]] 발생 가능 (조회할 때마다 값이 변경)

### Repeatable Read 

트랜잭션 내에서 동일한 데이터를 반복 조회하더라도 일관된 결과를 유지하는 격리 수준이다. 

> 트랜잭션 초기의 데이터를 계속 읽음

- 일반 `SELECT`는 Shared Lock을 걸지 않으므로 다른 트랜잭션의 데이터 수정을 차단하지 않는다.
- 트랜잭션 내 첫 번째 일관된 읽기에서 생성된 스냅샷을 이후 조회에서도 재사용한다.
- 다른 트랜잭션이 데이터를 수정하고 커밋해도 기존 스냅샷을 사용하는 조회 결과에는 반영되지 않는다.
- MySQL InnoDB의 기본 격리 수준이다.

> 일반적인 격리 수준에서는 [[Anomaly#Phantom Read|Phantom Read]] 발생 가능하다.  
> MySQL InnoDB에서는 일반 SELECT의 경우 [[MVCC]] 스냅샷으로 Phantom Read를 방지하며, 범위에 대한 잠금 읽기에서는 Next-Key Lock 등을 통해 새로운 행의 삽입을 방지할 수 있다.

### Serializable

여러 트랜잭션을 동시에 실행하더라도 순차적으로 실행한 것과 동등한 결과를 보장하는 가장 엄격한 격리 수준이다.

- 조회 대상에 Shared Lock을 설정하여 다른 트랜잭션의 충돌하는 수정을 차단한다.
- 범위 조회에서는 Gap Lock, Next-Key Lock 등을 통해 해당 범위의 삽입도 제한할 수 있다.
- Dirty Read, Non-repeatable Read, Phantom Read를 방지한다.
- 동시성이 낮아지고 잠금 대기 및 [[Dead Lock|데드락]] 가능성이 증가할 수 있다.

> 단, `autocommit`이 활성화된 독립적인 SELECT는 잠금 없는 일관된 읽기로 처리될 수 있다. 또한 잠금은 모든 테이블 데이터에 일괄적으로 걸리는 것이 아니라 실제 접근 경로와 조건에 따라 달라진다.

## RDBMS에서 정의한 Isolation Level

주요 RDBMS는 SQL 표준에 기반하여 Isolation Level를 정의한다.  
RDBMS마다 정의하는 Isolation Level이 다르다.  
같은 이름의 Isolation Level이라도 동작 방식이 다를 수 있다.  

### MySQL

MySQL InnoDB의 격리 레벨은 표준에서 정의한 격리 레벨을 사용하며 기본값은 `REPEATABLE READ`입니다. 일반 조회는 MVCC 스냅샷을 사용하고, 잠금 조회나 범위 수정에서는 Next-Key Lock을 사용해 팬텀을 방지할 수 있습니다.  

### Oracle

Oracle에서 지원하는 Isolation Level은 `REPEATABLE READ`와 `SERIALIZABLE`입니다.    
ORacle의 `SERIALIZABLE`는 [[Snapshot Isolation]]으로 동작합니다.   

### SQL Server

SQL Server는 표준 SQL에서 정의한 Isolation Level를 기반으로 정의합니다.  

### PostrgreSQL

PostgreSQL는 표준 SQL에서 정의한 Isolation Level를 기반으로 정의합니다.  
PostgreSQL에서는 `REPEATABLE READ`가 Snapshot Isolation으로 동작합니다.  

## SQL

```sql
-- mysql
SELECT @@transaction_isolation;

-- PostrgreSQL
SHOW transaction_isolation;
```

## 출처 및 참고자료

```cardlink
url: https://gyoogle.dev/blog/computer-science/data-base/Transaction%20Isolation%20Level.html
title: "트랜잭션 격리 수준(Transaction Isolation Level) | 👨🏻‍💻 Tech Interview"
description: "Ready for Tech-Interview"
host: gyoogle.dev
favicon: https://gyoogle.dev/blog/images/logo.png
```

```cardlink
url: https://www.youtube.com/watch?v=yWO13BNyuw4
title: "트랜잭션 격리수준 4단계 완전 이해"
description: "#개발자 #프로그래밍 #데이터베이스 #개발자개념장착트랜잭션 격리수준 4단계를 정리합니다.READ UNCOMMITTED부터 SERIALIZABLE까지 Dirty Read, Non-Repeatable Read, Phantom Read가 왜 발생하고 어떻게 막는지 설명합니다.'아키텍트 ..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/92ead095/img/favicon_32x32.png
image: https://i.ytimg.com/vi/yWO13BNyuw4/maxresdefault.jpg
```

```cardlink
url: https://www.youtube.com/watch?v=bLLarZTrebU
title: "BJ.44 transaction isolation level 설명! isolation이 안될 때 나타날 수 있는 여러 현상들과 snapshot isolation도 설명합니다!"
description: "#isolationlevel #snapshotisolation #transaction #sql #rdbms #database #쉬운코드 #백발백중RDBMS는 isolation을 여러 수준에서 제공한다는 것을 아시나요?이번 영상은 isolation이 제대로 동작하지 않을 때의 현상들..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/92ead095/img/favicon_32x32.png
image: https://i.ytimg.com/vi/bLLarZTrebU/maxresdefault.jpg
```
