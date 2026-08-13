---
tags:
  - 면접
  - 스터디
  - JPA
---
Fetch Join은 JPQL에서 연관된 엔티티나 컬렉션을 한 번의 SQL로 함께 조회하기 위한 기능입니다. `join fetch` 구문을 사용하며, 조회한 연관관계를 영속성 컨텍스트에 함께 적재하고 로딩이 완료된 상태로 만듭니다.

```jpql
select distinct t
from Team t
join fetch t.members
```

일반 Join은 조인한 대상을 조건이나 정렬에 활용하는 것이 주목적이며, 조회 대상에 명시하지 않은 연관관계까지 초기화해 주지는 않습니다. 따라서 SQL에 JOIN이 있더라도 이후 연관관계에 접근할 때 추가 쿼리가 실행될 수 있습니다. 반면 Fetch Join은 연관 엔티티를 함께 조회하는 것이 목적이므로 N+1 문제를 해결할 때 자주 사용합니다.

다만 일대다 컬렉션을 Fetch Join하면 SQL 결과에서 부모 행이 자식 수만큼 중복될 수 있습니다. JPQL의 `distinct`로 결과 목록의 부모 엔티티 중복을 제거할 수 있지만, 컬렉션 Fetch Join과 페이징을 함께 사용하거나 여러 컬렉션을 동시에 Fetch Join하는 것은 데이터 증가와 예외 가능성 때문에 주의해야 합니다.

> [!QUESTION]- Fetch Join에서 `distinct`를 사용하는 이유는 무엇인가요?
> 일대다 조인에서는 자식 수만큼 같은 부모 엔티티가 결과 목록에 중복될 수 있기 때문입니다. `distinct`를 사용하면 SQL 수준의 중복 제거와 함께 JPA 구현체가 같은 식별자의 엔티티 중복을 제거하여 반환할 수 있습니다.

> [!QUESTION]- Fetch Join은 언제나 일반 Join보다 좋은가요?
> 아닙니다. 연관 데이터를 실제로 사용할 때만 유리합니다. 필요하지 않은 대량의 컬렉션까지 함께 조회하면 전송량과 메모리 사용이 커지므로, 조회 화면에 필요한 연관관계만 선택해야 합니다.

> [!QUESTION]- 둘 이상의 컬렉션을 동시에 Fetch Join하면 어떤 문제가 있나요?
> 두 컬렉션의 행이 곱해지는 카테시안 곱으로 결과가 크게 증가할 수 있습니다. Hibernate에서는 여러 List 형태의 컬렉션을 동시에 Fetch Join할 때 `MultipleBagFetchException`이 발생할 수도 있으므로, 하나만 Fetch Join하고 나머지는 Batch Fetching 등으로 조회하는 것이 일반적입니다.
