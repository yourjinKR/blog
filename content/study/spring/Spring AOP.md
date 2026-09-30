---
date: 2026-09-29
tags:
  - Spring
---
[[AOP]]는 여러 기능에 걸쳐 필요한 부가 기능을 분리하는 방법이다. Spring AOP는 이를 **Spring Bean의 메서드 실행**에 적용한다. 로깅이나 실행 시간 측정을 서비스 메서드마다 작성하지 않고, 적용할 메서드와 실행할 코드를 따로 정의할 수 있다.

## 동작 방식: 프록시를 통한 호출

![[IMG-20260929220126962.png]]

Spring AOP는 대상 Bean을 감싸는 **프록시 객체**를 만든다. 다른 객체가 해당 Bean의 메서드를 호출하면 프록시가 먼저 요청을 받는다. 프록시는 Pointcut에 맞는 Advice를 실행하고, 실제 대상 메서드로 호출을 전달한다.

```text
호출자 → 프록시 → Advice → 대상 Bean의 메서드
```

메서드가 끝난 뒤에도 Advice 종류에 따라 반환값이나 예외를 처리할 수 있다. Spring의 선언적 트랜잭션이 대표적인 활용 사례다. `@Transactional`을 처리하는 기본 방식도 프록시를 이용해 메서드 호출 전후에 트랜잭션 동작을 적용한다.

Spring AOP는 인터페이스 기반 [[JDK Dynamic Proxy]] 또는 클래스 기반 **[[CGLIB]] 프록시**를 사용한다. Spring Boot의 기본 자동 설정은 CGLIB를 사용하며, `spring.aop.proxy-target-class=false`로 설정하면 JDK 동적 프록시를 사용할 수 있다.

