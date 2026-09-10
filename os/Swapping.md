---
tags:
  - OS
aliases:
  - 스와핑
---
스와핑은 프로세스를 메인 메모리에서 디스크로, 또는 그 반대로 일시적으로 이동시키는 메모리 관리 기법이다.  ^intro

- 프로세스를 RAM으로 이동시키거나 RAM에서 내보내는 방식으로 메모리 [[Fragmentation|단편화]]를 줄인다.  
- 사용 가능한 RAM 용량을 초과하더라도 대규모 프로세스가 실행될 수 있도록 한다.  
- 비활성 또는 대기 중인 프로세스를 일시 중단하여 RAM을 일시적으로 확보한다.  
- 물리적으로 사용 가능한 메모리보다 프로세스에 더 많은 메모리를 제공하기 위해 [[Virtual Memory|가상 메모리]]를 지원한다.  

> RAM에서 밀려난 메모리 페이지를 임시로 저장하는 디스크 공간을 Swap Area 혹은 Backing Store라고 부른다.

![[IMG-20260909201642928.png|450]]

- Swap Out: Memory → Backing Store
- Swap In: Backing Store → Memory

## 동작 방식

1. 프로세스는 실행 준비가 완료되면 디스크에서 RAM으로 이동
2. 프로세스가 일정 시간 실행된 후 일시적으로 디스크로 스왑 아웃될 수 있습니다.
	- 또는 우선순위가 더 높은 프로세스가 메모리를 필요로 하는 경우
3. 중기 스케줄러는 우선순위나 스케줄링 정책을 기반으로 어떤 프로세스를 스왑 인하고 스왑 아웃할지 결정합니다.
4. 메모리에서 제외되었던 프로세스가 다시 필요해지면, 해당 프로세스는 실행을 계속하기 위해 메모리로 다시 스왑

> [!CAUTION]
> 스와핑은 프로세스 전체를 RAM과 디스크 사이에서 이동시키는 방식이다. 그렇기에 속도가 느리고 비효율적이다.   Windows, Linux, macOS와 같은 최신 운영체제는 스와핑 대신 [[Paging|페이징]]을 사용한다.  

%%%%
## 출처 및 참고자료

```cardlink
url: https://www.geeksforgeeks.org/operating-systems/swapping-in-operating-system/
title: "Swapping in Operating System - GeeksforGeeks"
description: "Your All-in-One Learning Portal: GeeksforGeeks is a comprehensive educational platform that empowers learners across domains-spanning computer science and programming, school education, upskilling, commerce, software tools, competitive exams, and more."
host: www.geeksforgeeks.org
favicon: https://media.geeksforgeeks.org/wp-content/uploads/gfg_200X200-100x100.png
image: https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png
```

