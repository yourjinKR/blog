---
tags:
  - DB
aliases:
  - Schedule
  - 스케줄
---
## Schedule

여러 [[Transaction|트랜잭션]]들이 동시에 실행될 때 각 트랜잭션에 속한 오퍼레이션들의 실행 순서

![[Pasted image 20260827015337.png|375]]

- 각 트랜잭션 내의 오퍼레이션들의 순서는 바뀌지 않는다.  
- 스케줄은 크게 [[#Serial Schedule]]과 [[#Nonserial Schedule]]로 나뉜다.  
- 성능과 정확성을 동시에 챙기기 위해 Serial Schedule과 동일한 Nonserial Schedule를 찾는다.
	- **Conflict Equivalent**: 대표적으로 Conflict Serializable한 Nonserial Schedule를 허용
	- **View Equivalent**

> 여러 트랜잭션을 동시에 실행해도 Schedule이 Conflict Serializable하도록 보장하는 프로토콜을 적용한다.  

## Serial Schedule

트랜잭션들이 겹치지 않고 한번에 하나씩 실행되는 스케줄을 말한다

> 한번의 하나의 트랜잭션만 실행되기 때문에 좋은 성능을 낼 수 없고 현실적으로 사용할 수 없는 방식이다.  

## Nonserial Schedule

여러 트랜잭션들이 겹쳐서 동시에 실행되는 스케줄을 말한다.  

> 여러 트랜잭션들이 겹처서 실행되기 때문에 동시성이 높아져서 같은 시간 동안 더 많은 트랜잭션들을 처리할 수 있다. 그러나 트랜잭션들이 어떤 형태로 겹쳐서 실행되는지에 따라 이상한 결과가 발생할 수 있다.  

## Conflict

두개의 오퍼레이션이 아래 세가지 조건을 모두 만족하면 Conflict라고 부른다.

1. 서로 다른 트랜잭션에 소속된다.
2. 두 오퍼레이션이 같은 데이터에 접근한다.
3. 오퍼레이션 중 최소 하나는 write operation이어야 한다.

> Confilct Operation은 순서가 바뀌면 결과도 바뀐다.  

### Conflict Equivalent

두개의 스케줄이 아래 조건들을 모두 만족하면 Conflict Equivalent하다.  

1. 두 스케줄은 같은 트랜잭션들을 가진다.  
2. 어떤 Conflicting Operation의 순서도 양쪽 Schedule 모두 동일하다.  

![[Pasted image 20260827012219.png|387]]

## Conflict Serializable

Serial Schedule과 Conflict Equivalent인 Schedule를 말한다.  

> Nonserial Schedule 처럼 동시성을 챙기되 Serial Schedule과 결과값이 동일하여 이상현상이 적은 스케줄을 말한다.  

## Concurrency Control

스케줄에 대해 Serializability와 Recoverability를 보장한다.  

## Unrecoverable Schedule

커밋된 트랜잭션이 롤백된 트랜잭션이 write한 데이터를 읽은 경우의 스케줄을 말한다.  

- 롤백을 해도 이전 상태로 회복 불가능한 스케줄
- **해당 스케줄은 DBMS가 허용 불가**

### Recoverable 

의존하고 있는 트랜잭션이 있다면 해당 트랜잭션이 commit/rollback하기 전까지 commit하지 않는 경우를 말한다.  

### Cascading Rollback

하나의 트랜잭션이 롤백되면 해당 트랜잭션을 의존하는 트랜잭션 또한 롤백하는 것을 말한다.  

> 여러 트랜잭션의 롤백이 연쇄적으로 발생한다면 처리하는 비용이 증가된다.  
> 데이터를 write한 트랜잭션이 commit/rollback 한 뒤에 데이터를 읽는 스케줄만 허용한다면 정합성을 보장할 수 있으며 이를 Cascadeless Schedule이라고 한다.  

## Cascadeless Schedule

Schedule 내에서 어떤 트랜잭션도 commit되지 않은 트랜잭션들이 write한 데이터는 읽지 않는 것

> avoid cascading rollback라고 부르기도 한다.  

## Strict Schedule

Schedule 내에서 어떤 트랜잭션도 commit되지 않은 트랜잭션들이 write한 데이터는 **읽고 쓰지도 않는** 것

> 가장 엄격한 방식이다.  

## 출처 및 참고자료

https://www.youtube.com/watch?v=DwRN24nWbEc  