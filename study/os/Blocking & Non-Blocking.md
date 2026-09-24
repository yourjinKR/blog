Blocking과 Non-Blocking은 **호출한 작업이 완료되지 않았을 때 호출한 스레드가 제어권을 돌려받는지**에 따라 구분할 수 있다.

> **제어권**  
> 함수의 코드나 프로세스의 실행 흐름을 제어할 수 있는 권리이다.

> [!NOTE]
> CPU 연산에 비해 [[IO|I/O]] 작업은 느리다, 심지어 네트워크 I/O일 경우에는 언제 작업이 완료될지 예측하기 어렵다.  
> 그렇기에 개발 과정에 있어서 I/O 작업에 대한 블로킹 유무가 성능 차이 큰 영향을 준다. 

%%%%
## Blocking

호출한 작업이 완료될 때까지 호출한 스레드가 제어권을 돌려받지 못하고 대기하는 방식이다.  ^intro

대표적으로 Blocking I/O를 수행하면 다음과 같이 동작한다.

1. 실행 중인 스레드가 `read()`와 같은 시스템 콜을 호출한다.
2. CPU가 User Mode에서 Kernel Mode로 전환된다.
3. 커널이 요청한 작업을 즉시 완료할 수 없는 경우 해당 스레드를 대기 상태로 전환한다.
4. 스레드는 CPU에서 내려오고, 스케줄러는 다른 실행 가능한 스레드에게 CPU를 할당한다.
5. I/O 완료 등의 이벤트가 발생하면 커널이 대기 중인 스레드를 다시 실행 가능한 상태로 변경한다.
6. 이후 스케줄러에 의해 다시 CPU를 할당받으면 시스템 콜이 반환되고 기존 작업을 이어간다.

```text
Running
   │
   │ blocking system call
   ▼
Waiting / Sleeping
   │
   │ I/O 완료
   ▼
Ready / Runnable
   │
   │ Scheduler
   ▼
Running
```

따라서 **Blocking 상태라고 해서 해당 스레드가 CPU를 계속 사용하며 기다리는 것은 아니다.**  
대부분의 경우 스레드는 커널의 대기 큐에서 잠들어 있고, 그동안 CPU는 다른 실행 가능한 스레드를 처리한다.

즉, Blocking은 CPU를 점유하며 기다리는 것이 아니라, 호출한 스레드의 실행 흐름이 중단되는 것이다.

### Blocking I/O 예시

소켓에 아직 읽을 데이터가 없는 상황에서 Blocking `read()`를 호출했다고 가정

```text
Thread
  │
  │ read()
  ▼
Kernel
  │
  │ 데이터 없음
  ▼
Thread 대기
  │
  │ 데이터 도착
  ▼
Thread Runnable
  │
  │ Scheduler
  ▼
read() 반환
```

호출한 스레드는 데이터가 도착하기 전까지 자신의 다음 코드를 실행할 수 없다.

## Non-Blocking

호출한 작업을 즉시 처리할 수 없더라도 기다리지 않고 제어권을 돌려받아 호출한 스레드가 다른 작업을 이어갈 수 있는 방식이다.  ^intro

Non-Blocking I/O에서는 커널이 요청을 즉시 처리할 수 없는 경우 스레드를 대기 상태로 만들지 않고 **현재 처리할 수 없다는 결과를 즉시 반환한다.**

예를 들어 Non-Blocking 소켓에서 `read()`를 호출했는데 읽을 데이터가 없다면 다음과 같이 동작한다.

```text
Thread
  │
  │ read()
  ▼
Kernel
  │
  │ 데이터 없음
  ▼
즉시 반환
  │
  ▼
Thread가 다른 작업 수행
```

Linux에서는 대표적으로 `EAGAIN` 또는 `EWOULDBLOCK`과 같은 결과를 통해 현재 작업을 수행할 수 없음을 알린다.

따라서 스레드는 커널 내부에서 데이터가 준비될 때까지 잠들지 않고 계속 자신의 실행 흐름을 유지할 수 있다.
다만 작업이 완료된 것은 아니므로 호출자는 이후 다시 상태를 확인해야 할 수 있다.

```text
read()
  ↓
데이터 없음 → 즉시 반환
  ↓
다른 작업
  ↓
read()
  ↓
데이터 없음 → 즉시 반환
  ↓
다른 작업
  ↓
read()
  ↓
데이터 존재 → 데이터 획득
```

단순히 반복적으로 상태를 확인하면 Polling으로 인해 CPU가 낭비될 수 있다.  
그래서 실제 서버에서는 `select`, `poll`, `epoll`과 같은 **I/O Multiplexing**을 함께 사용하여 여러 I/O의 준비 상태를 효율적으로 감시한다.

## OS 관점에서의 핵심 차이

|구분|Blocking|Non-Blocking|
|---|---|---|
|작업을 즉시 처리할 수 없는 경우|스레드를 대기시킴|즉시 반환|
|호출 스레드|실행 흐름 중단|실행 흐름 유지 가능|
|OS 스레드 상태|Waiting/Sleeping 상태가 될 수 있음|일반적으로 Runnable 상태 유지|
|CPU 점유|대기 중 CPU를 계속 점유하지 않음|계속 실행 가능|
|결과 확인|작업 완료 후 시스템 콜 반환|호출자가 다시 확인해야 할 수 있음|
여기서 Blocking/Non-Blocking은 **스레드가 기다리는 방식**에 대한 개념이지, 작업이 동시에 수행되는지 여부를 나타내는 동기/비동기와는 다른 개념이다.

## 출처 및 참고자료

```cardlink
url: https://www.youtube.com/watch?v=mb-QHxVfmcs
title: "BJ.19 block I/O vs non-block I/O 설명합니다! 소켓 I/O 예제로 주로 설명해요. I/O multiplexing도 설명합니다"
description: "#blockIO #nonblockIO #IOmultiplexing #socketIO #IO #데이터입출력I/O를 잘 알면 백엔드 애플리케이션의 성능 향상을 한단계 높일 수 있죠!요즘 게다가 대부분의 프로그래밍 언어는 non-block I/O를 적극 사용하니 반드시 짚고 넘어가야할 ..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/e60429bd/img/favicon_32x32.png
image: https://i.ytimg.com/vi/mb-QHxVfmcs/maxresdefault.jpg
```
