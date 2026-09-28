---
date: 2026-09-24
tags:
  - Spring
---
Spring은 [[Spring DI|DI]]를 적극적으로 사용하여 [[IoC]]를 구현합니다.  
객체가 스스로 의존 객체를 생성하고 구성하지 않고, 그 제어권을 외부에 맡기는 것이 IoC이다.  
Spring에서는 그 외부 역할을 [[#Spring Container]]가 수행한다.  

## Spring Container

Spring Container는 **애플리케이션을 구성하는 [[Spring Bean|Bean]]을 생성하고, 설정하고, 서로 연결하고, 관리하는 역할**을 담당한다.  
Spring의 Container와 관련된 대표적인 인터페이스로는 [[#BeanFactory]]와 [[#ApplicationContext]]가 있다.  

%%%%
## BeanFactory

빈을 생성하고 의존관계를 설정하는 기능을 담당하는 가장 기본적인 IoC 컨테이너이다.  

```java
Object getBean(String name) throws BeansException;
boolean containsBean(String name);
```

대표 하위 인터페이스로는 다음과 같으며 [[#ApplicationContext]]에서 이를 구현한다.  

- `ListableBeanFactory`: Container에 존재하는 Bean들을 **목록 단위로 탐색**할 수 있는 기능을 추가
- `HierarchicalBeanFactory`: BeanFactory 사이에 **부모-자식 계층 구조**를 만들 수 있도록 하는 인터페이스

## ApplicationContext

`ApplicationContext`는 `BeanFactory`를 확장한 IoC 컨테이너이며 아래와 같은 여러 기능을 부가적으로 지원한다.  

- Spring의 AOP 기능과의 더욱 쉬운 통합
- 메시지 리소스 처리(국제화에 사용)
- 이벤트 게시
- `WebApplicationContext` 웹 애플리케이션에서 사용되는 것과 같은 애플리케이션 계층별 컨텍스트

![[IMG-20260924182128276.png]]

### EnvironmentCapable

현재 컴포넌트가 사용하는 `Environment`에 접근할 수 있도록 하는 인터페이스이다.

`Environment`는 크게 다음과 같은 **애플리케이션 실행 환경 정보**를 관리한다.

- 활성화된 Profile
- 기본 Profile
- 환경 변수
- JVM System Property
- `application.properties`, `application.yml` 등에 의해 구성되는 PropertySource

따라서 `ApplicationContext`를 통해 다음처럼 환경 설정 값을 조회할 수 있다.

```java
Environment environment = applicationContext.getEnvironment();

String profile = environment.getProperty("spring.profiles.active");
String url = environment.getProperty("spring.datasource.url");
```

### MessageSource

메시지를 **코드로 관리하고 Locale에 따라 다른 메시지를 제공하기 위한 인터페이스**

```properties
# messages_ko.properties
welcome=환영합니다 {0}

# messages_en.properties
welcome=Welcome {0}
```

```java
String message = applicationContext.getMessage(
        "welcome",
        new Object[]{"어진"},
        Locale.KOREAN
);
// message = "환영합니다 어진"
```

### ApplicationEventPublisher

Spring ApplicationContext 내부에서 **이벤트를 발행할 수 있도록 하는 인터페이스**

### ResourceLoader

파일, ClassPath 리소스 등 외부 Resource를 **통일된 `Resource` 추상화로 로딩하기 위한 인터페이스**이다.

#### ResourcePatternResolver

`ResourceLoader`가 **하나의 Resource를 찾는 기능**이라면, `ResourcePatternResolver`는 패턴을 이용해 **여러 Resource를 검색할 수 있는 기능**을 추가한다.


## 출처 및 참고자료

```cardlink
url: https://mangkyu.tistory.com/151
title: "[Spring] 애플리케이션 컨텍스트(Application Context)와 스프링의 싱글톤(Singleton)"
description: "이번에는 애플리케이션 컨텍스트에 대해 간단히 알아보도록 하겠습니다. 1. 애플리케이션 컨텍스트(Application Context) [ 애플리케이션 컨텍스트(Application Context)란? ] Spring에서는 빈의 생성과 관계설정 같은 제어를 담당하는 IoC(Inversion of Control) 컨테이너인 빈 팩토리(Bean Factory)가 존재한다. 하지만 실제로는 빈의 생성과 관계설정 외에 추가적인 기능이 필요한데, 이러한 이유로 Spring에서는 빈 팩토리를 상속받아 확장한 애플리케이션 컨텍스트(Application Context)를 주로 사용한다. 애플리케이션 컨텍스트는 별도의 설정 정보를 참고하고 IoC를 적용하여 빈의 생성, 관계설정 등의 제어 작업을 총괄한다. 애플리케이션 컨텍.."
host: mangkyu.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbMJKcD%2Fbtq4p73lmRj%2FAAAAAAAAAAAAAAAAAAAAALjLob5_QJZ8DxLKW7qkbWHJgOPkWNoksxynJXcksizv%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DBBY4Wj6kM%252BD3Wwuqf4N0bIp6izw%253D
```

```cardlink
url: https://docs.spring.io/spring-framework/reference/core/beans/introduction.html
title: "Introduction to the Spring IoC Container and Beans :: Spring Framework"
host: docs.spring.io
favicon: ../../_/img/favicon.ico
```

```cardlink
url: https://chatgpt.com/share/6ab4f1a1-2704-83ee-b4c3-ea7f994f7ab2
title: "Check out this chat"
description: "Here's a chat someone thought you'd want to see."
host: chatgpt.com
favicon: https://chatgpt.com/favicon.ico
image: https://ogimg.chatgpt.com/conversation/6ab4f1a1-2704-83ee-b4c3-ea7f994f7ab2/response_multicolor_v1.png
```
