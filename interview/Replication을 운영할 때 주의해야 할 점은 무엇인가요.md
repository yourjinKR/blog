---
tags:
  - 면접
  - 스터디
  - DB
---
Replication을 운영할 때는 복제 지연, 일관성, 장애 조치, 데이터 손실 가능성과 운영 복잡성을 함께 고려해야 합니다.

MySQL의 기본 Replication은 비동기 방식이므로 Source에서 커밋된 변경이 Replica에 즉시 반영된다는 보장이 없습니다. 사용자가 데이터를 저장한 직후 Replica에서 조회하면 이전 값이 보이는 Read-After-Write 불일치가 발생할 수 있습니다. 즉시 최신 데이터가 필요한 요청은 일정 시간 Source로 보내거나, 해당 트랜잭션이 Replica에 적용될 때까지 기다리는 전략이 필요합니다.

Source 장애 시 Replica를 새 Source로 승격하는 것만으로 끝나지 않습니다. 가장 최신 데이터를 가진 Replica인지 확인하고, 이전 Source가 동시에 쓰기를 받지 않도록 차단하여 Split Brain을 방지해야 합니다. 애플리케이션의 접속 경로를 전환하고 실패한 요청을 재시도할 때는 중복 처리를 막기 위한 멱등성도 필요합니다. GTID를 사용하면 복제 위치 관리와 Failover를 단순화할 수 있습니다.

또한 Replication은 백업을 대체하지 않습니다. 실수로 실행한 DELETE나 손상된 데이터도 Replica로 복제되므로 별도의 백업과 복구 시점 관리가 필요합니다. 운영 중에는 복제 지연, SQL 적용 오류, 네트워크 상태, 디스크 용량과 Replica의 재시작·복구 상태를 지속해서 모니터링해야 합니다.

> [!QUESTION]- 복제 지연으로 인한 Read-After-Write 문제는 어떻게 해결하나요?
> 저장 직후의 사용자 요청이나 강한 일관성이 필요한 조회는 Source로 라우팅하고, 이후 요청부터 Replica를 사용할 수 있습니다. 더 엄격한 보장이 필요하면 커밋한 GTID가 Replica에 적용될 때까지 기다리거나 준동기·동기 구성을 검토하되 지연 시간과 가용성의 비용을 고려해야 합니다.

> [!QUESTION]- Spring의 `@Transactional(readOnly = true)`를 붙이면 자동으로 Replica에서 조회하나요?
> 아닙니다. `readOnly`는 트랜잭션 매니저와 JPA 구현체에 읽기 전용 힌트를 제공할 뿐 DataSource를 자동으로 전환하지 않습니다. Source와 Replica DataSource를 구성하고 `AbstractRoutingDataSource`나 DB Proxy 등을 이용해 라우팅 정책을 별도로 구현해야 합니다.

> [!QUESTION]- Replica가 있으므로 별도 백업은 없어도 되나요?
> 안 됩니다. 논리적 삭제, 잘못된 UPDATE, 애플리케이션 버그와 일부 손상은 Replica에도 그대로 전파됩니다. 독립된 전체·증분 백업과 Binlog를 이용한 Point-in-Time Recovery를 준비하고 실제 복구 훈련까지 해야 합니다.

%%%%
## 출처 및 참고자료

- [Replication - MySQL 8.4 Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/replication.html)
- [Using GTIDs for Failover and Scaleout - MySQL 8.4 Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/replication-gtids-failover.html)
- [Transaction Management - Spring Framework](https://docs.spring.io/spring-framework/reference/data-access/transaction.html)
