---
date: 2026-09-24
tags:
  - Spring
aliases:
  - Bean
  - 스프링 빈
  - 빈
---
Bean이란 Spring IoC Container에 등록되어 생성, 의존관계 설정, 생명주기 관리 등을 받는 객체를 말한다.  

## Bean LifeCycle

- **Bean 인스턴스 생성**
	- 생성자 주입은 이 과정에서 수행될 수 있다.
- **의존관계 주입**
	- Setter / Field 주입 등
- **초기화 전 BeanPostProcessor**
- **초기화 콜백**
	- `@PostConstruct`
	- `InitializingBean#afterPropertiesSet()`
	- `initMethod`
- **초기화 후 BeanPostProcessor**
- **Bean 사용**
- **소멸 콜백**
	- `@PreDestroy`
	- `DisposableBean#destroy()`
	- `destroyMethod`
- **Bean 소멸**

### Bean 등록 및 생성 과정

- 설정 정보 탐색
- [[BeanDefinition]] 생성
- BeanDefinitionRegistry 등록
- BeanFactory가 BeanDefinition을 기반으로 Bean 생성

### BeanPostProcessor

객체를 빈 저장소에 등록하기 전에 조작할 때 사용하는 후처리 기능을 지원하는 인터페이스이다.  
객체 조작 및 완전히 다른 객체로 바꿔치기할 수 도 있다. (프록시 객체)  

![[IMG-20260928191149113.png]]

> 위 사진은 `BeanPostProcessor`의 default 메서드이다.   
> 리턴 타입이 `Object`로 매개변수로 받은 객체와 타입이 일치하지 않아도 동작한다.  

> [!QUESTION]- `@PostConstruct`는 생성자의 대체재인가?
> 생성자는 객체 자체를 올바른 상태로 만드는 역할을 담당한다. `@PostConstruct`는 Spring이 Bean 생성과 의존관계 설정을 완료한 후 추가 초기화 작업을 수행하는 생명주기 콜백 역할을 담당한다.  

%%%%
## Bean Scope

컨테이너에서 Bean의 생명주기 및 범위를 정하는 방식이다.  
xml로 등록할때는 `scope` 속성에 값을 지정한다.  

```xml
<bean id="accountService" class="com.something.DefaultAccountService" scope="singleton"/>

<bean id="accountService" class="com.something.DefaultAccountService" scope="prototype"/>
```

> 상태를 저장하는 빈에는 프로토타입 스코프를, 상태를 저장하지 않는 빈에는 싱글턴 스코프를 사용하는 것이 좋다.

### Singleton

- 스프링 IoC 컨테이너당 **단 하나의 인스턴스**만 생성
- 별도의 설정이 없다면 해당 방식으로 모든 빈은 싱글톤으로 생성하여 **메모리를 절약**
- **상태를 공유**하기 때문에 동시성 문제에 주의  

> [!NOTE]
> 별다른 설정이 없다면 Bean을 Singleton으로 생성한다. 그 이유는 Spring은 대규모 트래픽을 처리할 수 있도록 설계한 프레임워크이다. 만약 매 요청마다 Bean을 생성한다면 수만개의 빈이 새로 생기고 소멸되기에 부하로 인한 성능저하가 발생할 것이다. 이를 해결하고자 싱글톤으로 생성하고 해당 빈은 여러 스레드가 공유하여 처리하는 방식을 택했다.  

> [!CAUTION]
> 정확히는 **Container별, BeanDefinition별 하나의 인스턴스**입니다.  
> GoF [[Singleton]]처럼 JVM 전체에 하나라는 뜻은 아닙니다.

%%%%
#### Singleton Registry

기존 [[Singleton|싱글톤]]의 단점을 보완하고자 스프링 컨테이너가 싱글톤 레지스트리의 역할을 하여 빈을 싱글톤으로 관리한다.  

- `static` 메소드나 `private` 생성자 등을 사용하지 않아 객체지향적 개발을 할 수 있다.
- 테스트를 하기 편리하다.

`SingletonBeanRegistry`를 구현한 `DefaultSingletonBeanRegistry` 클래스에서 확인 가능하다.  

![[IMG-20260926192249211.png]]


> - `SpringApplication#refresh(context)`
> - `applicationContext.refresh()`
> - `AbstractApplicationContext#refresh()`
> - `AbstractApplicationContext#registerBeanPostProcessors(beanFactory)`
> - `PostProcessorRegistrationDelegate#registerBeanPostProcessors(...)`
> - `beanFactory.getBean(...)`
> - `AbstractBeanFactory#getBean(...)`
> - `AbstractBeanFactory#doGetBean(...)`
> - `DefaultSingletonBeanRegistry#getSingleton(...)`

