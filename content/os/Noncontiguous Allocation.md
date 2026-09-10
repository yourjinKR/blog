---
tags:
  - OS
aliases:
  - 비연속 할당
---
비연속 할당은 OS에서 연속적인 메모리 블록이 필요하지 않은 프로세스에 메모리를 할당하는 데 사용되는 기술이다.  ^intro

프로세스 통째로 메모리에 적재하는 방식인 연속 할당은 메모리 공간을 효율적으로 사용하지 못한다는 문제가 있었다.  

- 프로세스를 작은 단위(페이지/세그먼트)로 나눈다.
- 나눈 요소들을 사용 가능한 메모리 블록에 배치한다.  
- OS는 페이지 테이블 또는 세그먼트 테이블을 통해 매핑을 유지한다.  

비연속 메모리 할당을 구현하는 데에는 [[Paging]], [[Segmentation]], Segmented Paging이 있다.  

## 출처 및 참고자료

```cardlink
url: https://www.geeksforgeeks.org/operating-systems/non-contiguous-allocation-in-operating-system/
title: "Non-Contiguous Allocation in Operating System - GeeksforGeeks"
description: "Your All-in-One Learning Portal: GeeksforGeeks is a comprehensive educational platform that empowers learners across domains-spanning computer science and programming, school education, upskilling, commerce, software tools, competitive exams, and more."
host: www.geeksforgeeks.org
favicon: https://media.geeksforgeeks.org/wp-content/uploads/gfg_200X200-100x100.png
image: https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png
```
