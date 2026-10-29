---
date: 2026-10-29
tags:
  - DB
aliases:
  - Index
  - 인덱스
---
데이터베이스 인덱스는 책의 목차와 같이, 테이블의 데이터 검색 속도를 높이기 위해 사용하는 자료구조이다.  ^intro

- Full Table Scan을 방지
- 주로 [[B-Tree]], Hash 구조로 설계
- 클러스터형 인덱스와 보조 인덱스로 나뉨
- 장점: 검색 성능이 향상, 정렬/그루핑에 최적화
- 단점: 쓰기 성능 저하, 저장 공간 증가

## Index가 B-Tree로 설계된 이유

> B-Tree Index는 self-balancing BST에 비해 Secondary Storage 접근을 적게 수행한다.  
> B-Tree 노드는 Block 단위의 저장 공간을 더 효율적으로 활용한다.  

아래 정리글은 해당 유튜브 영상을 참고했습니다.  

```cardlink
url: https://www.youtube.com/watch?v=liPSnc6Wzfk
title: "BJ.54-3 B tree가 왜 DB 인덱스(index)로 사용되는지를 설명합니다"
description: "#btree #DB #index #쉬운코드 #백발백중B tree 외에도 AVL tree도 있고 red-black tree도 있는데, 왜 B tree 계열의 자료 구조가 DB index로 사용되는 걸까요?오늘은 그 얘기를 자세히 풀어보겠습니다그럼 오늘도 고고씽!00:00 오프닝00:..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/0b8a310c/img/favicon_32x32.png
image: https://i.ytimg.com/vi/liPSnc6Wzfk/maxresdefault.jpg
```

[[B-Tree]]에서 조회/삽입/삭제의 시간 복잡도는 $O(logN)$

BST는 상황에 따라 한쪽으로 기울어진 형태가 될 수 있다.  
그렇기에 스스로 균형을 맞추는 self-balancing BST = AVL Tree, Red-Black Tree가 등장.  
self-balancing BST 또한 $O(logN)$인데, 그렇다면 굳이 왜 B-Tree를 사용하는걸까?

컴퓨터 시스템 구조는 대략 다음과 같음.

CPU → Main Memory (RAM) → Secondary Storage (SSD/HDD)

각각의 역할과 특징은 다음과 같음.

- CPU: 프로그램을 실제로 실행
- RAM: 실행 중인 프로그램의 코드들과 코드 실행에 필요한 혹은 그 결과로 나온 데이터들이 상주
- Secondary Storage: 프로그램 데이터가 영구적으로 저장되는 곳 (←> RAM은 임시 저장)
	- RAM의 용량은 한계가 있기에 실행 중인 프로그램의 데이터 일부가 임시 저장되기도 함
	- block 단위로 데이터를 읽고 쓴다  
		- block이란?
			- **file system이 데이터를 읽고 쓰는 단위**
			- block의 크기는 2의 승수로 표현되며 대표적인 block size는 4KB, 8KB, 16KB
			- 해당 방식은 불필요한 데이터까지 가져올 수 있다는 단점이 있음

DB는 Secondary Storage에 저장된다. (근본적인 이유는 영구적인 저장을 위해)  

그렇기에 아래와 같은 특수성을 고려해야 된다.  (DB Index가 B-Tree 구조인 이유)
- DB에서 데이터를 조회할 때 Secondary Storage에 최대한 적게 접근하는 것이 성능적으로 중요
- Block 단위로 읽고 쓰기에 연관된 데이터를 모아서 저장하면 효율적일 수 있음

> [!INFO] 더 생각해보기
> BST 노드들에도 Block 안에 연속된 데이터를 최대한 담는다면?  
> → 결국 B-Tree 동작 방식과 동일하기에 차라리 B-Tree를 도입  
> 
> Hash Index는 시간 복잡도가 $O(1)$인데 왜 사용하지 않는가?  
> → `=` 조회만 가능, 범위 기반 검색이나 정렬은 불가능

%%%%
## 출처 및 참고자료

```cardlink
url: https://www.youtube.com/watch?v=liPSnc6Wzfk
title: "BJ.54-3 B tree가 왜 DB 인덱스(index)로 사용되는지를 설명합니다"
description: "#btree #DB #index #쉬운코드 #백발백중B tree 외에도 AVL tree도 있고 red-black tree도 있는데, 왜 B tree 계열의 자료 구조가 DB index로 사용되는 걸까요?오늘은 그 얘기를 자세히 풀어보겠습니다그럼 오늘도 고고씽!00:00 오프닝00:..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/0b8a310c/img/favicon_32x32.png
image: https://i.ytimg.com/vi/liPSnc6Wzfk/maxresdefault.jpg
```

```cardlink
url: https://ko.wikipedia.org/wiki/%EC%9D%B8%EB%8D%B1%EC%8A%A4_(%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4)
title: "인덱스 (데이터베이스) - 위키백과, 우리 모두의 백과사전"
host: ko.wikipedia.org
favicon: https://ko.wikipedia.org/static/favicon/wikipedia.ico
```

```cardlink
url: https://murphytklee.tistory.com/31
title: "[Database] Index, 인덱스란? (구조, 종류, 동작 원리, 장단점 및 주의 사항)"
description: "1. Index, 인덱스란? 인덱스(Index)란 데이터베이스 테이블에서 데이터를 빠르게 검색할 수 있도록 도와주는 자료구조이다. 인덱스는 테이블의 특정 컬럼에 대해 별도의 데이터 구조(주로 B-Tree, Hash 등)를 만들어, 전체 테이블을 일일이 탐색하지 않고도 원하는 데이터를 빠르게 찾을 수 있게 해준다. SQL에서 인덱스는 다음처럼 생성, 삭제, 재구성이 가능하다. sqlCREATE INDEX 인덱스명 ON 테이블명(컬럼명); -- 인덱스 생성DROP INDEX 인덱스명; -- 인덱스 삭제ALTER INDEX 인덱스명 REBUILD; -- 인덱스 재구성데이터베이스는 기본적으로 전체 테이블을 순차 탐색(Full Table Scan) 한다. 인덱스를 사용하면 특정 조건(Where)에 맞는 데이터를 .."
host: murphytklee.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FtSX2c%2FbtsNmA0Gh6i%2FAAAAAAAAAAAAAAAAAAAAAFiz_Vlx2ue81T_D0jYEeHUC0nx9DDy98moETxDfKOl1%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D70%252BAxhA%252BaeGBIdRAWp%252B4tujMBOk%253D
```

