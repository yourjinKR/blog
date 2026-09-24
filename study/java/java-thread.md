---
title: 자바의 스레드
aliases:
  - 자바의 스레드
---
# 프로세스와 스레드

프로세스는 관리의 단위이다.  

프로세스(작업)는 최소 1개의 스레드(실행)를 갖는다.     
- 그러나 이 흐름이 1개가 아닌 N개가 될 수 있다. (멀티스레딩)
- 각각의 스레드는 **동시**에 각자 **작동**한다.

OS는 가상 메모리를 프로세스에게 할당한다.  
- 가상 메모리는 프로세스로 제한된 공간이다.  

**프로세스에 속한 모든 스레드는 프로세스의 가상메모리로 공간이 제약된다.**  

스레드마다 각자 고유한 **TLS(Thread Local Storage)** 를 가지고 있다.  
자바에서는 이를 [[ThreadLocal]]에서 관리한다.  

스레드는 프로세스에 비해 메모리를 작게 점유한다.  
그래서 스레드를 경량 프로세스라고 부르기도 한다.  

# 스레드 생성

자바에서 스레드를 생성하는 방법은 2가지
- `Runnable` 인터페이스
- `Thread` 클래스

### `run()`메서드와 `start()`메서드의 차이

- `run()`: 실행할 작업을 정의 (새로운 스레드를 실행하지 않음)
- `start()`: 실행 환경을 만들기 (새로운 스레드를 만듦)

내부적으로 `start()` 메서드는 아래 작업을 수행 

1. 새로운 스레드 생성
2. 스레드 상태 관리
3. 호출 스택 할당
4. 운영체제 스케줄러에 실행 요청
5. 새 스레드에서 `run()` 실행

```java
public class ThreadAndRunnableSample {  
    public static void main(String[] args) {  
        ThreadSample threadSample = new ThreadSample();  
        threadSample.run();  
        threadSample.start();  
  
        RunnableSample runnableSample = new RunnableSample();  
        runnableSample.run();  
        new Thread(runnableSample).start();  
    }  
}  
  
class ThreadSample extends Thread {  
    @Override  
    public void run() {  
        System.out.println(Thread.currentThread().getName() + ": thread sample");  
    }  
}  
  
class RunnableSample implements Runnable {  
    @Override  
    public void run() {  
        System.out.println(Thread.currentThread().getName() + ": runnable sample");  
    }  
}
```

```
main: thread sample
Thread-0: thread sample
main: runnable sample
Thread-1: runnable sample
```

## 출처 및 참고자료

https://www.youtube.com/watch?v=x-Lp-h_pf9Q  