---
tags:
  - 면접
  - 스터디
  - OS
---
**Blocking/Non-blocking은 호출한 스레드가 대기하며 멈추는지, 동기/비동기는 I/O 수행과 완료 결과가 호출에 어떻게 연결되는지를 구분합니다.** 따라서 Non-blocking이라고 해서 곧바로 비동기 I/O인 것은 아닙니다.

| 구분 | 의미 | 대표 동작 |
| --- | --- | --- |
| Blocking | 결과나 이벤트를 기다리는 동안 호출한 스레드가 대기 | 데이터가 없는 소켓에서 blocking read()가 대기 |
| Non-blocking | 지금 처리할 수 없으면 기다리지 않고 반환 | non-blocking read()가 EAGAIN/EWOULDBLOCK 반환 |
| 동기 I/O | 호출 안에서 I/O를 수행하고 반환값으로 처리 결과를 받음 | read()가 실제 읽은 바이트 수를 반환 |
| 비동기 I/O | 요청을 제출한 뒤 호출과 분리하여 I/O가 진행되고 완료 결과를 확인 | AIO 요청 후 완료 알림이나 상태 조회로 결과 확인 |

예를 들어 non-blocking 소켓의 read()는 데이터가 있으면 읽은 결과를 반환하고, 없으면 재시도가 필요하다고 반환합니다. 반면 비동기 읽기는 요청이 접수되면 호출이 돌아온 뒤에도 읽기가 진행될 수 있습니다. **준비 상태 알림과 실제 I/O 완료 알림을 구분하는 것**이 핵심입니다.

> [!QUESTION]- epoll은 비동기 I/O 완료를 알려주는 기능인가요?
> epoll은 주로 소켓 등이 읽기·쓰기를 할 준비가 되었는지 알려주는 I/O 다중화 기능입니다. 애플리케이션이 직접 read()/write()를 호출해야 하며, epoll_wait() 자체는 이벤트를 기다리며 블로킹될 수 있습니다.

> [!QUESTION]- 비동기 작업의 결과를 기다리면 블로킹이 될 수도 있나요?
> 가능합니다. 비동기로 제출한 작업이라도 완료 전에 Future.get() 같은 대기 API를 호출하면 그 스레드는 블로킹될 수 있습니다. 작업의 진행 방식과 결과를 기다리는 호출의 동작을 나눠 봐야 합니다.

> [!QUESTION]- Non-blocking I/O는 성공하면 요청한 데이터를 전부 처리하나요?
> 아닙니다. 소켓의 읽기·쓰기는 일부 바이트만 처리하고 반환할 수 있으므로 반환값만큼 진행한 뒤 나머지를 처리해야 합니다. 처리할 준비가 안 됐다면 무조건 반복 호출하기보다 준비 알림을 활용해 CPU 낭비를 줄일 수 있습니다.

## 출처 및 참고자료

- [read(2) - Linux manual](https://man7.org/linux/man-pages/man2/read.2.html)
- [epoll(7) - Linux manual](https://man7.org/linux/man-pages/man7/epoll.7.html)
- [aio(7) - Linux manual](https://man7.org/linux/man-pages/man7/aio.7.html)
- [Event-based Concurrency - OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-events.pdf)
- [Future.get() - Java API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/Future.html#get())
