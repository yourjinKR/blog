---
date: 2026-10-01
tags:
  - DB
aliases:
  - 레플리케이션
---
두 개 이상의 DBMS 이용하여 Master/Slave (수직적)구조를 활용하여 DB의 부하를 분산 시키는 기술 입니다.

쓰기 작업이 허용되는 Master DB를 기준으로 이를 복사하여 읽기 권한만 지닌 Slave DB를 수직적으로 확장하여 사용합니다.   

## 복제 동작 과정

1. Commit 발생
2. Connection Thread에서 스토리지 엔진에게 해당 트랜잭션에 대한 Prepare(Commit 준비)를 수행
3. Commit을 수행하기 전에 먼저 Binary Log에 변경사항을 기록
4. 스토리지 엔진에게 트랜잭션 Commit을 수행하도록 한다.
5. Master Thread는 시간에 구애받지 않고 (비동기적으로) Binary Log를 읽어서 Slave로 전송
6. Slave의 I/O Thread는 Master로부터 수신산 변경 데이터를 Relay Log에 기록
7. Slave의 SQL Thread는 Relay Log에 기록된 변경 데이터를 읽어서 Slave의 스토리지 엔진에 적용

## 동기/비동기 복제 방식

Replication은 동기 복제보다 비동기 복제 방식을 주로 사용한다. 
동기 복제는 Primary가 데이터를 변경할 때 Replica까지 반영되었다는 응답을 받아야 트랜잭션을 완료한다.  
그렇기에 쓰기 지연이 발생하며 Replica가 멀리 있거나 순간적으로 느려지면 Primary의 쓰기 성능까지 같이 느려지는 문제가 발생한다.  

Primary가 자신의 저장소에 커밋하면 바로 클라이언트에게 응답하고, Replica에는 이후에 변경사항을 전달한다.  

- **쓰기 성능이 좋음**
    - Replica의 처리 완료를 기다리지 않음
    - 네트워크 지연이 쓰기 요청에 직접 영향을 주지 않음
- Replica 장애가 Primary에 미치는 영향이 작음
    - Replica 한 대가 느려지거나 장애가 나더라도 Primary는 계속 쓰기 가능
    - 동기 복제라면 Replica ACK를 기다리면서 서비스 전체 쓰기가 지연될 수 있음
- Replica를 여러 대 운영하기 쉬움
    - Read Replica를 여러 개 두고 조회 부하 분산 가능
    - 모든 Replica의 완료를 기다릴 필요가 없음

그러나 Replication Lag라는 문제가 발생한다.  

## Replication Lag



## 출처 및 참고자료


```cardlink
url: https://velog.io/@zpswl45/DB-Replication-%EA%B0%9C%EB%85%90-%EC%A0%95%EB%A6%AC
title: "[DB] Replication이란 무엇이고 장점과 한계점 정리"
description: "이번 포스팅에서는 저희 회사에서 아주 잘 사용하고 있는 AWS Aurora를 이해하기 위한 첫번째 포스팅 입니다. 우선 AWS Aurora를 이해하기 위해선 DB Replication에 대한 이해가 먼저라고 생각했기 때문에 첫 번째 포스팅은 Replication을 이해"
host: velog.io
favicon: https://static.velog.io/favicons/favicon-32x32.png
image: https://velog.velcdn.com/images/zpswl45/post/1dfdb015-9b91-4258-91e7-20c59a36d04b/Screen%20Shot%202021-12-26%20at%201.14.23%20AM.png
```

```cardlink
url: https://seongonion.tistory.com/173
title: "Replication Lag 해결전략 정리하기!"
description: "Replication Lag?현대 많은 대규모 서비스들에선 단일 장애 포인트를 없애고 서비스에 일관된 수준의 빠른 응답을 보장하기 위해 데이터베이스를 Master-Slave 구조의 Replication 형태로 구축한다.서비스에서 발생하는 모든 데이터 변경 작업(CUD)을 Master 데이터베이스에서 처리하도록 하고, 처리완료된 데이터를 Slave 데이터베이스들에 싱크하는 구조이다. 위와 같은 구조를 통해 Master 데이터베이스 장애 시 Slave 데이터베이스를 통한 Failover 전략을 가능하게 하고, Slave 데이터베이스의 Scale Out을 통해 서비스 쿼리의 대부분을 차지하는 조회 작업을 일관된 품질로 제공할 수 있도록 해준다. 그러나 동시에 데이터의 일관성이 깨지는 케이스가 발생하기도 하는데.."
host: seongonion.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Ftistory_admin%2Fstatic%2Fimages%2FopenGraph%2Fopengraph.png
```
