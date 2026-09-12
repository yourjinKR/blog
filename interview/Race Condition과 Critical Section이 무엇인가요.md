---
tags:
  - 면접
  - 스터디
  - OS
---
**Race Condition은 여러 실행 흐름의 접근 순서나 타이밍에 따라 결과가 달라지는 문제이고, Critical Section은 공유 자원에 접근하여 [[synchronization|동기화]]가 필요한 코드 구간입니다.**

예를 들어 두 스레드가 동시에 `count++`를 수행하면, 둘 다 같은 값을 읽고 같은 증가 결과를 저장해 한 번의 증가가 사라질 수 있습니다. 읽기·수정·쓰기로 나뉘는 작업을 하나의 연산처럼 보호하지 않았기 때문입니다.

임계 구역은 Mutex 등으로 **상호 배제**를 보장하거나, 필요한 연산을 원자적으로 수행해 보호합니다. 이때 정확성뿐 아니라 진행 가능성과 특정 작업이 무한정 기다리지 않는지도 고려해야 합니다.

> [!QUESTION]- CPU 코어가 하나여도 경쟁 상태가 발생하나요?
> 발생할 수 있습니다. 읽기와 쓰기 사이에 문맥 교환이 일어나 다른 스레드가 같은 값을 수정하면, 실제로 동시에 명령을 실행하지 않아도 결과가 달라질 수 있습니다.

> [!QUESTION]- Java에서 volatile을 붙이면 count++도 안전한가요?
> 아닙니다. volatile은 가시성과 순서 보장을 제공하지만 읽기·수정·쓰기 전체의 원자성을 보장하지 않습니다. 단일 카운터는 AtomicInteger의 원자적 증가 연산, 여러 값의 일관성은 같은 락으로 보호하는 방식 등을 사용할 수 있습니다.

> [!QUESTION]- 올바른 임계 구역 해결책의 조건은 무엇인가요?
> 한 번에 하나만 진입하는 상호 배제, 진입할 수 있는 상황에서 결정을 무한정 미루지 않는 진행, 요청한 작업이 무한정 밀리지 않는 한정 대기입니다. 실제 락은 공정성 보장 수준이 다르므로 상호 배제만으로 기아까지 방지된다고 볼 수는 없습니다.

> [!QUESTION]- 싱글 스레드 환경에서 원자적 연산을 사용하면 Lock 없이 Race Condition을 해결할 수 있나요?
> 공유 상태를 건드리는 실행 흐름이 정말 하나이고 각 작업이 끝날 때까지 재진입하지 않는다면 명령이 순서대로 실행되므로 메모리 Race Condition 자체가 없고 Lock도 필요하지 않습니다. 그러나 다른 프로세스·시그널 핸들러·장치와 상태를 공유하거나, 여러 비동기 작업의 순서에 따라 결과가 달라지는 논리적 경쟁은 남을 수 있습니다. 원자적 연산은 해당 연산 하나만 보호하므로 여러 단계의 `확인 후 변경` 전체까지 자동으로 안전하게 만들지는 않습니다.

%%%%
## 출처 및 참고자료

- [Locks - OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf)
- [Threads and Locks - Java Language Specification](https://docs.oracle.com/javase/specs/jls/se25/html/jls-17.html)
- [AtomicInteger - Java API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/atomic/AtomicInteger.html)
