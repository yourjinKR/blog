---
date: 2026-09-29
aliases:
  - Aspect Oriented Programming
  - 관점 지향 프로그래밍
tags:
  - Spring
---
AOP는 횡단 관심사의 분리를 허용함으로써 모듈성을 증가시키는 것이 목적인 프로그래밍 패러다임이다. 

- 공통 관심 사항을 핵심 관심사항으로부터 분리시켜 핵심 로직을 깔끔하게 유지할 수 있다.
-  그에 따라 코드의 가독성, 유지보수성 등을 높일 수 있다. 
- 각각의 모듈에 수정이 필요하면 다른 모듈의 수정 없이 해당 로직만 변경하면 된다.
- 공통 로직을 적용할 대상을 선택할 수 있다

> [!NOTE] AOP가 필요한 이유
> 주문을 생성하고, 결제를 승인하고, 재고를 차감하는 메서드마다 실행 시간을 기록한다고 해보자. 각 메서드에 측정 코드를 직접 넣으면 같은 코드가 여러 곳에 반복된다. 기록 방식을 바꿀 때도 해당 메서드를 모두 수정해야 한다.
> 
> 주문·결제·재고 처리처럼 기능마다 고유한 일을 **핵심 관심사**라고 한다. 로깅, 실행 시간 측정, 트랜잭션처럼 여러 기능에 걸쳐 필요한 일을 **횡단 관심사**라고 한다. AOP(Aspect-Oriented Programming, 관점 지향 프로그래밍)는 횡단 관심사를 별도의 단위로 모듈화하고, 필요한 지점에 적용하는 방식이다.
> 
> 핵심 로직이 무엇을 할지와 공통 기능을 어디에서 실행할지를 나누어 관리할 수 있다.  
> AOP는 객체 지향 설계를 대체하는 개념이 아니라, 여러 객체에 걸친 공통 기능을 다루는 방법이다.

%%%%
## 핵심 용어

| 용어         | 의미                               | 실행 시간 측정 예시            |
| ---------- | -------------------------------- | ---------------------- |
| Aspect     | 횡단 관심사를 모아 둔 단위                  | 실행 시간을 측정하는 모듈         |
| Join point | 부가 기능을 적용할 수 있는 프로그램 실행 지점       | 메서드 실행                 |
| Pointcut   | 부가 기능을 적용할 Join point를 고르는 조건    | `OrderService`의 메서드 실행 |
| Advice     | 선택된 지점에서 실행할 동작 (실제로 추가되는 부가 기능) | 시작·종료 시각을 기록하는 코드      |
| Target     | 부가 기능이 적용되는 대상                   | `OrderService` 객체      |
| Weaving    | Aspect를 대상에 연결하는 과정              | 대상 호출에 측정 기능을 결합       |

예를 들어 “주문 서비스의 모든 메서드 실행 시간을 측정한다”는 요구사항에서는 **어디에 적용할지**를 Pointcut으로, **무엇을 할지**를 Advice로 표현한다. 이 둘을 묶어 관리하는 단위가 Aspect다.

Advice는 메서드 실행 전, 정상 반환 후, 예외 발생 후, 종료 후, 실행 전후 전체에 배치할 수 있다. 어떤 지점을 선택하고 어떻게 연결하는지는 AOP 구현 방식에 따라 달라진다.

Spring에서 이 개념을 어떻게 구현하는지는 [[Spring AOP]]에서 이어서 다룬다. 특히 Spring AOP의 Join point는 **Spring Bean의 메서드 실행**으로 한정된다.

## 출처 및 참고자료

```cardlink
url: https://ko.wikipedia.org/wiki/%EA%B4%80%EC%A0%90_%EC%A7%80%ED%96%A5_%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D
title: "관점 지향 프로그래밍 - 위키백과, 우리 모두의 백과사전"
host: ko.wikipedia.org
favicon: https://ko.wikipedia.org/static/favicon/wikipedia.ico
```

```cardlink
url: https://mangkyu.tistory.com/121
title: "[SpringBoot] AOP(Aspect Oriented Programming, 관점 지향 프로그래밍)의 개념 및 사용 방법 예제 코드 - (2/3)"
description: "1. AOP(Aspect Oriented Programming, 관점 지향 프로그래밍)이란? [ AOP(Aspect Oriented Programming, 관점 지향 프로그래밍)이란? ] 프로그래밍을 하다보면 공통적인 기능이 많이 발생한다. 이러한 공통 기능을 모든 모듈에 적용하기 위해 상속을 이용한다. 하지만 Java에서는 다중 상속이 불가능하며, 상속을 받아 공통 기능을 부여하기에는 한계가 있다. 예를 들어 우리가 개발한 API의 호출 시간을 측정하고 싶다고 하자. 이를 AOP없이 구현한다면 어떻겠는가? AOP를 적용하지 않는다면 중복 코드가 발생할 소지가 있고, 코드의 변경이 필요하면 여러 코드에 종속적으로 변경이 필요할 것이며, 핵심적인 비지니스 로직에 호출 시간 측정이라는 부수적인 로직이 추가되.."
host: mangkyu.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FvbL54%2FbtqVbWXEFnj%2FAAAAAAAAAAAAAAAAAAAAAGsbVQ-1WMjVR9IIxMbx_6FkXJ3aZuccL0C7panDkWqA%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DSjnorhhSs0mtM3OhbgSS0xYakSQ%253D
```
