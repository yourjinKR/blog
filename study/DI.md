---
date: 2026-09-24
aliases:
  - Dependency Injection
  - 의존성 주입
tags:
  - Spring
---
의존성 주입이란 어떤 객체가 정상적인 기능을 하기 위해 필요한 의존성을 외부에서 제공해주는 것을 의미한다.  ^intro

## DI의 목적

의존성 주입을 통해 객체 간의 결합도를 낮추고 코드의 유연성과 유지보수성을 높인다.  

## 코드로 보는 예시

DI가 적용된 코드

```java
public class OrderService {

    private final PaymentService paymentService;

    public OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```

DI가 적용되지 않은 코드

```java
public class OrderService {

    private final PaymentService paymentService;

    public OrderService() {
        this.paymentService = new KakaoPaymentService();
    }
}
```

## 출처 및 참고자료

```cardlink
url: https://junhyunny.github.io/spring-boot/design-pattern/spring-ioc-di/
title: "스프링 프레임워크의 제어의 역전(IoC)과 의존성 주입(DI)"
description: "<br />"
host: junhyunny.github.io
```
