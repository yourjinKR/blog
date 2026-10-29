---
date: 2026-10-07
tags:
  - Data-Structure
---
이진 탐색 트리 (BST, Binary Search Tree)

모든 노드의 왼쪽 서브 트리는 해당 노드의 값보다 작은 값들만 가진다.  
모든 노드의 오른쪽 서브 트리는 해당 노드의 값보다 큰 값만 가진다.  

- 자녀 노드는 최대 2개까지 가질 수 있다.  

만약 자녀 노드를 3개까지 가지고 싶다면 어떻게 해야될까?  

그렇다면 각 자식 노드의 크기는 다음과 같을 것이기에 부모 노드는 값을 1개가 아닌 2개를 저장해야 된다.  

- 노드1 < k1
- k1 < 노드2 < k2
- 노드3 > k2

이를 B-Tree라고 한다.  

![[IMG-20261007040035270.svg|561]]

- 자녀 노드의 최대 개수를 늘리기 위해서는 부모 노드에 key를 하나 이상 저장한다. (k1, k2)  
- 부모 노드의 key들을 오름차순으로 정렬한다.  
- 정렬된 순서에 따라 자녀 노드들의 key 값의 범위가 결정된다.  

## B-Tree Parameter

B-Tree를 사용하면 자녀 노드의 최대 개수를 직접 제어할 수 있다.  
B-Tree를 구현할때 몇 개의 자녀 노드를 가질 것인지가 중요한 파라미터이다.   

- $M$: 각 노드의 최대 자녀 노드 수
	- M차 트리: 최대 M개의 자녀를 가질 수 있는 B-Tree를 말한다.  
- $M-1$: 각 노드의 최대 key 수
- $\lceil M/2 \rceil$: 각 노드의 최소 자녀 노드 수 (반올림 필요, 3차 B-Tree는 )
	- 해당 조건은 root node와 leaf node에서는 제외한다.  
- $\lceil M/2 \rceil - 1$: 각 노드의 최소 key 수
	- 해당 조건은 root node에서는 제외한다.  

> [!EXAMPLE] 101차 B-Tree
> - 최대 자녀 수: 101
> - 최대 Key 수: 100
> - 최소 자녀 수: 51
> - 최소 Key 수: 50  
>   
> Best Case일 경우 약 1억개의 데이터 저장 가능, Worst Case일때는 약 26만개 데이터 저장 가능

internal 노드의 key 수가 $x$개라면 자녀 노드의 수는 언제나 $x+1$개이어야 하므로 아래 트리와 같은 형태는 불가능하다.

![[IMG-20261007042000232.svg|363]]

%%%%
## 시간 복잡도

B Tree에서 조회/삽입/삭제의 시간 복잡도는 $O(logN)$

# B-Tree 데이터 삽입

B- 트리에 데이터를 삽입하는 과정은 탐색과는 다르게 **상향식**으로 진행

- 데이터의 추가는 항상 leaf 노드에 (오름차순으로 정렬하여 추가)
- 노드가 넘치면 가운데 key를 기준으로 좌우 key들은 분할, 가운데 key는 승진

![](https://miro.medium.com/v2/resize:fit:744/0*Ol_j83LNDWMQkdnw.gif)


## 출처 및 참고자료

```cardlink
url: https://chatgpt.com/share/6ac540f5-0014-83ec-bf60-3650c950fcad
title: "이 채팅을 확인해 보세요"
description: "누군가 회원님이 보고 싶어 할 것 같다고 생각한 채팅입니다."
host: chatgpt.com
favicon: https://chatgpt.com/favicon.ico
image: https://ogimg.chatgpt.com/conversation/6ac540f5-0014-83ec-bf60-3650c950fcad/response_multicolor_v1.png
```

```cardlink
url: https://www.youtube.com/watch?v=bqkcoSm_rCs
title: "BJ.54-1 B tree의 개념과 특징, 데이터 삽입이 어떻게 동작하는지를 설명합니다! (DB 인덱스과 관련있는 자료 구조)"
description: "#btree #DB #데이터삽입 #쉬운코드 #백발백중DB 인덱스 구현에 사용되는 B tree 계열의 자료 구조를 이해하기 위해서는일단 B tree가 어떤 특징이 있고 어떻게 동작하는지를 아는 것이 중요합니다이번 영상은 B tree의 개념과 특징, 그리고 데이터를 삽입하게 되면 어떤..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/01aaffea/img/favicon_32x32.png
image: https://i.ytimg.com/vi/bqkcoSm_rCs/maxresdefault.jpg
```
