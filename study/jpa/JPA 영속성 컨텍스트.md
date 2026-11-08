---
date: 2026-11-04
tags:
  - JPA
aliases:
  - 영속성 컨텍스트
  - Persistence Context
---
JPA에서 엔티티를 영구적으로 저장하고 관리하는 논리적인 메모리 공간이다.  

- `EntityManagerFactory`가 **요청마다 EntityManager를 생성**
- `EntityManager`는 내부적으로 DB Connection을 사용

```mermaid
flowchart LR
    R1["요청 1"]
    R2["요청 2"]

    subgraph APP["웹 애플리케이션"]
        direction TB
        EMF(["EntityManagerFactory"])
        EM1(["EntityManager 1"])
        EM2(["EntityManager 2"])

        EMF -. 생성 .-> EM1
        EMF -. 생성 .-> EM2
    end

    subgraph POOL["커넥션 풀"]
        direction TB
        C1(["Connection 1"])
        C2(["Connection 2"])
        C3(["Connection 3"])
    end

    DB[("Database")]

    R1 --> EM1
    R2 --> EM2

    EM1 -. 필요 시 사용 .-> C1
    EM2 -. 필요 시 사용 .-> C3

    C1 --- DB
    C2 --- DB
    C3 --- DB
```

## 사용 이점

 - 1차 캐시
 - 동일성 보장
 - 트랜잭션을 지원하는 [[JPA 쓰기 지연|쓰기 지연]] (transactional write-behind)
 - [[JPA 변경 감지|변경 감지]](Dirty Checking)
 - 지연 로딩(Lazy Loading)

## 엔티티 생명주기

![[IMG-20261108222116415.png|515]]

- **비영속(Transient)**: 객체를 생성했지만 아직 영속성 컨텍스트가 관리하지 않는 상태입니다.
- **영속(Managed)**: `persist()`로 저장하거나 조회하여 영속성 컨텍스트가 관리하는 상태입니다. 변경 감지와 1차 캐시의 대상이 됩니다.
- **준영속(Detached)**: 한때 영속 상태였지만 `detach()`, `clear()`, `close()` 등으로 영속성 컨텍스트의 관리를 벗어난 상태입니다. 값을 변경해도 변경 감지가 동작하지 않습니다.
- **삭제(Removed)**: `remove()`가 호출되어 삭제 대상으로 관리되는 상태입니다. 실제 DELETE SQL은 보통 플러시 시점에 실행됩니다.

### fulsh

플러시(`flush()`)는 영속성 컨텍스트의 변경 내용을 데이터베이스에 반영하는 기능

플러시가 실행되면 아래와 같은 과정이 일어난다.

1. 변경 감지가 동작해서 영속성 컨텍스트 안에 있는 모든 엔티티를 스냅샷과 비교한다.
2. 수정된 엔티티가 있으면 수정 쿼리를 만들어 쓰기 지연 SQL 저장소에 등록한다.
3. 이후 `commit()` 이 호출되면, 쓰기 지연 SQL 저장소의 모든 쿼리가 데이터베이스에 전송된다.

#### flush 호출 방식

- **직접 호출** : 엔티티 매니저의 `flush()` 메서드를 직접 호출해서 영속성 컨텍스트를 강제로 플러시한다.
- **트랜잭션 커밋 시 플러시 자동 호출** : 트랜잭션이 커밋되기 전에 JPA는 영속성 컨텍스트의 변경 내용을 데이터베이스에 반영하기 위해 플러시를 자동으로 호출한다.
- **JPQL 쿼리 실행 시 플러시 자동 호출** : 데이터베이스에 JPQL 쿼리를 직접 작성해서 날릴 때도 플러시가 자동 실행된다.

## 출처 및 참고자료

```cardlink
url: https://bnzn2426.tistory.com/145
title: "[JPA] 영속성 컨텍스트(persistence context) 개요 및 특징(feat. Dirty Checking, flush())"
description: "Goals영속성 컨텍스트란?엔티티 생명 주기영속성 컨텐스트의 이점영속성 컨텍스트란?JPA를 이해하는데 가장 중요한 용어는 영속성 컨텍스트(persistence context)다. 우리말로 해석해 보면 ‘엔티티를 영구 저장하는 환경’이라는 뜻이다. JPA를 사용해 엔티티(객체)를 데이터베이스에 저장하기 전에 항상 이 영속성 컨텍스트라는 곳에 먼저 저장해야 한다. 다만, 영속성 컨텍스트에 엔티티를 저장한다고 해서 데이터베이스에 저장되는 것은 아니다. 그럼에도 엔티티를 굳이 영속성 컨텍스트에 먼저 저장하는 이유는 다양한 이점이 있는데, 이는 뒤에서 설명하겠다.엔티티 매니저(EntityManager)로 엔티티를 저장하거나 조회하면 엔티티 매니저는 영속성 컨텍스트에 엔티티를 보관하고 관리할 수 있게 된다. 일반적.."
host: bnzn2426.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FImjWR%2Fbtsey61kRgq%2FAAAAAAAAAAAAAAAAAAAAACoE_ED9z4OiuNNq0rFZqUbgI-zz3JNfpKbXg2TCOIZ3%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1796050799%26allow_ip%3D%26allow_referer%3D%26signature%3DIIl82y3Uso0nHjuwpIeKYiuiAhY%253D
```
