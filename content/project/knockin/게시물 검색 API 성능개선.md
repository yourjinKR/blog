---
date: 2026-10-06
tags:
  - 노크인
---
1. **`EXPLAIN ANALYZE`로 실제 Full Scan 발생 위치 확인**
2. `keywordContains()`가 `%keyword%`인지 확인
3. `region -> parent -> grandParent` JOIN 제거 가능성 확인
4. COUNT 전용 쿼리에서 `roomType`, `region` 등 불필요한 JOIN 제거
5. `likedOnly`, `notBlockedBetween`을 `EXISTS / NOT EXISTS` 기반으로 검토
6. 검색 조건에 맞춰 `roommate_board` 복합 인덱스 설계
7. 최종적으로 **total count가 정말 필요한지 확인 → 가능하면 `Page` → `Slice`**

##  불필요한 count 연산 제거

게시물 목록 조회와 특히 count 쿼리에서 병목 발생한다.  

```cardlink
url: https://gist.github.com/yourjinKR/89f9b35f3756c8e902caf45d190d0f80
title: "노크인 게시물 조회 API 병목 지점"
description: "노크인 게시물 조회 API 병목 지점. GitHub Gist: instantly share code, notes, and snippets."
host: gist.github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://github.githubassets.com/assets/gist-og-image-54fd7dc0713e.png
```

COUNT 함수 자체가 병목이었던 것이 아니라, 다수의 JOIN과 동적 필터, EXISTS/NOT EXISTS 서브쿼리가 적용된 전체 결과 집합을 정확히 계산해야 했기 때문에 COUNT 쿼리의 비용이 데이터 증가에 따라 커졌다.  

```java
Long total = jpaQueryFactory
                .select(roommateBoard.count())
                .from(roommateBoard)
                .join(roommateBoard.roomType, roomType)
                .join(roommateBoard.region, boardRegion)
                .leftJoin(boardRegion.parent, parentRegion)
                .leftJoin(parentRegion.parent, grandParentRegion)
                .where(searchCondition) // 약 11가지의 조건 존재
                .fetchOne();
```

 특히 서비스 요구사항이 무한 스크롤이어서 전체 개수가 불필요했으므로 `Page`를 `Slice`로 변경해 COUNT 쿼리 자체를 제거했다.  
 
## 비용이 비싼 select

게시물 자체 목록 조회 쿼리가 느린 것을 확인할 수 있었다.   

```cardlink
url: https://gist.github.com/yourjinKR/60ef9d5bac7b063a8630f1734324fd29
title: "2026-10-07-노크인-게시물-조회-API-SQL"
description: "2026-10-07-노크인-게시물-조회-API-SQL. GitHub Gist: instantly share code, notes, and snippets."
host: gist.github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://github.githubassets.com/assets/gist-og-image-54fd7dc0713e.png
```

H2 콘솔에서는 웜웝 이후 30회 반복 실행하여 집계해보니 평균 응답속도는 약 420ms로 측정됐다.  

```sql
SET QUERY_STATISTICS TRUE;

SELECT
    SQL_STATEMENT,
    EXECUTION_COUNT,
    MIN_EXECUTION_TIME,
    MAX_EXECUTION_TIME,
    AVERAGE_EXECUTION_TIME,
    STD_DEV_EXECUTION_TIME,
    CUMULATIVE_EXECUTION_TIME
FROM INFORMATION_SCHEMA.QUERY_STATISTICS
WHERE SQL_STATEMENT LIKE '%roommate_board%'
ORDER BY AVERAGE_EXECUTION_TIME DESC;
```

![[IMG-20261007023248046.png]]

### 실행계획 측정

특정 쿼리의 지연을 DB 수준에서 파악했으니 [[노크인 게시물 검색 쿼리 실행 계획 분석|직접 실행계획을 보며 문제 지점을 파악]]했다.
[[노크인 게시물 검색 쿼리 실행 계획 분석#7. 차단 NOT EXISTS 추가|사용자 차단 여부]]를 확인하는 조건을 추가하자 응답속도가 평균 5ms → 400ms로 급증했다.  
차단 테이블(`BLOCK`)에서 풀스캔을 도는 것을 확인할 수 있었다.  

![[IMG-20261007025703959.png]]

### 복합 인덱스 추가

우선 `Block` 테이블에 인덱스가 있는지 확인했다.  

```sql
SELECT *
FROM INFORMATION_SCHEMA.INDEXES
WHERE TABLE_NAME = 'BLOCK';
```

![[IMG-20261007030959543.png]]

없었고, 복합 인덱스를 추가했다.  

```sql
CREATE INDEX idx_block_blocker_blocked_deleted
ON block (
    blocker_id,
    blocked_id,
    is_deleted
);
```

### OR 연산자 이슈

복합 인덱스를 추가했음에도 불구하고 여전히 성능에는 큰 변화가 없었다.  

![[IMG-20261007031506546.png]]

새로 추가한 복합 인덱스가 타고 있음에도 불구하고 여전히 full-scan이 동작하는 것이다.  

![[IMG-20261007031632493.png]]




![[IMG-20261007032100117.png]]

## 결론

> [!NOTE] 결론 요약 1
> 처음에는 Full Scan이 원인이라고 판단해 복합 인덱스를 추가했습니다. 그런데 실행계획상 인덱스 이름은 나타났지만
> `scanCount`가 1002로 그대로여서 실제 탐색 범위는 줄어들지 않았습니다. 원인을 더 좁혀보니 양방향 차단 관계를 
> 하나의 `OR` 조건으로 묶으면서 옵티마이저가 복합 인덱스를 효율적으로 사용하지 못하고 있었습니다. 이를 동일한 의미
> 의 두 `NOT EXISTS`로 분리하자 각각 `scanCount: 1`의 인덱스 탐색으로 변경됐고 응답시간도 크게 감소했습니다.

> [!NOTE] 결론 요약 2
> 양방향 차단 관계를 하나의 `NOT EXISTS` 내부에서 `OR`로 표현했더니 H2 옵티마이저가 이를 두 번의 복합 인덱스 탐
> 색으로 분리하지 못하고 넓은 인덱스 범위를 스캔했다. 이를 드모르간 법칙에 따라 두 개의 `NOT EXISTS`로 분리함으로
> 써 각 조건이 `(blocker_id, blocked_id, is_deleted)` 복합 인덱스의 명확한 검색 조건이 되었고, 
> `scanCount`가 약 1002에서 각 1건으로 감소했다.


![[IMG-20261007194508940.png]]

