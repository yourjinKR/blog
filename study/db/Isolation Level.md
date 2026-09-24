---
tags:
  - DB
aliases:
  - Isolation Level
  - 격리 수준
---
## Isolation Level

[[Transaction|트랜잭션]]에서 일관성 없는 데이터를 허용하도록 하는 수준을 말한다.  
격리 수준에 따라 동시성과 데이터 정합성이 달라진다. (대체로 반비례 관계)  
상황에 따라 제어가 필요하며 낮은 단계의 격리 단계를 활용할때는 [[Anomaly|이상 현상]]이 발생한다.  

### Read Uncommited

SELECT 문장이 수행되는 동안 해당 데이터에 Shared Lock이 걸리지 않는 계층

- 트랜잭션에 처리중이거나, 아직 Commit되지 않은 데이터를 다른 트랜잭션이 읽는 것을 허용  
- 데이터베이스의 일관성을 유지하는 것이 불가능하다.  

### Read Committed

SELECT 문장이 수행되는 동안 해당 데이터에 Shared Lock이 걸리는 계층

- 트랜잭션이 수행되는 동안 다른 트랜잭션이 접근할 수 없어 대기하게 됨
- Commit이 이루어진 트랜잭션만 조회 가능
- 대부분의 SQL 서버가 Default로 사용하는 Isolation Level

### Repeatable Read 

트랜잭션이 완료될 때까지 SELECT 문장이 사용하는 모든 데이터에 Shared Lock이 걸리는 계층

- 트랜잭션이 범위 내에서 조회한 데이터 내용이 항상 동일함을 보장
- 다른 사용자는 트랜잭션 영역에 해당되는 데이터에 대한 수정 불가능
- MySQL에서 Default로 사용하는 Isolation Level

### Serializable

트랜잭션이 완료될 때까지 SELECT 문장이 사용하는 모든 데이터에 Shared Lock이 걸리는 계층

- 완벽한 읽기 일관성 모드를 제공
- 다른 사용자는 트랜잭션 영역에 해당되는 데이터에 대한 수정 및 입력 불가능

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

## 출처 및 참고자료

https://gyoogle.dev/blog/computer-science/data-base/Transaction%20Isolation%20Level.html  
