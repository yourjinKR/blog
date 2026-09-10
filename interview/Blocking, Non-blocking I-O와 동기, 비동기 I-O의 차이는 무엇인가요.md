---
tags:
  - 면접
  - 스터디
  - OS
---
**Blocking/Non-blocking은 호출한 스레드가 대기하며 멈추는지, 동기/비동기는 I/O 수행과 완료 결과가 호출에 어떻게 연결되는지를 구분합니다.** 따라서 Non-blocking이라고 해서 곧바로 비동기 I/O인 것은 아닙니다.

- 동기/비동기: 요청한 작업에 대해 완료 여부를 신경 써서 작업을 순차적으로 수행할지 아닌지에 대한 관점
- 블로킹/논블록킹:현재 작업이 block(차단, 대기) 되느냐 아니냐에 따라 다른 작업을 수행할 수 있는지에 대한 관점

| 구분           | 의미                                     | 대표 동작                                      | 사례                     |
| ------------ | -------------------------------------- | ------------------------------------------ | ---------------------- |
| Blocking     | 결과나 이벤트를 기다리는 동안 호출한 스레드가 대기           | 데이터가 없는 소켓에서 blocking read()가 대기           | 파일 I/O, 소켓 I/O         |
| Non-blocking | 지금 처리할 수 없으면 기다리지 않고 반환                | non-blocking read()가 EAGAIN/EWOULDBLOCK 반환 | 네트워크 서버, 이벤트 드리븐 시스템   |
| 동기 I/O       | 호출 안에서 I/O를 수행하고 반환값으로 처리 결과를 받음       | read()가 실제 읽은 바이트 수를 반환                    | 작업 간 의존성이 있는 경우 (트랜잭션) |
| 비동기 I/O      | 요청을 제출한 뒤 호출과 분리하여 I/O가 진행되고 완료 결과를 확인 | AIO 요청 후 완료 알림이나 상태 조회로 결과 확인              | 네트워크 요청, 이벤트 기반 프로그래밍  |

예를 들어 non-blocking 소켓의 read()는 데이터가 있으면 읽은 결과를 반환하고, 없으면 재시도가 필요하다고 반환합니다. 반면 비동기 읽기는 요청이 접수되면 호출이 돌아온 뒤에도 읽기가 진행될 수 있습니다. **준비 상태 알림과 실제 I/O 완료 알림을 구분하는 것**이 핵심입니다.

Java/Spring에서는 다음과 같이 사용됩니다.  

| 조합                     | 의미                                      | Java/Spring에서 생각할 예                        |
| ---------------------- | --------------------------------------- | ------------------------------------------ |
| **동기 + Blocking**      | 결과를 직접 받고, 결과가 나올 때까지 스레드도 기다림          | JDBC/JPA, 일반 Spring MVC 코드                 |
| **동기 + Non-Blocking**  | 직접 결과를 확인하지만 준비 안 됐으면 즉시 반환             | Java NIO `SocketChannel`                   |
| **비동기 + Blocking**     | 작업은 따로 실행하지만 결과를 기다리며 호출자가 Blocking     | `Future.get()`, `CompletableFuture.join()` |
| **비동기 + Non-Blocking** | 작업을 맡기고 호출자는 계속 실행, 완료되면 callback/event | Reactor, WebFlux, 비동기 I/O                  |

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

```cardlink
url: https://coor.tistory.com/53
title: "동기, 비동기, 블로킹, 논블로킹 차이점"
description: "프로그래밍을 하다 보면 동기와 비동기, 블로킹과 논블로킹이라는 개념을 자주 접하게 됩니다. 이 용어들은 서로 비슷해 보이지만, 실제로는 중요한 차이점을 가지고 있어서 혼란을 겪곤 합니다. 이러한 이유로 이번 글에서는 동기와 비동기, 블로킹과 논블로킹의 개념을 명확히 정리하고 그 차이점을 살펴보려 합니다. 1. 동기, 비동기, 블로킹, 논블로킹 개념[ 동기 ]동기 작업은 하나의 작업이 완료될 때까지 다른 작업을 대기하는 방식입니다. 즉, 현재 작업이 끝나야만 다음 작업이 시작됩니다. 작업이 순차적으로 실행되며, 작업 간에 의존성이 있는 경우에 주로 사용됩니다. 데이터베이스 트랜잭션, 파일 읽기/쓰기 작업, 연속적인 계산 작업 등등에 사용합니다. 예시 코드public class Example { .."
host: coor.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FTMlAk%2FbtsIBhManLn%2FAAAAAAAAAAAAAAAAAAAAAA9ovPUIdzE2EDKCfTpmRTusNioP8OU38DfH4WfLBY0f%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3D%252FqqIkeQlUNtjg438pmPtQ2%252FUIMU%253D
```
