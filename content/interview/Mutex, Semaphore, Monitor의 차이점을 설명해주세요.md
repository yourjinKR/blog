---
tags:
  - 면접
  - 스터디
  - OS
---
**[[Mutex]]는 하나의 실행 흐름만 진입시키는 락, [[Semaphore]]는 허용 개수를 관리하는 동기화 도구, Monitor는 공유 데이터와 동기화 규칙을 묶은 고수준 구조입니다.**

| 구분        | 핵심 동작                           | 대표 용도                          |
| --------- | ------------------------------- | ------------------------------ |
| Mutex     | 소유자가 락을 획득하고 해제하며 상호 배제 보장      | 공유 데이터의 임계 구역 보호               |
| Semaphore | 허용 개수를 획득·반환하며, 부족하면 대기         | 동시 접근 수 제한, 작업 간 신호 전달         |
| Monitor   | 상호 배제와 조건 대기를 공유 데이터의 접근 절차에 결합 | 공유 상태를 안전하게 읽고 수정하며 조건 충족을 기다림 |

Mutex는 보통 **락을 획득한 스레드가 해제**해야 하지만, Semaphore에는 같은 소유권 규칙이 없어 다른 스레드가 신호를 줄 수도 있습니다. Java에서는 `synchronized`와 `wait()/notify()`가 모니터 기반 동기화의 대표 예입니다.

> [!QUESTION]- Binary Semaphore와 Mutex는 같은 것인가요?
> 둘 다 한 번에 하나의 실행 흐름만 통과시키는 데 사용할 수 있지만 소유권 규칙이 다릅니다. Mutex는 소유자가 해제하는 락이고, Semaphore는 다른 실행 흐름의 신호 전달에도 사용할 수 있습니다.

> [!QUESTION]- wait()와 sleep()은 락을 어떻게 처리하나요?
> Java의 wait()는 호출 대상 객체의 모니터를 보유해야 하며, 대기하면서 그 모니터를 해제하고 반환 전에 다시 획득합니다. sleep()은 보유 중인 모니터를 해제하지 않으며, wait()도 다른 객체의 락까지 해제하지는 않습니다.

> [!QUESTION]- 조건 대기를 if가 아니라 while로 검사하는 이유는 무엇인가요?
> 깨어났더라도 다른 스레드가 상태를 바꿨거나 허위 깨움이 발생했을 수 있기 때문입니다. 또한 notify()는 락을 즉시 넘기는 동작이 아니므로, 깨어난 스레드는 락을 다시 획득한 뒤 조건을 재검사해야 합니다.

> [!QUESTION]- Semaphore를 사용하는 구체적인 예시는 무엇인가요?
> 외부 API가 동시에 10개의 요청만 처리할 수 있다면 permit이 10인 Counting Semaphore를 두고, 호출 전에 `acquire()`, 완료 후 `finally`에서 `release()`할 수 있습니다. 동시에 임계 구역에 들어가는 요청 수는 10개로 제한되며 나머지는 permit이 반환될 때까지 기다립니다. 생산자-소비자 큐에서는 사용 가능한 항목 수와 빈 슬롯 수를 세는 데도 사용할 수 있습니다.

> [!QUESTION]- Virtual Thread의 Pinning을 줄이기 위해 Java는 어떤 메커니즘을 사용하나요?
> Virtual Thread는 블로킹될 때 carrier인 Platform Thread에서 unmount되어 carrier를 다른 Virtual Thread가 사용하게 합니다. JDK 24부터는 JVM 모니터 구현을 바꾼 JEP 491을 통해 Virtual Thread가 `synchronized` 블록이나 메서드 안에서 대기하더라도 carrier에서 unmount할 수 있으므로, 이 경우의 Pinning이 제거되었습니다. 현재도 `native` 메서드나 Foreign Function 실행 중에는 Pinning될 수 있으므로 장시간 블로킹하는 네이티브 호출을 피하거나 분리해야 합니다.

## 출처 및 참고자료

- [pthread_mutex_lock(3p) - POSIX manual](https://man7.org/linux/man-pages/man3/pthread_mutex_lock.3p.html)
- [sem_overview(7) - Linux manual](https://man7.org/linux/man-pages/man7/sem_overview.7.html)
- [Threads and Locks - Java Language Specification](https://docs.oracle.com/javase/specs/jls/se25/html/jls-17.html)
- [Condition Variables - OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-cv.pdf)
- [Virtual Threads - Java SE 25](https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html)
- [JEP 491: Synchronize Virtual Threads without Pinning](https://openjdk.org/jeps/491)
