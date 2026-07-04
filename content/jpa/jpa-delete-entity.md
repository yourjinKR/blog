---
title: JPA 엔티티 삭제 방식과 고려 사항
---
> 내부 코드는 `SimpleJpaRepository`에서 확인할 수 있습니다.  

## 대량의 데이터를 삭제할 때 

내부 코드를 보면 아시다시피 `deleteAllById()`와 `deleteAll()`메서드는  `delete()`를 반복 호출합니다.  
즉, 받은 인자의 수 만큼 삭제 메서드가 동작한다는 것입니다.  
많은 데이터를 한꺼번에 삭제할 경우에는 성능상에 문제가 생길 수 있습니다.

```java
@Override  
@Transactional  
public void deleteAllById(Iterable<? extends ID> ids) {  
  
    Assert.notNull(ids, IDS_MUST_NOT_BE_NULL);  
  
    for (ID id : ids) {  
       deleteById(id);  
    }  
}
```

```java
@Override  
@Transactional  
public void deleteAll(Iterable<? extends T> entities) {  
  
    Assert.notNull(entities, ENTITIES_MUST_NOT_BE_NULL);  
  
    for (T entity : entities) {  
       delete(entity);  
    }  
}
```

그렇기에 아래 2가지 방법으로 이 문제를 해결할 수 있습니다.  
### 1. batch 메서드 사용

아래 해당 batch 삭제 메서드들은 for문을 돌아 delete를 수행하지 않고 인자로 넘긴 데이터들을 묶어서 단일 쿼리로 만들어 데이터를 한번에 삭제합니다.  

![[Pasted image 20260705031941.png]]

```java
@Override
@Transactional
public void deleteAllByIdInBatch(Iterable<ID> ids) {

	Assert.notNull(ids, IDS_MUST_NOT_BE_NULL);

	if (!ids.iterator().hasNext()) {
		return;
	}

	if (entityInformation.hasCompositeId()) {

		List<T> entities = new ArrayList<>();
		// generate entity (proxies) without accessing the database.
		ids.forEach(id -> entities.add(getReferenceById(id)));
		deleteAllInBatch(entities);
	} else {

		String queryString = String.format(DELETE_ALL_QUERY_BY_ID_STRING, entityInformation.getEntityName(),
				entityInformation.getRequiredIdAttribute().getName());

		Query query = entityManager.createQuery(queryString);

		/*
		 * Some JPA providers require {@code ids} to be a {@link Collection} so we must convert if it's not already.
		 */
		Collection<ID> idCollection = toCollection(ids);
		query.setParameter("ids", idCollection);

		applyQueryHints(query);

		query.executeUpdate();
	}
}
```

```java
@Override  
@Transactional  
public void deleteAllInBatch(Iterable<T> entities) {  
  
    Assert.notNull(entities, ENTITIES_MUST_NOT_BE_NULL);  
  
    if (!entities.iterator().hasNext()) {  
       return;  
    }  
  
    applyAndBind(getQueryString(DELETE_ALL_QUERY_STRING, entityInformation.getEntityName()), entities, entityManager)  
          .executeUpdate();  
}
```

이 메서드들 역시 DB에 쿼리를 직접 실행하기 때문에 영속성 컨텍스트를 무시하며, 이로 인해 1차 캐시와 DB 간의 데이터 불일치가 발생할 수 있습니다. 이를 해소하기 위해 삭제 직후 영속성 컨텍스트를 수동으로 비워주거나(`entityManager.clear()`), 해당 트랜잭션 내에서는 지워진 데이터를 다시 참조하지 않도록 설계해야 합니다.

또한 `deleteAllByIdInBatch`는 지워야 할 ID가 너무 많을 경우 DB의 `IN` 절 파라미터 최대 허용 개수(예: Oracle 1,000개)를 초과해 에러가 발생할 수 있습니다. 이를 방지하려면 삭제할 ID 리스트를 500~1,000개 단위로 안전하게 쪼개서(Partition) 반복 호출해야 합니다.

마지막으로 엔티티를 메모리에 올리지 않고 삭제하므로 영속성 전이(`Cascade`), 고아 객체 제거, 소프트 딜리트(`@SQLDelete`), 콜백(`@PreRemove`) 기능이 모두 무시됩니다. 이러한 문제를 피하려면 자식 데이터를 먼저 삭제하는 배치 작업을 수행하거나 DB 레벨에서 `CASCADE`를 걸어두어야 하며, 소프트 딜리트가 필수인 데이터는 배치 삭제 대신 벌크 `UPDATE` 쿼리를 사용해야 합니다.

### 2. 벌크 연산

특정 조건을 기준으로 데이터를 한번에 삭제하는 작업을 수행한다고 했을 때는 JPQL를 활용하여 벌크 삭제를 할 수 있습니다.  

```java
@Modifying
@Query("DELETE FROM Member m WHERE m.age > :age")
void deleteOldMembers(@Param("age") int age);
```

벌크 연산은 DB 데이터를 바로 조작하기에 영속성 컨텍스트에 있는 엔티티들의 상태를 갱신하지 않습니다.  
이런 불일치를 해소하기 위해 `@Modifying(clearAutomatically = true)`을 추가하여 해당 문제를 방지할 수 있습니다.  

삭제한 엔티티가 자식 엔티티를 가지고 있을 경우에는 자식 데이터가 [[orphan-object|고아 데이터]]가 되거나 외래키 무결성 제약조건에 위배되어 에러가 발생할 수 있습니다. 이를 해결하기 위해서는 벌크 삭제를 자식, 부모 데이터를 각각 수행해야 하거나 DB에서 `CASCADE` 제약 조건을 추가하여 해결할 수 있습니다.  

## 출처 및 참고자료

https://aljjabaegi.tistory.com/681  
https://help.salesforce.com/s/articleView?id=001473236&type=1  