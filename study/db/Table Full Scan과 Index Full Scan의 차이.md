---
date: 2026-11-25
tags:
  - 면접
  - DB
---
Table Full Scan과 Index Full Scan 모두 전체 탐색이라는 공통점이 있지만, 읽는 데이터의 크기와 접근 방식, 추가적인 테이블 접근 여부에서 차이가 발생한다.  

## Table Full Scan

테이블에 저장된 데이터 블록 전체를 읽으면서 조건에 일치하는 데이터를 찾는 방식이다.  

- 테이블의 실제 데이터를 직접 읽는다.
- 별도의 인덱스 탐색 과정이 없다.
- 순차적인 블록 읽기를 활용하기 유리하다.
- 전체 데이터 중 상당히 많은 데이터를 조회할 때 효율적일 수 있다.

> Table Full Scan이 무조건적으로 나쁜 것은 아니다.  

## Index Full Scan

[[DB Index|인덱스]]의 전체 범위를 탐색하는 방식이다. 일반적인 [[B+Tree]] 인덱스에서는 리프 노드를 순서대로 탐색한다.  

- 테이블보다 상대적으로 작은 인덱스를 읽을 수 있다.
- 인덱스의 정렬 순서를 활용할 수 있다.
- 인덱스에 필요한 데이터가 모두 있다면 테이블 접근을 줄이거나 생략할 수 있다.
- 인덱스에 없는 컬럼이 필요하다면 추가적인 테이블 접근이 발생할 수 있다.

## 항상 Index Full Scan의 성능이 좋은가?

항상 그렇지 않으며 아래 상황을 보고  이해하자.  

`age` 컬럼에 대한 인덱스가 있고 데이터 수가 테이블 크기와 차이가 있을 때 다음과 같은 쿼리를 실행한다고 가정

> `age = null`인 데이터가 많은 상황

```sql
SELECT *
FROM member
ORDER BY age;
```

- Index Full Scan을 사용하면 `age` 인덱스에 존재하지 않는 컬럼을 조회하기 위해 실제 테이블에 추가로 접근
- 대량의 Random I/O가 발생한다면 오히려 Table Full Scan 이후 정렬하는 방식이 더 효율적일 수 있다
- 따라서 옵티마이저는 각 접근 방식의 예상 비용을 비교하여 실행 계획을 결정

## 스캔 방식 총정리

- **Table Full Scan:** 테이블의 전체 데이터 블록을 탐색하는 방식.
- **Index Full Scan:** 인덱스의 전체 리프 노드를 키 순서대로 탐색하는 방식.
- **Index Range Scan:** 인덱스에서 조건에 해당하는 범위만 탐색하는 방식.
- **Index Fast Full Scan:** 정렬 순서와 관계없이 인덱스 블록 전체를 읽는 방식(Oracle).

### DBMS별 Scan 유형 비교

| 개념             | Oracle                     | MySQL                       | H2                     | PostgreSQL                               |
| -------------- | -------------------------- | --------------------------- | ---------------------- | ---------------------------------------- |
| 테이블 전체 탐색      | Table Full Scan            | `ALL`                       | `tableScan`            | `Seq Scan`                               |
| 인덱스 전체 탐색      | Index Full Scan            | `index`                     | 검색 범위 없는 인덱스 탐색        | `Index Scan`, `Index Only Scan`          |
| 인덱스 범위 탐색      | Index Range Scan           | `range`                     | 검색 범위를 제한하는 인덱스 탐색     | `Index Scan`, `Index Only Scan`          |
| 비고유 키 동등 조건 탐색 | Index Range Scan           | `ref`                       | 인덱스 동등 조건 탐색           | `Index Scan`, `Index Only Scan`          |
| 유일한 키 탐색       | Index Unique Scan          | `const`, `eq_ref`           | PK·Unique 인덱스 동등 조건 탐색 | `Index Scan`, `Index Only Scan`          |
| 인덱스만으로 조회      | 여러 인덱스 스캔 방식에서 가능          | `Using index`               | 인덱스에 포함된 컬럼만 읽기        | `Index Only Scan`                        |
| 인덱스 건너뛰기 탐색    | Index Skip Scan            | `Using index for skip scan` | 직접 대응 없음               | B-Tree Skip Scan (18 이상)                 |
| 비트맵 기반 탐색      | Bitmap 관련 연산               | 직접 대응 없음                    | 직접 대응 없음               | `Bitmap Index Scan` + `Bitmap Heap Scan` |
| 다중 인덱스 결합      | Index Merge 및 Bitmap 관련 연산 | `index_merge`               | 일반적인 직접 대응 없음          | `BitmapAnd`, `BitmapOr`                  |
| 병렬 전체 탐색       | Parallel Table Full Scan   | 제한적인 병렬 읽기 지원               | 직접 대응 없음               | `Parallel Seq Scan`                      |

