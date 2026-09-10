---
tags:
  - OS
aliases:
  - 페이징
  - 메모리 페이징
---
페이징이란 프로세스를 동일한 크기의 페이지로 나누고 메모리 프레임에 매핑하는 메모리 관리 기법이다.  ^intro

- 물리 주소와 논리 주소 사이에 간접 참조를 맺어 메모리를 [[Noncontiguous Allocation|비연속 할당]]
- 메모리 [[Fragmentation#외부 단편화|외부 단편화]] 문제를 해결

![[IMG-20260909195713290.png|607]]

OS는 각 페이지가 메모리 어디에 저장되는지 저장되는지 추적하기 위해 [[Page Table]]를 만든다.  

Page Falut란 Page에 접근했으나 해당 페이지가 RAM에 존재하지 않는 경우를 의미한다.  
OS는 필요한 Page를 RAM으로 가져오는 Page-in을 수행하여 이를 처리한다.  

> 필요한 Page는 디스크의 **Swap 영역이나 실행 파일 등에서** 가져온다.  
> 프로세스 단위의 [[Swapping]]이 아닌 페이지 단위의 Swapping이다. (Page-in / Page-out)

## 페이징과 단편화

페이징을 통해 외부 단편화는 해결되지만 [[Fragmentation#내부 단편화|내부 단편화]]라는 또 다른 문제를 발생시킨다.  

> [!EXAMPLE]
> 페이지 크키가 10KB, 프로세스 크기가 108KB라고 할때, 마지막 페이지는 2KB의 내부 단편화가 발생한다.  

%%%%

## 출처 및 참고자료

```cardlink
url: https://www.geeksforgeeks.org/operating-systems/paging-in-operating-system/
title: "Paging - GeeksforGeeks"
description: "Your All-in-One Learning Portal: GeeksforGeeks is a comprehensive educational platform that empowers learners across domains-spanning computer science and programming, school education, upskilling, commerce, software tools, competitive exams, and more."
host: www.geeksforgeeks.org
favicon: https://media.geeksforgeeks.org/wp-content/uploads/gfg_200X200-100x100.png
image: https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png
```

```cardlink
url: https://www.youtube.com/watch?v=8ufliWkgqMo&t=160s
title: "[컴퓨터 공학 기초 강의] 38강. 페이징을 통한 가상 메모리 관리"
description: "본 강의는 『혼자 공부하는 컴퓨터 구조+운영체제』의 책 내용으로 제작 되었으며, 혼자서도 컴퓨터 공학 지식을 학습할 수 있도록 구성하였습니다. 이번 강의에서는 페이징을 통한 가상 메모리 관리를 알아봅니다.👨‍🏫주요 강의 내용Chapter 14. 가상 메모리14-2 페이징을 통한..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/bfff41d2/img/favicon_32x32.png
image: https://i.ytimg.com/vi/8ufliWkgqMo/maxresdefault.jpg
```
