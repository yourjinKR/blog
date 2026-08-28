---
tags:
  - DB
---
데이터베이스 [[Transaction|트랜잭션]]이 지켜야 할 성질로, 원자성, 일관성, 격리성, 지속성을 의미한다.  
## Atomicity

원자성(`Atomicity`)은 **트랜잭션이 완전히 수행되거나 전혀 수행되지 않아야 함**을 의미한다.  

즉, 트랜잭션의 모든 작업이 성공해야만 데이터베이스의 상태가 변경되고, 하나라도 실패할 경우 모든 작업이 롤백된다. 이를 통해 데이터 손실이나 불일치를 방지할 수 있다.

- ALL or NOTHING
- 논리적으로 쪼개질 수 없는 작업 단위이기에 내부의 SQL문들이 모두 성공해야 한다.
- 중간에 SQL문이 실패하면 지금까지의 작업을 모두 취소해야 한다. (rollback)

```sql
start transaction;  
update members set nickname = '닉네임이 변경됩니다1.' where id = 1;  
update members set nickname = '닉네임이 변경됩니다2.' where id = 2;  
commit;
```

## Consistency

일관성(`Consistency`)은 트랜잭션이 **데이터베이스의 상태를 항상 일관되게 유지**해야 함을 의미한다.  

트랜잭션 수행 전후에 데이터는 비즈니스 규칙과 제약 조건을 충족한다.  
이를 통해 데이터의 신뢰성을 높이고, 무결성을 유지할 수 있다

- constraints, trigger 등을 통해 DB에 정의된 rules을 transaction이 위반했다면 rollback
- DB에 정의된 rule을 위반했는지 DBMS가 commit하기 전에 확인
- 그럼에도 불구하고 개발자는 application 관점에서 트랜잭션이 일관적으로 동작하는지 확인 필요

## Isolation

고립성(`Isolation`)은 **동시에 실행되는 트랜잭션이 서로의 영향을 받지 않아야 함을 의미**한다.  

각 트랜잭션은 독립적으로 처리되며, 다른 트랜잭션이 완료될 때까지 보이지 않아야 한다.  
이를 통해 동시성 문제를 해결하고, 데이터의 무결성을 보장할 수 있다.

![[Pasted image 20260827001918.png]]
https://www.youtube.com/watch?v=sLJ8ypeHGlM&t=806s

> 1. J가 H에게 20만원을 입금한다. (`1번 트랜잭션 시작`)
> 2. H는 200만원이 있으며 자신의 계좌에 30만원을 입금한다. (`2번 트랜잭션 시작`)
> 3. 이전 잔액에서 30만원을 더한 230만원을 현재 잔액으로 설정한다. (`2번 트랜잭션 종료`)
> 4. `1번 트랜잭션`은 시작 당시 잔액이 200만원이었기에 20만원을 더한 220만원을 잔액으로 설정한다.
> 5. 결과론적으로 30만원을 입금했던 트랜잭션이 무시된다.

- 여러 트랜잭션들이 동시에 실행될 때 혼자 실행하는 것처럼 만들어야 한다.
- DBMS는 여러 종류의 isolation level를 제공한다.
- isolation level를 엄격하게 설정시 DB의 성능이 저하된다.

## Durability

지속성(`Durability`)은 트랜잭션이 성공적으로 완료되면, 그 결과가 영구적으로 저장되어야 함을 의미합니다. 

시스템이 다운되거나 오류가 발생해도 완료된 트랜잭션의 결과는 보존되어야 합니다.  
이를 통해 데이터의 안정성을 확보할 수 있습니다.

- commit된 트랜잭션은 DB에 영구적으로 저장한다.
- 기본적으로 트랜잭션의 Durability는 DBMS가 보장한다.

> 이미 커밋된 트랜잭션은 롤백할 수 없다.  

## 출처 및 참고자료

https://www.youtube.com/watch?v=sLJ8ypeHGlM&list=PLcXyemr8ZeoREWGhhZi5FZs6cvymjIBVe&index=14  