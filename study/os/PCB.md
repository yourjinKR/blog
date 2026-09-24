---
tags:
  - OS
aliases:
  - Process Control Block
  - 프로세스 제어 블록
---
PCB는 프로세스의 정보를 담고 있는 자료구조다. 운영체제가 프로세스를 다룰 때 프로세스 제어 블록을 이용해서 다루게 된다. 여기에 담기는 정보는 운영체제별로 다르다. 일반적으로 아래와 같은 것들이 저장된다.

![[IMG-20260903124338660.png|459]]

- Process id: 프로세스 ID
- Process State : 프로세스의 상태
- Program Counter : 다음 명령어의 주소
- CPU Registers : 누산기, 인덱스 레지스터, 스택 포인터, 범용 레지스터 등 컴퓨터 구조에 따라 다르다.
- CPU-Scheduling Information : 프로세스 우선순위, 스케쥴링 큐의 포인터 등을 일컫는다.
- Memory-Management Information : 페이지 테이블, 세그먼트 테이블 등 메모리 시스템에 따라 다르다.
- Accounting Information : CPU 시간의 총량, 실제 사용된 시간, 시간 제한 등에 대한 정보
- I/O Status Information : 프로세스에 할당된 입출력 기기의 목록

## 출처 및 참고자료

https://haedallog.tistory.com/138  
https://junhyunny.github.io/information/operating-system/process-control-block-and-context-switching/  
https://www.scaler.com/topics/operating-system/process-control-block-in-os/  