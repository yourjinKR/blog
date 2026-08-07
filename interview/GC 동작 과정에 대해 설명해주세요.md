---
title: GC의 동작 과정에 대해 설명해주세요
tags:
  - 면접
  - 스터디
---
GC의 세부 구조는 Collector마다 다르지만, 일반적으로 Heap을 Young 영역과 Old 영역으로 나누어 관리합니다. Young과 Old를 나눈 이후는 애플리케이션 특성상 대부분의 객체들은 금방 사라지기에 일부 영역만 지속적으로 탐색하며 해제하는 방식을 택했습니다.  

Young 영역은 Eden과 Survivor 영역으로 구성되며, 대부분의 객체는 Eden에서 처음 생성됩니다. Eden이 가득 차면 Young GC가 발생하고, 살아남은 객체는 Survivor 영역으로 이동합니다. 이후에도 여러 번 살아남은 객체는 Old 영역으로 승격됩니다.

GC는 GC Root에서 참조 관계를 탐색해 살아 있는 객체를 구분하고, 더 이상 참조되지 않는 객체의 메모리를 회수합니다. Old 영역의 사용량이 증가하면 Old 영역까지 포함한 GC가 수행되며, 필요에 따라 객체를 정리하거나 이동시켜 메모리 공간을 확보합니다.

![[Pasted image 20260806174103.png|429]]

> JVM의 GC Root는 Stack과 Method Area 내 Runtime Constant Pool이다.

> Reference Count와 Mark and Sweep 방식의 차이를 알자
