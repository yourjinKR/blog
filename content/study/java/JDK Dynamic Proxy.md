---
date: 2026-09-29
tags:
  - Java
aliases:
  - JDK 동적 프록시
---
JDK 에서 제공하는 Dynamic Proxy는 **Interface를 기반으로 Proxy를 생성**해주는 방식이다.  

자바에서는 [[Java Reflaction|리플렉션]]을 활용한 `Proxy` 클래스를 제공해주고 있다.  
`Java.lang.reflect.Proxy` 클래스의 `newProxyInstance()` 메소드를 이용해 프록시 객체를 생성한다.  

```java
Card bingo = (Card) Proxy.newProxyInstance(  
        Card.class.getClassLoader(),  
        new Class[]{Card.class},  
        new CardProxyHandler(new BingoCard()) {  
        });  
  
bingo.draw();  
bingo.getValues();
```