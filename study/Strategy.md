---
date: 2026-11-27
tags:
  - DesignPattern
aliases:
  - Strategy Pattern
  - 전략
  - 전략 패턴
---
전략 패턴은 **알고리즘군(a family of algorithms)을 정의하고, 각 알고리즘을 캡슐화하여, 필요에 따라 서로 교체해서 사용할 수 있게** 만드는 디자인 패턴입니다. 즉, **'무엇을'** 할 것인지는 `Context`(문맥) 객체에 그대로 두고, **'어떻게'** 할 것인지를 다양한 `Strategy`(전략) 객체에 위임하는 방식입니다.  

> 대표적인 예시로는 `PaymentService` 인페이스가 있고 카드결제, 간편결제 등등을 구현한
> `XXXPaymentServiceImpl`가 있습니다. 결제 모듈을 호출하는 객체에서는 세부 동작 방식을 알 필요 없이 주어진
> context에 따라 처리 방식이 정해지고 그에 대한 결과값을 얻을 수 있습니다.  


![[IMG-20261127194041367.png]]

![[IMG-20261127194103424.png]]


## 출처 및 참고자료

```cardlink
url: https://jeongcheogi.edugamja.com/theory/sw-design/design-pattern-behavior-strategy
title: "전략 strategy 패턴 - 자바스크립트 예제"
description: "전략 strategy 패턴을 타입스크립트 코드와 함께 알아봅니다."
host: jeongcheogi.edugamja.com
favicon: https://jeongcheogi.edugamja.com/favicon.ico?favicon.2ns115htqsj_s.ico
image: https://jeongcheogi.edugamja.com//folder-icons/theory/sw-design/design-pattern-behavior-strategy.webp
```
