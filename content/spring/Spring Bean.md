---
tags:
  - Spring
aliases:
  - Bean
  - 스프링 빈
  - 빈
---
Spring IoC Container에 의해 인스턴스화 되고 설정되고 조립되어 관리되는 객체를 말한다.

## Bean 

- **스프링 컨테이너 생성**
- **스프링 빈 생성** (객체화)
- **의존관계 주입** (DI - Setter나 Field 주입 시점)
- **초기화 콜백** (빈이 완전히 생성된 후 할 일, `@PostConstruct`)
- **사용** (애플리케이션 로직 수행)
- **소멸 전 콜백** (죽기 전에 할 일, `@PreDestroy`)
- **스프링 종료**

## Bean Scope

컨테이너에서 Bean의 생명주기 및 범위를 정하는 방식이다.  
Spring에서 지원하는 스코프는 다음과 같다.

- Singletone (IoC Container의 기본 전략)
- Prototype
- Web
    - Request
    - Session
    - Application
    - Websocket

> 상태를 저장하는 빈에는 프로토타입 스코프를, 상태를 저장하지 않는 빈에는 싱글턴 스코프를 사용하는 것이 좋다.

xml로 등록할때는 `scope` 속성에 값을 지정한다.  

```xml
%% Singleton %%
<bean id="accountService" class="com.something.DefaultAccountService" scope="singleton"/>

%% Prototype %%
<bean id="accountService" class="com.something.DefaultAccountService" scope="prototype"/>
```

### Singleton

- 스프링 IoC 컨테이너당 **단 하나의 인스턴스**만 생성
- 별도의 설정이 없다면 해당 방식으로 모든 빈은 싱글톤으로 생성하여 **메모리를 절약**
- **상태를 공유**하기 때문에 동시성 문제에 주의  

### Prototype

- 특정 빈에 대한 요청이 있을 때마다 새로운 인스턴스를 생성하여 반환
	- `getBean()` 호출 시
	- 의존성 주입 시
- 다른 스코프와 달리 **라이프사이클을 관리하지 않음**
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

