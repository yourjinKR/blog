---
tags:
  - 면접
  - 스터디
  - OS
---
**Mutex는 하나의 실행 흐름만 진입시키는 락, Semaphore는 허용 개수를 관리하는 동기화 도구, Monitor는 공유 데이터와 동기화 규칙을 묶은 고수준 구조입니다.**

| 구분 | 핵심 동작 | 대표 용도 |
| --- | --- | --- |
| Mutex | 소유자가 락을 획득하고 해제하며 상호 배제 보장 | 공유 데이터의 임계 구역 보호 |
| Semaphore | 허용 개수를 획득·반환하며, 부족하면 대기 | 동시 접근 수 제한, 작업 간 신호 전달 |
| Monitor | 상호 배제와 조건 대기를 공유 데이터의 접근 절차에 결합 | 공유 상태를 안전하게 읽고 수정하며 조건 충족을 기다림 |

Mutex는 보통 **락을 획득한 스레드가 해제**해야 하지만, Semaphore에는 같은 소유권 규칙이 없어 다른 스레드가 신호를 줄 수도 있습니다. Java에서는 `synchronized`와 `wait()/notify()`가 모니터 기반 동기화의 대표 예입니다.

> [!QUESTION]- Binary Semaphore와 Mutex는 같은 것인가요?
> 둘 다 한 번에 하나의 실행 흐름만 통과시키는 데 사용할 수 있지만 소유권 규칙이 다릅니다. Mutex는 소유자가 해제하는 락이고, Semaphore는 다른 실행 흐름의 신호 전달에도 사용할 수 있습니다.

> [!QUESTION]- wait()와 sleep()은 락을 어떻게 처리하나요?
> Java의 wait()는 호출 대상 객체의 모니터를 보유해야 하며, 대기하면서 그 모니터를 해제하고 반환 전에 다시 획득합니다. sleep()은 보유 중인 모니터를 해제하지 않으며, wait()도 다른 객체의 락까지 해제하지는 않습니다.

> [!QUESTION]- 조건 대기를 if가 아니라 while로 검사하는 이유는 무엇인가요?
> 깨어났더라도 다른 스레드가 상태를 바꿨거나 허위 깨움이 발생했을 수 있기 때문입니다. 또한 notify()는 락을 즉시 넘기는 동작이 아니므로, 깨어난 스레드는 락을 다시 획득한 뒤 조건을 재검사해야 합니다.

## 출처 및 참고자료

- [pthread_mutex_lock(3p) - POSIX manual](https://man7.org/linux/man-pages/man3/pthread_mutex_lock.3p.html)
- [sem_overview(7) - Linux manual](https://man7.org/linux/man-pages/man7/sem_overview.7.html)
- [Threads and Locks - Java Language Specification](https://docs.oracle.com/javase/specs/jls/se25/html/jls-17.html)
- [Condition Variables - OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-cv.pdf)
