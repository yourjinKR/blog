---
tags:
  - OS
aliases:
  - 뮤텍스
---
뮤텍스란 여러 [[thread|스레드]]나 [[process|프로세스]]가 공유 자원에 동시에 접근하는 것을 막고 하나의 스레드만 접근하도록 제한하는 상호 배제 동기화 기법입니다.  ^intro

- 뮤텍스는 자원에 대한 접근을 동기화하기 위해 사용되는 상호배제 기술  
- 뮤텍스는 Locking 메커니즘으로 구현
- 오직 하나의 쓰레드만이 [[critical section|임계 구역]]에 진입 가능
- 하며 뮤텍스를 획득한 스레드만 뮤텍스를 해제 가능
- 이진적 특성을 지닌다 (잠금 또는 잠금 해제 중 하나이다)
- 블로킹: 스레드가 잠긴 뮤텍스를 획득하려고 시도하면, 뮤텍스가 해제될 때까지 해당 스레드는 차단

```
wait (mutex);
...
Critical Section
...
signal (mutex);
```

- Boolean 타입의 Lock 변수를 지닌다.  
- Acquire/Release 메서드를 통해 뮤텍스를 얻고 해제한다.  
- Non-Busy-Waiting 방식이다.

![[Spin Lock#Busy-Waiting]]

## Mutex의 문제점

예외 발생시 `unlock`에 대한 수행이 꼭 이뤄져야 한다.  

```java
lock.lock();

try {
	doSomething();
} finally {
	lock.unlock();
}
```

여러 뮤텍스를 동시에 사용시 데드락의 위험성이 존재한다.  

```
A → B가 필요
B → A가 필요
```

## 출처 및 참고자료

https://www.tutorialspoint.com/article/mutex-vs-semaphore#:~:text=A%20Mutex%20is%20different%20than,be%20used%20as%20a%20semaphore.