![[CGLIB#AspectJ와 CGLib]]

%%%%
## 주요 용어와 Advice 종류

[[AOP]]의 개념 중 Spring AOP에서 특히 중요한 것은 다음과 같다.

- **Join point**: 부가 기능을 적용할 수 있는 지점. Spring AOP에서는 메서드 실행이다.
- **Pointcut**: 어떤 메서드 실행을 선택할지 정하는 조건이다. (어디에 적용할 것인가?)
- **Advice**: 선택된 메서드가 실행될 때 수행할 부가 기능이다. (무엇을 실행할 것인가?)
- **Advisor**: **Pointcut + Advice** (어디에 무엇을 실행할 것인가?)
- **Aspect**: Pointcut과 Advice를 묶은 모듈이다.  
- **Target**: 실제 적용 대상
- **Proxy** 호출을 가로채는 객체

> [!NOTE]
> AspectJ 전체 관점에서는 메서드 실행뿐 아니라 생성자 실행, 필드 접근 등 다양한 Join Point가 존재할 수 있다.  
> 하지만 **Spring AOP는 Proxy 기반**이기 때문에 핵심적으로 다루는 Join Point는 **메서드 실행**이다.  

| Advice            | 실행 시점                            |
| ----------------- | -------------------------------- |
| `@Before`         | Target 실행 전                      |
| `@AfterReturning` | Target 정상 반환한 후                  |
| `@AfterThrowing`  | Target 예외 발생 후                   |
| `@After`          | Target 종료 후 (정상 반환과 예외 발생에 관계없이) |
| `@Around`         | Target 실행 전후 전체                  |

필요한 동작을 구현할 수 있는 가장 단순한 Advice를 선택하는 편이 좋다. 실행 전에 로그만 남긴다면 `@Before`로 충분하다. 실행 전후의 시간을 함께 측정해야 한다면 `@Around`를 사용할 수 있다.

## 적용 예시: 서비스 메서드 실행 시간 측정

Spring Boot 3에서는 다음 의존성을 사용한다. Spring Boot 4에서는 스타터 이름이 `spring-boot-starter-aspectj`다. **Boot 4의 스타터 이름에 AspectJ가 들어가더라도, `@Aspect`를 사용한 일반적인 Spring AOP는 프록시 기반**으로 동작한다.

```groovy
// Spring Boot 3
implementation("org.springframework.boot:spring-boot-starter-aop")

// Spring Boot 4
implementation("org.springframework.boot:spring-boot-starter-aspectj")
```

Spring Boot는 필요한 AspectJ 라이브러리가 클래스패스에 있으면 `@Aspect` 자동 프록시 설정을 활성화하므로, 일반적인 Boot 애플리케이션에서는 `@EnableAspectJAutoProxy`를 따로 선언하지 않아도 된다.

다음 Aspect는 `com.example.order.OrderService`의 메서드 실행 시간을 기록한다.

```java
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ExecutionTimeAspect {
    private static final Logger log = LoggerFactory.getLogger(ExecutionTimeAspect.class);

    @Around("execution(* com.example.order.OrderService.*(..))")
    public Object measure(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.nanoTime();
        try {
            return joinPoint.proceed();
        } finally {
            long elapsed = System.nanoTime() - start;
            log.info("{} 실행 시간: {} ns", joinPoint.getSignature().toShortString(), elapsed);
        }
    }
}
```

`execution(* com.example.order.OrderService.*(..))`는 `OrderService` 타입의 메서드 실행을 선택하는 Pointcut 표현식이다. `*`는 반환 타입과 메서드 이름의 제한이 없음을, `(..)`는 인자의 개수와 타입에 제한이 없음을 뜻한다. `joinPoint.proceed()`가 실제 호출을 이어 가며, 반환값을 그대로 돌려준다. `finally`에서 시간을 기록하므로 메서드가 예외를 던져도 측정 로그가 남는다.

## self-invocate 문제

Spring AOP는 **프록시를 거친 호출**에 Advice를 적용한다. 같은 객체 안에서 `this.otherMethod()`로 다른 메서드를 호출하면 프록시를 거치지 않으므로 그 내부 호출에는 Advice가 적용되지 않는다. `@Transactional`을 같은 클래스의 다른 메서드에서 직접 호출할 때 트랜잭션이 시작되지 않는 것도 같은 이유다. 

```java
@Service
public class OrderService {

    public void order() {
        saveOrder(); // this.saveOrder()
    }

    @Transactional
    public void saveOrder() {
        // DB 작업
    }
}
```

이 경우 호출 경계를 다른 Bean으로 분리해 프록시를 통과하도록 설계할 수 있다.

```java
@Service
public class OrderService {

    private final OrderTransactionService orderTransactionService;

    public void order() {
        orderTransactionService.saveOrder();
    }
}
```

또한 Spring AOP는 Spring Bean의 메서드 실행을 대상으로 한다. 직접 `new`로 만든 일반 객체나 생성자 실행을 Pointcut으로 가로채는 용도에는 맞지 않는다. 클래스 기반 프록시에서는 `final` 클래스와 `final`·`private` 메서드에도 제약이 있다. 메서드 호출 외의 지점까지 다뤄야 한다면 Spring AOP와 AspectJ 위빙의 차이를 확인해야 한다.

%%%%
	## 출처 및 참고자료

```cardlink
url: https://catsbi.oopy.io/fb62f86a-44d2-48e7-bb9d-8b937577c86c
title: "AOP(Aspect Oriented Programming)"
description: "1. 개요"
host: catsbi.oopy.io
image: https://oopy.lazyrockets.com/api/v2/notion/image?src=https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F0c9aec3e-f216-43aa-b040-9196b9c4e950%2FUntitled.png&blockId=0feac740-7690-4d29-bcdb-48abc9b40fbe&width=2400
```

```cardlink
url: https://mangkyu.tistory.com/161
title: "[Spring] AOP(Aspect Oriented Programming, 관점 지향 프로그래밍)의 이해 - (1/3)"
description: "이 내용은 토비의 스프링 1권의 797부터 시작하는 내용을 참고하며 작성하였습니다. 1. AOP(Aspect Oriented Programming, 관점 지향 프로그래밍)의 이해 [ AOP(Aspect Oriented Programming, 관점 지향 프로그래밍)의 등장 ] AOP(Aspect Oriented Programming, 관점 지향 프로그래밍)를 이해하기 위해서는 어드바이스(Advice), 포인트컷(PointCut)를 이해해야 한다. 어드바이스(Advice): 타겟 오브젝트에 적용하는 부가 기능을 담은 오브젝트 포인트컷(PointCut): 메소드 선정 알고리즘을 담은 오브젝트 부가기능은 핵심기능과 섞이면 설계와 코드가 지저분해지기 때문에 부가기능을 독립적인 모듈로 만들고자 하는 필요성이 대두되.."
host: mangkyu.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Ftistory_admin%2Fstatic%2Fimages%2FopenGraph%2Fopengraph.png
```

```cardlink
url: https://velog.io/@suhongkim98/JDK-Dynamic-Proxy%EC%99%80-CGLib
title: "JDK Dynamic Proxy와 CGLib를 알아보자 #2"
description: "Dynamic Proxy와 CGLib을 실습해보며 AOP를 이해해보았습니다."
host: velog.io
favicon: https://static.velog.io/favicons/favicon-32x32.png
image: https://velog.velcdn.com/images/suhongkim98/post/f93225b8-4fd2-4f9c-91cc-92e76f25f818/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202022-01-27%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%201.33.38.png
```
