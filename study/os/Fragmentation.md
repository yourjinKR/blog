---
tags:
  - OS
aliases:
  - 단편화
---
단편화란 데이터 파일이나 실행 프로그램과 같은 파일이 여러 개의 작은 조각으로 나뉘어 하드 디스크나 RAM과 같은 저장 매체의 여러 부분에 저장되는 현상을 말한다. 파일이 단편화되면, 그 조각들은 비연속적인 블록에 저장된다. 이는 메모리나 저장 공간의 비효율적인 사용과 파일 접근 속도 저하로 이어질 수 있다. 

## 내부 단편화

- 내부 단편화는 할당된 메모리 블록 내에 사용되지 않은 공간이 있을 때 발생합니다.
- 이는 할당된 메모리 블록의 크기가 프로세스가 실제로 필요로 하는 메모리보다 클 때 발생합니다.
- 이러한 유형의 단편화는 고정 크기 메모리 할당 방식을 사용하는 시스템에서 흔히 발생합니다.
- 할당된 블록 내의 사용되지 않은 공간은 다른 프로세스에서 활용할 수 없으므로 메모리 사용이 비효율적이 됩니다.

> [!EXAMPLE]
> 시스템이 40KB만 필요한 프로세스에 64KB 메모리 블록을 할당하면 나머지 24KB는 내부 단편화

![[IMG-20260909203911236.png]]

## 외부 단편화

- 외부 단편화는 사용 가능한 메모리 또는 저장 공간이 여러 개의 작고 연속되지 않은 블록으로 나뉘는 현상입니다.
- 이는 시간이 지남에 따라 프로세스나 파일의 할당 및 할당 해제가 빈번하게 발생하기 때문입니다.
- 전체 사용 가능한 공간이 충분하더라도, 연속된 단일 메모리 블록의 크기가 충분하지 않아 시스템이 메모리를 할당할 수 없는 경우가 발생할 수 있습니다.
- 결과적으로 파일이나 프로세스는 여러 개의 작은 블록으로 나누어 저장해야 하므로 접근 시간이 증가합니다.
- 외부 단편화는 성능 저하와 저장 장치 또는 메모리 자원의 비효율적인 사용으로 이어집니다.

![[IMG-20260909203915413.png]]

## 출처 및 참고자료


```cardlink
url: https://www.geeksforgeeks.org/operating-systems/what-is-fragmentation-in-operating-system/
title: "Fragmentation in Operating System - GeeksforGeeks"
description: "Your All-in-One Learning Portal: GeeksforGeeks is a comprehensive educational platform that empowers learners across domains-spanning computer science and programming, school education, upskilling, commerce, software tools, competitive exams, and more."
host: www.geeksforgeeks.org
favicon: https://media.geeksforgeeks.org/wp-content/uploads/gfg_200X200-100x100.png
image: https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png
```
