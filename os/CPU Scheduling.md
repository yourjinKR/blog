---
tags:
  - OS
aliases:
  - CPU Scheduling
  - CPU 스케줄링
  - CPU 스케줄러
---
스케줄링은 다중 프로그래밍을 가능하게 하는 운영 체제의 동작 기법이다. CPU 스케줄링의 주요 기능은 CPU가 유휴 상태일 때마다 운영체제가 준비 대기열에 있는 [[process|프로세스]] 중 적어도 하나를 선택하도록 하는 것이다.

스케줄링의 목적은 다음과 같다.  

- CPU 사용률을 최대화
- 응답 시간과 대기 시간을 최소화

![[IMG-20260903220518044.png|548]]  
https://medium.com/@tanmaykumarchaursia/understanding-cpu-scheduling-a-comprehensive-guide-to-efficient-process-management-2169b701b953


## 비선점형 스케줄링

비선점형 스케줄링은 프로세스가 종료되거나 실행 상태에서 대기 상태로 전환될 때 사용된다.

## 선점 스케줄링

선점형 스케줄링은 프로세스가 실행 상태에서 준비 상태로 또는 대기 상태에서 준비 상태로 전환될 때 사용된다.  

- Process가 CPU를 비롯한 resource를 사용하고 있어도 OS가 강제로 빼앗(interrupt)을 수 있다.
- 하나의 Process가 CPU를 점유할 수 없다.
- Timer Interrupt가 발생하면 OS가 다음 Process에게 resource를 할당한다.
- Process 간에 데이터 공유 시, 일관성 유지에 따른 비용이 발생한다.
- Context Switch 과정에서 overhead가 발생한다.

## 알고리즘

처리량·응답 시간·공정성 중 어떤 목표를 중시하느냐에 따라 알고리즘이 달라진다.  

|알고리즘|선택 기준|특징과 한계|
|---|---|---|
|FCFS|먼저 도착한 순서대로 실행 (큐 방식)|단순한 비선점 방식이지만 긴 작업 뒤에 짧은 작업이 밀리는 Convoy Effect 발생|
|SJF / SRTF|다음 CPU 실행 시간이 짧은 작업 우선 / 남은 시간이 짧은 작업 우선|각각 비선점 / 선점 방식이며, 실행 시간 예측이 필요하고 긴 **작업의 기아 가능**|
|Priority|높은 우선순위 작업부터 실행|선점·비선점 모두 가능하며 낮은 우선순위 작업의 기아 가능|
|Round Robin|정해진 타임 퀀텀(time-slice)만큼 번갈아 실행|응답성과 공정성에 유리하지만 퀀텀이 작으면 문맥 교환 증가|
|MLFQ (Multilevel Queue)|프로세스들을 그룹화하여 그룹마다 큐를 두는 방식|짧고 대화형인 작업을 우대하며, 우선순위 조정 정책이 중요|

![[IMG-20260903220133938.png]]

## 출처 및 참고자료

https://www.geeksforgeeks.org/operating-systems/cpu-scheduling-in-operating-systems/  
https://www.youtube.com/watch?v=LgEY4ghpTJI&list=PLcXyemr8ZeoQOtSUjwaer0VMJSMfa-9G-&index=9  
https://ko.wikipedia.org/wiki/%EC%8A%A4%EC%BC%80%EC%A4%84%EB%A7%81_(%EC%BB%B4%ED%93%A8%ED%8C%85)