## 출처 및 참고자료

```cardlink
url: https://hoon93.tistory.com/53
title: "[Oracle] 인덱스 스캔(Index Scan)과 Full Table Scan"
description: "전체 테이블 스캔(Full Table Scan)1) 테이블에 존재하는 모든 데이터를 읽어 가면서 조건에 맞으면 결과로서 추출하고 조건에 맞지 않으면 버리는 방식이다. 2) Oracle의 경우, 테이블의 고수위 마크(HWM, High Water Mark) 아래의 모든 블록을 읽는다.※고수위 마크(HWM): 테이블에 데이터가 쓰여졌던 블록 상의 최상위 위치(현재는 지워져서 데이터가 존재하지 않을 수도 있음)를 의미. 3) 위 그림과 같이 일반적으로 블록들은 서로 인접되어 있기 때문에, Full Table Scan는 한 번의 I/O에 여러 블록을 옮겨온다. 즉, 한 번의 I/O에 데이터를 다중 블록 단위로 메모리에 가져오기 때문에, Row 당 소요되는 입출력 비용이 인덱스 스캔에 비해 적다. 메모리에 옮겨진 .."
host: hoon93.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F999D97455FD318D628
```

```cardlink
url: https://mondaymonday2.tistory.com/808#google_vignette
title: "[Database] 테이블 스캔 종류 (FULL TABLE SCAN, ROWID SCAN, INDEX SCAN, INDEX UNIQUE SCAN, INDEX RANGE SCAN, INDEX RANGE SCAN DESCENDING, INDEX SKIP SCAN, INDEX FULL SCAN, INDEX FAST FULL SCAN)"
description: "📝Table Scan 종류FULL TABLE SCAN (MySQL, Oracle)SELECT * FROM employees;테이블 전체 데이터를 읽어 조건에 맞는 데이터를 추출하는 방식실제 물리적으로 저장된 순차적으로 접근합니다. (인덱스에 비해 랜덤 I/O가 없기 때문에 풀스캔엔 빠름) ROWID SCAN (Oracle)SELECT * FROM employees WHERE ROWID = 'AAAX12AADAAAABzAAA';ROWID기준으로 데이터를 추출하는 방식으로 단일행 접근시 가장 빠르다 INDEX SCAN (MySQL, Oracle)원하는 데이터 추출을 위해 인덱스를 사용하여 검색하는 방식 INDEX UNIQUE SCAN (MySQL, Oracle)INDEX (employee_id)SELECT.."
host: mondaymonday2.tistory.com
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fdc6WOp%2FbtskUMmDwLi%2FAAAAAAAAAAAAAAAAAAAAACOeT3AOsNqn-Qnd3s90JICuZroLU8gfeLLlW3zDsKsl%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1796050799%26allow_ip%3D%26allow_referer%3D%26signature%3D6nFE05vvyQsvkOFmyKmr250XJ3A%253D
```

```cardlink
url: https://ksh-coding.tistory.com/159
title: "[PostgreSQL] 2. PostgreSQL Index 알아보기 (Index Type, Index Scan)"
description: "0. 들어가기 전이전 챕터에서 PostgreSQL의 Internal, 내부 구조에 대해서 간략하게 살펴봤습니다. 이번에는 PostgreSQL에는 어떤 Index Type이 있는지, Index Scan은 어떤 것이 있는지 살펴보겠습니다.Index는 깊게 들어가면 너무나 어려운 내용이라서 간략하게만 다뤄보도록 하겠습니다 :(('PostgreSQL'의 Index에 대해서 알아보는 것이기 때문에, 기본 Index에 관한 개념은 알고 있다고 가정하고 다루지 않겠습니다!) PostgreSQL의 Index를 공부하면서 목표로 한 점은 다음과 같습니다.여러 PostgreSQL Index Type의 동작방식, 내부 원리를 설명할 수 있다.여러 PostgreSQL 타입, 상황에 대해 어떤 Index를 적용할지 떠올릴 수 .."
host: ksh-coding.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbhO2G2%2FbtsKDRiYHhf%2FAAAAAAAAAAAAAAAAAAAAAHeDW-rSECAMXpNHDID44M5-CKWqrIQdR5gQ6Jkb2eD8%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1796050799%26allow_ip%3D%26allow_referer%3D%26signature%3DEfdv1X4iPnJ6XSOst8vmdu2HNXE%253D
```

```cardlink
url: https://postgrespro.com/community/books/internals
title: "PostgreSQL 14 Internals"
description: "Postgres Professional is a PostgreSQL company delivering Postgres Pro DBMS and all kinds of PostgreSQL professional services worldwide"
host: postgrespro.com
image: https://postgrespro.com/img/logo2.png
```
