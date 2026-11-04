---
date: 2025-11-04
tags:
  - JPA
---
Hibernate는 내부적으로 `ActionQueue`를 사용하여 엔티티의 변경 작업을 관리한다.  

## ActionQueue의 실행순서

SQL 문이 실행되는 순서는 이전에 정의된 엔티티 상태 연산의 순서가 아니라 ActionQueue에 의해 지정된다.  
그렇기에 Hibernate는 작업을 등록한 순서와 실제 SQL 실행 순서가 다를 수 있다.  

ActionQueue는 아래와 같은 순서로 쿼리를 수행한다.  

1. `OrphanRemovalAction`: 고아 객체 제거
2. `EntityInsertAction` or `EntityIdentityInsertAction`: 엔티티 삽입
3. `EntityUpdateAction`: 엔티티 수정
4. Collection Action: 컬렉션 관련 작업
	1. `QueuedOperationCollectionAction`
	2. `CollectionRemoveAction`
	3. `CollectionUpdateAction`  
	4. `CollectionRecreateAction`  
5. `EntityDeleteAction`: 엔티티 삭제

> [!CAUTION]
> 위 순서는 Hibernate가 `flush()` 과정에서 ActionQueue에 등록된 작업들을 실행하는 순서이다. 모든 SQL이 반드시 이 순서를 따르는 것은 아니다. 예를 들어 IDENTITY 전략에서는 INSERT가 `persist()` 시점에 즉시 실행될 수 있다.

%%%%
### Collection Action

JPA가 관리하는 연관관계 컬렉션 또는 값 타입 컬렉션의 변경 사항을 DB에 반영하기 위한 작업이다.

- `QueuedOperationCollectionAction`: 초기화되지 않은 컬렉션에 대기 중인 작업 처리
- `CollectionRemoveAction`: 컬렉션에 대응하는 DB 데이터 제거
- `CollectionUpdateAction`: 기존 컬렉션의 변경 사항 반영
- `CollectionRecreateAction`: 컬렉션의 DB 데이터 생성 또는 재생성
	- 단, 실제 SQL은 컬렉션 매핑 방식과 연관관계의 주인에 따라 달라진다.

## 기타 사항

### 모든 Action들이 곧바로 ActionQueue에 등록되는 것은 아니다

```java
Member member = em.find(Member.class, 1L);

member.setName("newName");

// 이 시점에 EntityUpdateAction이 반드시 생성되는 것은 아님

em.flush();

// Dirty Checking으로 변경 감지
// EntityUpdateAction 생성 및 실행
```


## 출처 및 참고자료

```cardlink
url: https://docs.hibernate.org/orm/7.2/userguide/html_single/#flushing-order
title: "Hibernate ORM User Guide"
description: "Hibernate ORM, relational persistence for idiomatic Java"
host: docs.hibernate.org
```

```cardlink
url: https://junuuu.tistory.com/1029
title: "하이버네이트 flush 순서에 주의하자"
description: "대상독자하이버네이트 동작원리를 잘 모르고 사용했을 때 어떤 일이 발생할 수 있는지 궁금하신 분들   개요애플리케이션을 개발하던 중 하이버네이트의 동작원리를 잘 몰랐기 때문에 버그가 발생하게 되었습니다. 하이버네이트의 동작원리를 알아보면서 버그를 재현해보고 어떻게 해결할 수 있는지 정리해보고자 합니다.   하이버네이트란?하이버네이트(Hibernate)는 자바 애플리케이션과 관계형 데이터베이스 간의 상호작용을 간소화하기 위한 객체-관계 매핑(ORM) 도구입니다. 자바 클래스와 데이터베이스 테이블을 매핑하여, 자바 객체를 데이터베이스의 레코드로 변환하고 그 반대의 작업도 처리합니다. 이를 통해 개발자는 직접 SQL 코드를 작성할 필요 없이 데이터베이스와의 복잡한 상호작용을 처리할 수 있습니다. 하이버네이트를 .."
host: junuuu.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fb8j7KI%2FbtsKcSXmVAE%2FAAAAAAAAAAAAAAAAAAAAAJKHu1DdmrirR6qzwBHW6l7xlevi9SobCRCmSp-KjJ7h%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1796050799%26allow_ip%3D%26allow_referer%3D%26signature%3DrjxZPnluecki2idlI5wS3Y%252FWisY%253D
```
