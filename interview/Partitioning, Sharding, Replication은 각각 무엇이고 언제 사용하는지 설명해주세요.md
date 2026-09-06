---
tags:
  - 면접
  - 스터디
  - DB
---
Partitioning, Sharding, Replication은 모두 데이터베이스 규모와 부하를 다루는 기술이지만 데이터를 나누거나 복제하는 범위와 목적이 다릅니다.

**Partitioning**은 하나의 논리적 테이블을 같은 데이터베이스 서버 안에서 여러 파티션으로 나누는 방식입니다. 날짜나 키 범위를 기준으로 행을 분리하면 조건과 파티션 키가 맞을 때 불필요한 파티션을 제외하는 Partition Pruning을 사용할 수 있고, 오래된 데이터 파티션을 교체하거나 제거하기도 편합니다. 하지만 하나의 서버 자원 한계를 근본적으로 넘거나 고가용성을 제공하는 기술은 아닙니다.

> 데이터베이스 테이블을 더 작은 테이블들로 나누는 것을 말한다.  

- vertical partitiong: column을 기준으로 table를 나누는 방식
- horizontal pratitioning: row를 기준으로 table를 나누는 방식

**Sharding**은 데이터를 Shard Key에 따라 여러 독립적인 데이터베이스 서버에 수평 분산하는 방식입니다. 데이터 크기와 읽기·쓰기 부하를 여러 서버로 나눌 수 있어 단일 서버의 한계를 넘는 데 사용합니다. 대신 애플리케이션의 라우팅, 데이터 재분배, Cross-Shard Join과 트랜잭션, 전역 유일성 관리가 복잡해집니다.

> horizontal pratitioning 처럼 동작하되 각 partition이 독립된 DB 서버에 저장

**Replication**은 동일한 데이터를 하나 이상의 복제 서버에 복사하는 방식입니다. 읽기 부하 분산, 장애 대응, 분석 및 백업 작업 분리에 활용할 수 있습니다. MySQL의 일반적인 Source-Replica 복제는 비동기 방식이므로 복제 지연으로 인해 Replica에서 오래된 데이터를 읽을 수 있으며, 기본 구조에서는 쓰기 부하가 Source에 남습니다.

> DB를 복제해서 여러 대의 DB 서버에 저장하는 방식을 말한다.  
> 특정 DB가 죽는 상황에서도 고가용성 보장, 서버 부하(read)를 낮춘다.

정리하면 큰 테이블의 관리와 일부 쿼리 범위 축소에는 Partitioning, 한 서버가 감당하기 어려운 데이터와 쓰기 부하 분산에는 Sharding, 읽기 확장과 고가용성에는 Replication을 주로 사용합니다. 세 기술은 목적에 따라 함께 사용할 수도 있습니다.

> [!QUESTION]- Partition Key와 Shard Key를 잘못 선택하면 어떤 문제가 생기나요?
> 조회 조건과 맞지 않으면 모든 파티션이나 샤드를 조회해야 하고, 특정 키에 데이터가 몰리면 Hot Partition 또는 Hot Shard가 생깁니다. 데이터 분포가 균등하면서 핵심 쿼리를 한 파티션이나 샤드로 제한할 수 있는 키를 선택해야 합니다.

> [!QUESTION]- Sharding 환경에서 트랜잭션이 어려운 이유는 무엇인가요?
> 하나의 업무가 여러 샤드에 걸리면 단일 DB의 로컬 트랜잭션으로 원자성을 보장할 수 없습니다. 분산 트랜잭션은 조정 비용과 장애 처리가 복잡하므로, 가능한 한 같은 업무 데이터를 동일한 샤드에 배치하고 필요하면 Saga 같은 보상 방식과 멱등성을 고려합니다.

> [!QUESTION]- Partitioning, Sharding, Replication을 함께 사용할 수 있나요?
> 가능합니다. 예를 들어 사용자 ID로 데이터베이스를 샤딩하고, 각 샤드의 이력 테이블을 날짜로 파티셔닝하며, 각 샤드에 Replica를 두어 읽기와 장애 대응을 처리할 수 있습니다. 다만 운영 복잡도도 함께 증가하므로 실제 병목을 확인한 뒤 단계적으로 도입해야 합니다.

## 출처 및 참고자료

- [Overview of Partitioning in MySQL - MySQL 8.4 Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/partitioning-overview.html)
- [Partition Pruning - MySQL 8.4 Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/partitioning-pruning.html)
- [Using Oracle Sharding - Oracle Database Documentation](https://docs.oracle.com/en/database/oracle/oracle-database/21/shard/oracle-globally-distributed-ai-database-guide.pdf)
- [Replication - MySQL 8.4 Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/replication.html)
- https://www.youtube.com/watch?v=P7LqaEO-nGU&list=PLcXyemr8ZeoREWGhhZi5FZs6cvymjIBVe&index=26