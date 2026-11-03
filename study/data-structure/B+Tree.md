---
date: 2026-11-03
tags:
  - Data-Structure
---
- [[B-Tree]]의 확장 개념
- 브랜치 노드에 key만 담고 data는 담지 않는다
- 오직 리프 노드에만 key와 data를 저장
- 리프 노드끼리는 Linked List로 연결

## 장점

1. 리프 노드를 제외하고 데이터를 담아두지 않기 때문에 메모리를 더 확보함으로써 더 많은 key들을 수용할 수 있다. 하나의 노드에 더 많은 key들을 담을 수 있기에 트리의 높이는 더 낮아진다.(cache hit를 높일 수 있음)

2. 풀 스캔 시, B+tree는 리프 노드에 데이터가 모두 있기 때문에 한 번의 선형탐색만 하면 되기 때문에 B-tree에 비해 빠르다. B-tree의 경우에는 모든 노드를 확인해야 한다. 

## 출처 및 참고자료

```cardlink
url: https://zorba91.tistory.com/293
title: "[MySQL] B-tree, B+tree란? (인덱스와 연관지어서)"
description: "B-tree는 인덱스를 이루고 있는 자료구조의 일종이다. B-tree에서 'B'는 정확히 어떤 의미라고 밝혀진 바는 없다. 아마 'Balanced'를 의미하는 'B'가 아닐까라는 추측만 있다. MySQL의 DB engine인 InnoDB는 B+tree로 이뤄져있는데, B-tree의 확장된 개념이다. 먼저 B-tree를 살펴보자. 트리 구조의 우위성 트리 구조는 꼭 데이터베이스에 한정하지 않더라도 시스템 세계에서는 데이터를 유지하기 위해 자주 사용하는 구조이다. '탐색' 시, 단시간 내에 실행할 수 있기 때문이다. B-tree의 핵심은 데이터가 정렬된 상태로 유지되어 있다는 것이다. 그림에 표시된 사각형으로 표시된 한 개 한 개의 데이터를 '노드(Node)'라고 한다. 가장 상단의 노드를 '루트 노드(Ro.."
host: zorba91.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FqycZ2%2FbtqBQnr4QYG%2FAAAAAAAAAAAAAAAAAAAAAMGKbZ9L-Eo96y5nujCNv0Rel-KQBkgWAik-wZ5qHt8N%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1796050799%26allow_ip%3D%26allow_referer%3D%26signature%3DbPkVDxhWjzw5Sxdfq8j5F2P6S8k%253D
```
