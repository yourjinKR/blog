---
title: ThreadLocal
aliases:
  - ThreadLocal
  - 스레드 로컬
---
# ThreadLocal

각각의 스레드 별로 필요한 정보를 저장할 수 있도록 스레드 로컬이라는 기술을 제공한다.  

```java
public class ThreadLocal<T> {

}
```

대표적으로 스프링에서는 데이터베이스 접근 기술은 스레드 로컬을 기반으로 동작한다.  

![[Pasted image 20260716221613.png]]

## 출처 및 참고자료

https://mangkyu.tistory.com/333  
