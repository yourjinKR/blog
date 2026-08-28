---
tags:
  - DB
aliases:
  - Lock
  - 락
---
> [!INFO]
> 해당 글은 MySQL InnoDB 환경을 기반으로 작성했습니다.  

여러 커넥션에서 동시에 동일한 자원을 요청할 경우 순서대로 하나의 커넥션만 변경할 수 있게 해주는 기능을 말합니다.

- 데이터 무결성 보장
- 동시성 제어

## Optimistic lock

충돌이 발생하지 않을 것이라고 가정하여 자원에 락을 걸지 않고 동시성 문제가 발생하면 그때 처리하는 방식이다. 낙관적 락은 수정할 때 수정했다고 명시하여 다른 트랜잭션이 동일한 조건으로 값을 수정할 수 없게 하는 것이다. 

```sql
UPDATE account
SET balance = 500, ver = 2
WHERE id = 1 and ver = 1;

-- 반환 Row Count가 0이면 실패, 재시도
```

- 애플리케이션 레벨에서 락을 사용하기에 성능이 빠르다.  
- 충돌 시 실패 후 재시도를 수행하기에 이에 따른 추가적인 구현이 필요하다.  
	- 재시도 횟수
	- 타임아웃
- 충돌이 드문 경우에 도입하는 락 전략이다.

## Pessimistic Lock

충돌이 자주 발생할 것이라고 가정하여 트랜잭션이 시작 될 때 공유락과 베타락을 거는 방식으로 Repeatable Read 또는 Serializable 정도의 격리성 수준을 제공한다.

```sql
SELECT * FROM account
WHERE id = 1
FOR UPDATE;

-- 트랜잭션 종료까지 대기
```

- DB 레벨에서 락을 사용하기에 성능이 느리다 (블로킹 현상 발생)
- 데이터의 충돌을 원천 차단하기에 비교적 안전하다.  
- 충돌이 잦은 경우 도입하는 락 전략이다.  

비관적 락 모드에는 대표적으로 공유 락과 베타 락이 있다.

### Shared Lock

> Shared Lock, Read Lock, 공유 락

트랜잭션이 읽기를 할 때 사용하는 락이다, 데이터를 읽기만하기 때문에 같은 공유락끼리는 동시에 접근이 가능하지만, **쓰기 작업**은 막는다.

```mysql
SELECT * FROM member WHERE id = 1 FOR SHARE;
```

### Exclusive Lock

> Exclusive Lock, X-Lock, 베타 락

Write Lock이라고도 불리며, 데이터를 변경할 때 사용하는 락이다. 트랜잭션이 완료될 때까지 유지되며, 배타락이 끝나기 전까지 read/write를 모두 막는다.

```mysql
SELECT * FROM member WHERE id = 1 FOR UPDATE;
```

## 한계점

- 읽기 작업과 쓰기 작업이 서로 방해를 일으키기 때문에 동시성 문제가 발생
- 데이터 일관성에 문제가 생기는 경우도 있어서 Lock을 더 오래 유지하거나 테이블 레벨의 Lock을 사용해야 하고, 동시성 저하가 발생

이러한 문제점들을 해결하기 위해 [[MVCC]]가 탄생하게 되었다.

## 출처 및 참고자료

https://www.youtube.com/watch?v=oJrVl6QKzHw  
https://mangkyu.tistory.com/53