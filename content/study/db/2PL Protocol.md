---
tags:
  - DB
---
## 2PL Protocol

데이터베이스에서 트랜잭션의 **Serializability를 보장**하기 위해 [[Lock|락]]의 획득과 해제 연산을 두 단계로 나누어 수행하는 비관적 동시성 제어(Concurrency Control) 기법

- 락만으로 이상 현상을 방지 할 수는 없다.  
- 트랜잭션에서 Locking Operation이 최초의 Unlock Operation보다 먼저 수행되도록 한다.

> [!CAUTION]
> 특정 상황에서 데드락이 발생할 수 있다.

%%%%
### Expanding Phase

Lock을 취득하기만 하고 반환하지 않는 페이즈

## Shrinking Phase

Lock을 반환만 하고 취득하지는 않는 페이즈

## 종류

### Conservative 2PL

- 모든 Lock을 취득한 뒤 트랜잭션을 시작
- deadlock-free
- 실용적이지 않다

![[Pasted image 20260827162409.png]]

#### 데드락이 발생하지 않는 이유

Conservative 2PL은 트랜잭션 시작 전에 필요한 모든 Lock을 미리 획득합니다. 하나라도 획득할 수 없으면 현재 아무 Lock도 보유하지 않은 상태에서 기다리기 때문에 Hold-and-Wait 조건이 성립하지 않습니다. 따라서 트랜잭션 간 Circular Wait가 형성될 수 없어 deadlock-free입니다.

### Strict 2PL

- Strict Schedule을 보장하는 2PL
- Recoverability 보장
- write-lock을 commit/rollback 될 때 반환

![[Pasted image 20260827162643.png]]

### Strong Strict 2PL

- Strict Schedule를 보장하는 2PL
- Recoverability 보장
- r**ead/write-lock 모두 commit/rollback 될 때 반환**