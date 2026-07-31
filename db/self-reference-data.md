---
title: 자기 참조 데이터와 이에 대한 관리 방법
---
- 개념설명
- 예시코드 (계층이 정해진 경우)
- 예시코드 (계층이 없는 경우)


# 재귀 관계

동일한 엔티티 집합에 속한 두 엔티티 간의 관계를 재귀적 관계 또는 반복적 관계라고 한다.  

- ER 다이어그램에서 재귀적 관계를 나타내기 위해 자체 조인(self-join)을 사용합니다. 자체 조인은 테이블과 자기 자신을 연결하는 것입니다.
- 셀프 조인은 동일한 엔티티의 두 인스턴스를 생성하고 관계를 통해 연결하는 것을 의미하며, 하나는 자식으로, 다른 하나는 부모로 간주됩니다.
- 계층 구조나 네트워크를 나타내는 데 자주 사용되며, 동일한 유형의 개체가 다른 개체와 연결될 수 있습니다.

## 재귀적 관계에서의 카디널리티

연관 관계에 참여할 수 있는 엔티티 인스턴스의 수를 지정하기 위해 [[db-basic-keyword#카디널리티(Cardinality)|카디널리티]] 제약 조건을 사용한다.  

![[Pasted image 20260607035228.png|309]]



## 예시 코드

여기 `region`이라는 테이블은 지역의 행정 구분을 정의한다.  

```sql
CREATE TABLE region (  
    id BIGSERIAL PRIMARY KEY,  
    name VARCHAR(50) NOT NULL,  
    scope INTEGER NOT NULL,  
    parents_id BIGINT,  
  
    CONSTRAINT fk_region_parent  
    FOREIGN KEY (parents_id)  
        REFERENCES region(id)  
        ON DELETE CASCADE  
);
```

계층이 정해져 있기에 depth 최대 깊이는 정해져 있다.  

```sql
select * from region where parents_id in (  
    select id from region where parents_id in (  
        select id from region where name = '경기도'  
    )  
);
```

## 출처 및 참고자료

https://www.geeksforgeeks.org/dbms/recursive-relationships-in-er-diagrams/  