---
tags:
  - OS
aliases:
  - 가상 메모리
  - Logical Memory
  - 논리 메모리
---
가상 메모리는 컴퓨터가 실제 이용 가능한 메모리 자원을 추상화하여 큰 메모리로 보이게 만드는 것이다.  ^intro

> 추상화 대상은 물리 메모리(RAM)와 저장장치(HDD/SSD)의 물리적 주소 공간이다. 

- **보호와 격리**: [[process|프로세스]]별 매핑과 접근 권한으로 다른 프로세스나 커널 메모리에 대한 임의 접근을 막습니다.
- **메모리 사용의 단순화**: 프로그램이 물리 메모리의 실제 위치를 몰라도 연속적인 가상 주소 범위를 사용할 수 있습니다.
- **효율적인 물리 메모리 사용**: 필요한 페이지만 올리는 요구 페이징과 페이지 공유로 메모리를 활용합니다.

![[IMG-20260910023058211.png|503]]

## 가상 메모리의 종류

1. [[Paging]]
2. [[Segmentation]]

## 출처 및 참고자료

```cardlink
url: https://www.geeksforgeeks.org/operating-systems/virtual-memory-in-operating-system/
title: "Virtual Memory in Operating System - GeeksforGeeks"
description: "Your All-in-One Learning Portal: GeeksforGeeks is a comprehensive educational platform that empowers learners across domains-spanning computer science and programming, school education, upskilling, commerce, software tools, competitive exams, and more."
host: www.geeksforgeeks.org
favicon: https://media.geeksforgeeks.org/wp-content/uploads/gfg_200X200-100x100.png
image: https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png
```
