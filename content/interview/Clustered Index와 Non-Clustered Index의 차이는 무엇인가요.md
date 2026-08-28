---
tags:
  - 면접
  - 스터디
  - DB
  - 인덱스
---
> 클러스터링 인덱스는 pk에 적용되며, PK 값에 의해 레코드의 물리적 저장 위치가 결정됩니다.  
> 리프 노드에 레코드의 모든 컬럼이 저장됩니다.  
> 
> 비클러스터링 인덱스는 PK 외 컬럼에 적용되며, 리프 노드에 해당 레코드의 PK만 존재합니다.  
> 따라서 비클러스터링 인덱스로 검색하면 PK를 얻은 뒤, 다시 클러스터링 인덱스를 탐색해야 합니다.  

Clustered Index와 Non-Clustered Index의 구체적인 구현은 DBMS마다 다릅니다. MySQL InnoDB를 기준으로 Clustered Index는 리프 페이지에 행 데이터 자체를 저장하는 인덱스이고, Non-Clustered Index에 해당하는 Secondary Index는 인덱스 컬럼과 해당 행의 기본 키를 저장하는 별도의 인덱스입니다.

InnoDB는 테이블마다 하나의 Clustered Index를 가집니다. 일반적으로 기본 키를 사용하며, 기본 키가 없으면 모든 컬럼이 `NOT NULL`인 첫 번째 UNIQUE 인덱스를 사용합니다. 그것도 없으면 내부적으로 숨겨진 행 ID를 생성합니다. 기본 키로 조회하면 Clustered Index 탐색만으로 행 데이터에 접근할 수 있습니다.

Secondary Index로 조회할 때는 먼저 Secondary Index에서 기본 키를 찾은 뒤, 그 기본 키로 Clustered Index를 다시 탐색하여 나머지 행 데이터를 가져옵니다. 이를 흔히 테이블 룩업 또는 InnoDB의 경우 클러스터드 인덱스 룩업이라고 합니다. 다만 필요한 컬럼이 Secondary Index에 모두 포함된 커버링 인덱스라면 두 번째 탐색을 생략할 수 있습니다.

따라서 InnoDB의 기본 키는 모든 Secondary Index에 포함됩니다. 기본 키가 길면 Secondary Index 전체가 커지므로 짧고 안정적인 기본 키를 선택하는 것이 유리합니다.

> [!QUESTION]- InnoDB에서 기본 키가 길면 왜 문제가 되나요?
> 모든 Secondary Index 엔트리에 기본 키 값이 함께 저장되므로 기본 키가 길수록 각 Secondary Index의 크기도 커집니다. 더 많은 디스크 공간과 메모리를 사용하고 한 페이지에 들어가는 엔트리 수가 줄어 I/O 비용이 증가할 수 있습니다.

> [!QUESTION]- Secondary Index 조회는 항상 두 번의 인덱스 탐색이 필요한가요?
> 조회에 필요한 컬럼이 Secondary Index에 모두 들어 있다면 인덱스만 읽는 커버링 인덱스가 되어 Clustered Index를 다시 찾지 않아도 됩니다. 그렇지 않다면 Secondary Index에서 얻은 기본 키로 Clustered Index를 한 번 더 탐색합니다.

> [!QUESTION]- 무작위 UUID를 InnoDB 기본 키로 사용할 때 주의할 점은 무엇인가요?
> 값이 넓어 Secondary Index 크기가 커지고, 무작위 위치에 삽입되면서 페이지 분할과 캐시 지역성 저하가 발생할 수 있습니다. UUID가 필요하다면 문자열보다 압축된 바이너리 형식이나 시간 순서 특성이 있는 UUID를 검토하되, 분산 생성과 보안 요구사항도 함께 고려해야 합니다.

%%%%
## 출처 및 참고자료

- [Clustered and Secondary Indexes - MySQL 8.4 Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html)
- [Use of Index Extensions - MySQL 8.4 Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/index-extensions.html)
- https://www.youtube.com/watch?v=6ueULGn5fVY