### Prototype

- 특정 빈에 대한 요청이 있을 때마다 새로운 인스턴스를 생성하여 반환
	- `getBean()` 호출 시
	- 의존성 주입 시
- 다른 스코프와 달리 **라이프사이클을 관리하지 않음**
	- 빈 생성 이후 소멸 처리를 담당하지 않는다. (컨테이너가 종료되어도 `@PreDestroy`를 자동 호출하지 않음)
	- 클라이언트 코드는 프로토타입 스코프 객체를 정리하고 프로토타입 빈이 보유한 비용이 많이 드는 리소스를 해제할 필요가 있음

스프링 컨테이너는 프로토타입 빈을 생성하고 의존성을 주입한 까지만 관리하며, 그 이후의 관리(소멸 등)는 빈을 받아간 클라이언트가 책임져야 한다.

> [!WARNING]
> 프로토타입 빈을 싱글톤 빈과 함께 사용할 때는 주의가 필요합니다. 싱글톤 빈이 생성될 때 프로토타입 빈이 딱 한 번만 주입되기 때문에, 매번 새로운 객체를 원한다면 `Provider`나 `Proxy` 설정을 고려해야 합니다.

### Web

- 스프링 웹 환경(`WebApplicationContext`)에서만 사용할 수 있는 특수 스코프
- `request`: 각각의 HTTP 요청마다 새로운 빈을 만듭니다.
- `session`: HTTP 세션(사용자 로그인 상태 등)마다 하나의 빈을 만듭니다.

| **스코프**         | **생성 및 소멸 시점**           | **비고**                |
| --------------- | ------------------------ | --------------------- |
| **request**     | HTTP 요청이 들어오고 나갈 때까지 유지  | 각 요청마다 별도의 인스턴스 생성    |
| **session**     | HTTP 세션이 생성되고 종료될 때까지 유지 | 사용자별로 상태를 유지해야 할 때 사용 |
| **application** | 서블릿 컨텍스트와 동일한 생명주기       | 웹 애플리케이션 전체에서 공유      |

## 출처 및 참고자료

```cardlink
url: https://docs.spring.io/spring-framework/reference/core/beans/definition.html
title: "Bean Overview :: Spring Framework"
host: docs.spring.io
favicon: ../../_/img/favicon.ico
```

```cardlink
url: https://www.youtube.com/watch?v=-_FNmARpB6U
title: "'스프링 핵심 원리 - 고급편 : 빈 후처리기' | 인프런 | 강의 미리보기"
description: "🔔  우아한형제들 개발 팀장 김영한 님의 스프링 강의가 궁금하시다면? 🔔🌱 더 알아보기 : https://bit.ly/3CFKnop자바 스프링 완전 정복 시리즈의 여섯 번째 강의!스프링 핵심 원리, 알면 더 자신있게 사용할 수 있어요. 💪진짜 실무자에게 제대로 배우세요!#디..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/af0a3c1e/img/favicon_32x32.png
image: https://i.ytimg.com/vi/-_FNmARpB6U/hqdefault.jpg
```

```cardlink
url: https://mininkorea.tistory.com/71
title: "스프링 BeanDefinition 완벽 정리: 빈 설정 메타정보 탐구"
description: "스프링 BeanDefinition 완벽 정리: 빈 설정 메타정보 탐구1. BeanDefinition이란?BeanDefinition은 스프링 컨테이너가 빈(bean)의 메타정보를 담아두는 추상화 모델이다. 스프링은 다양한 형태의 빈 설정 정보(Java Config, XML, 어노테이션)를 모두 BeanDefinition이라는 하나의 모델로 추상화하여 사용한다.즉, 개발자가 Java 코드로 설정하든, XML로 설정하든 스프링 내부에서는 결국 BeanDefinition 객체로 변환되어 관리된다.  2. BeanDefinition 주요 정보BeanDefinition이 담고 있는 주요 속성은 다음과 같다:BeanClassName: 생성할 빈의 클래스명예) hello.core.service.MemberService.."
host: mininkorea.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbpSmZc%2FbtsLkKYAhOg%2FAAAAAAAAAAAAAAAAAAAAAIq8lr1-mhBBLEPhURDW-1WT4MloaRZUsszj9fAFy9e2%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DGlujXJOfKiPj1BRQ3EbTT%252BrjxgE%253D
```
