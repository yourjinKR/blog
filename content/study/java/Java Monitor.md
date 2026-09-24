---
tags:
  - Java
aliases:
  - Java 모니터
  - 자바 모니터
---
자바에서 모든 객체는 내부적으로 모니터를 가진다.  
모니터의 상호 배제 기능은 `synchronized` 키워드로 사용한다.  

```java
synchronized public void consume() {  
    // logic  
}  
  
public void produce() {  
    synchronized (this) {  
        // logic  
    }  
}
```

자바의 모니터는 조건변수를 하나만 가진다.  

> 두 가지 이상의 조건변수가 필요하다면 별도로 구현해야 한다.  

조건변수에 대해 3가지 메소드를 지원한다. 해당 메서드는 Object 클래스에 기술되어 있다.  

- `wait`
- `notify`: (signal)
- `notifyAll` (broadcast)

## 출처 및 참고자료

https://www.baeldung.com/cs/monitor  
https://www.youtube.com/watch?v=Dms1oBmRAlo&t=954s  
https://chatgpt.com/share/6a9faa34-72b4-83ee-8b9b-42259bb57b6b  