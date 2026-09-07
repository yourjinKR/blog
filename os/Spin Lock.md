---
tags:
  - OS
aliases:
  - 스핀 락
---
[[critical section|임계 구역]]에 진입이 불가능 할 때 진입이 가능할 때까지 루프를 돌면서 재시도 하는 방식으로 구현한 락을 말한다.  

```c
volatile int lock = 0;

void critical() {
	while (test_and_set(&lock))
	// critical section
	lock = 0;
}
```

```c
int TestAndSet(int* lockPtr) {
	int oldLock = *lockPtr;
	*lockPtr = 1;
	return oldLock;
} 
```

`TestAndSet`은 atomic 명령어이다.  

> [!QUESTION] atomic이란?
> atomic은 원자적이라는 뜻이다.  
> 실행 중간에 간섭받거나 중단되지 않으며 같은 메모리 영역에 대해 동시에 실행되지 않는 것을 말한다.  

%%%%
## 문제점

스핀락은 Busy-Waiting 방식이기에 CPU 리소스에 낭비가 발생한다.  

```java
void critical() {
	while (test_and_set(&lock)) // 반복적으로 잠금상태인지 검증
	lock = 0;
}
```

### Busy-Waiting

- 원하는 자원을 얻기 위해 기다리는 것이 아니라 **권한을 얻을 때까지 반복적으로 확인**하는 것을 의미한다.
- CPU의 자원을 쓸데 없이 낭비하기 때문에 좋지 않은 쓰레드 동기화 방식이다.
