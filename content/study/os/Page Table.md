---
tags:
  - OS
aliases:
  - 페이지 테이블
---
## Page Table

Page Table은 프로세스의 페이지를 RAM의 물리 페이지 프레임에 매핑하기 위한 자료구조이다.  ^intro

- Page Table은 [[process|프로세스]]별로 따로 관리된다.  
- Page 갯수만큼 Page Table에 entry가 생성된다. 그리고 각 entry는 물리적 주소를 갖는다.  
- **메모리에 상주**하며 이로 인해 모든 메모리 접근 연산은 **2번의 memory access가 발생**한다.
- Page Table은 [[MMU]]에 의해 관리된다.
- 자주 사용되는 주소는 [[TLB]]라는 캐싱 계층에 저장한다. (페이지 테이블에 접근하는 횟수를 줄이기 위해)

> [!INFO]
> 페이지 번호는 Page Table를 조회할 때 **인덱스** 역할을 한다. 

%%%%
### PTBR

프로세스마다 페이지 테이블이 있고 메모리에 저장된다.  
각 페이지 테이블은 CPU 내의 PTBR(Page-table base register)이 가리킨다.  

![[IMG-20260909213517535.png|253]]

### PTLR

각 페이지 테이블의 길이는 PTLR(Page-table length register)이 가리킨다.  

## 페이징에서의 주소 변환

페이징 시스템에서의 논리 주소는 페이지 번호(page number)와 변위(offset)을 가지고 있다.  
페이지 테이블을 통해 `<페이지 번호, 변위>` →  `<프레임 번호, 변위>`로 변환한다.  

![[IMG-20260909214453947.png|396]]

### PTE

페이지 테이블 각각의 행을 **Page Table Entry**라고 부른다. PTE에는 일반적으로 해당 가상 페이지가 매핑된 **물리 프레임 번호**와 페이지의 상태 및 접근 권한을 나타내는 여러 비트가 저장된다.  

- 유효 비트: 현재 해당 페이지에 접근 가능한지 여부 (유효 비트가 0인 페이지에 접근시 [[Paging#Page Fault|Page Fault]] 발생)
- 보호 비트: 해당 페이지에 대한 접근 권한을 나타냄 (Read/Write/Execute)
- 참조 비트: CPU가 이 페이지에 접근한 적이 있는지 여부 (OS는 이를 [[페이지 교체 알고리즘]]에서 활용)
- 수정 비트: CPU가 이 페이지에 데이터를 쓴 적이 있는지 여부 (메모리와 디스크의 데이터 정합성)
	- 메모리에 페이지가 사라질때 보조기억장치에 쓰기 작업을 해야 하는지 판단의 재료

> [!INFO]
> 구체적인 구성은 CPU 아키텍처와 OS에 따라 다르다.

%%%%

## 출처 및 참고자료

```cardlink
url: https://www.youtube.com/watch?v=8ufliWkgqMo&t=160s
title: "[컴퓨터 공학 기초 강의] 38강. 페이징을 통한 가상 메모리 관리"
description: "본 강의는 『혼자 공부하는 컴퓨터 구조+운영체제』의 책 내용으로 제작 되었으며, 혼자서도 컴퓨터 공학 지식을 학습할 수 있도록 구성하였습니다. 이번 강의에서는 페이징을 통한 가상 메모리 관리를 알아봅니다.👨‍🏫주요 강의 내용Chapter 14. 가상 메모리14-2 페이징을 통한..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/bfff41d2/img/favicon_32x32.png
image: https://i.ytimg.com/vi/8ufliWkgqMo/maxresdefault.jpg
```
