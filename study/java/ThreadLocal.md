---
title: ThreadLocal
aliases:
  - ThreadLocal
  - 스레드 로컬
---
# ThreadLocal

Java에서 지원하는 Thread safe한 기술로 멀티 스레드 환경에서 각각의 스레드에게 별도의 저장공간을 할당하여 별도의 상태를 갖을 수 있게끔 도와준다.

![[Pasted image 20260716222954.png|272]]


대표적으로 스프링에서는 데이터베이스 접근 기술은 스레드 로컬을 기반으로 동작한다.  
스프링 시큐리티에서는 SpringS

![[Pasted image 20260716221613.png]]

## 출처 및 참고자료

https://docs.oracle.com/javase/8/docs/api/java/lang/ThreadLocal.html  
https://mangkyu.tistory.com/333  
