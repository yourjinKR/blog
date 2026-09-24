---
tags:
  - OS
aliases:
  - 세그멘테이션
---
프로그램의 논리적 구분에 따라 프로그램의 메모리를 여러 세그먼트로 나누는 메모리 관리 기법이다.  ^intro

- 프로세스를 **가변 크기의 논리적 세그먼트**로 나눈다.
- 각 부분은 함수나 배열과 같은 프로그램 단위를 나타냅니다.
- 주소 변환에 [[Segment Table|세그먼트 테이블]]을 사용합니다.
- 서로 다른 세그먼트는 접근 권한(읽기, 쓰기, 실행)을 가질 수 있으며 프로세스 간에 공유될 수 있다.

> [!NOTE]
> 세그멘트는 논리적인 단위로 분할하기에 각 요소들에게 권한을 주기에 용이하다.  
> 세그멘테이션을 통해 각 세그멘트에 서로 다른 보호 수준을 적용하여 이를 보장할 수 있다.  

[[process|프로세스]]를 code, data, stack, heap 영역으로 나누는 것 또한 세그멘테이션이라고 할 수 있다.  

## 한계점

그러나 아래와 같은 한계점으로 인해 [[Paging|페이징]] 기법이 더 많이 사용된다.   

- 세그먼트의 크기는 일정하지 않기에 다양한 Hole이 발생하여 [[Fragmentation#외부 단편화|외부 단편화]]가 발생한다.  
- 가변 크기 세그먼트 관리는 고정 크기 페이지 관리보다 더 복잡할 수 있기에 추가적인 오버헤드가 발생할 수 있다.
- 각 세그먼트에는 크기 제한이 있으며, 이로 인해 특정 세그먼트에 할당할 수 있는 메모리 양이 제한될 수 있다.  

## 출처 및 참고자료

```cardlink
url: https://www.tutorialspoint.com/operating_system/os_segmentation.htm
title: "Operating System - Segmentation"
description: "Segmentation is a memory management technique used in non-contiguous memory allocation systems. This chapter will explain segmentation, how it works, and its implementation in operating systems."
host: www.tutorialspoint.com
favicon: https://www.tutorialspoint.com/images/favicon.ico
image: https://www.tutorialspoint.com/images/tp_logo_436.png
```

```cardlink
url: https://code-lab1.tistory.com/57
title: "[운영체제] 세그멘테이션(Segmentation)이란?, 세그멘테이션 vs 페이징"
description: "세그멘테이션(Segmentation)이란?페이징은 프로세스를 물리적으로 일정한 크기로 나눠서 메모리에 할당하는 것을 의미한다. 반면, 세그멘테이션은 프로세스를 논리적 내용을 기반으로 나눠서 메모리에 배치하는 것을 의미한다. 세그멘테이션은 프로세스를 세그먼트(segment)의 집합으로 표현한다. 이때 세그먼트는 논리 단위로 아래와 같은 것들이 해당된다.main programprocedurefunctionmethodobjectstacklocal variableglobal variableetc...프로세스를 code영역, data영역, stack영역 등으로 나누는 것 또한 세그멘테이션이라고 할 수 있다. 세그멘테이션도 페이징과 비슷하게 세그먼트 테이블을 가지고 있다. 페이징과 비슷하게 논리주소가로 이루어져 .."
host: code-lab1.tistory.com
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FyzhN4%2FbtrnB8WSbqI%2FAAAAAAAAAAAAAAAAAAAAAH67X1EAMDPdRukRXXS6LK_CjBlHHUZW3xte6dI8RRgw%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3D4mlSzbEEcACsQYk30su4c8evdlM%253D
```
