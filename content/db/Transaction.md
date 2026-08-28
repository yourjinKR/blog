---
tags:
  - DB
aliases:
  - Transaction
  - 트랜잭션
---
- 데이터베이스에서 수행되는 작업의 논리적 단위이다.
- [[ACID]] 속성을 갖는다.
- MySQL과 Postgres는 `begin;`과 `commit;`으로 트랜잭션을 제어하며, 실패나 오류 시 `rollback;`으로 변경을 취소한다.
- 두 데이터베이스 모두 **일관된 읽기(consistent read)** 를 보장하지만, Postgres는 **다중 버전 행 저장(MVCC)** 을, MySQL은 **undo log**를 사용함

> [!INFO]
> 트랜잭션은 원자성, 일관성, 고립성 및 지속성(ACID) 속성을 가진 작업 그룹입니다. 트랜잭션을 지원하면 개발 프로세스를 간소화하고 애플리케이션을 더욱 강력하게 만들면서 새로운 유형의 애플리케이션을 개발할 수 있습니다. 이 항목의 나머지 부분에서는 이러한 속성의 필요성을 보여 주는 시나리오와 각 속성을 정의하는 테이블을 제공합니다.  
> 
> https://learn.microsoft.com/ko-kr/windows/win32/ktm/what-is-a-transaction

%%%%
## 출처 및 참고자료

https://news.hada.io/topic?id=26930  
https://learn.microsoft.com/ko-kr/windows/win32/ktm/what-is-a-transaction  