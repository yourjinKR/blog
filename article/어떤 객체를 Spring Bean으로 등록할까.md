---
date: 2026-09-23
tags:
  - Spring
---

모든 객체를 [[Spring Bean|스프링 빈]]으로 등록할 경우에는 메모리 사용량이 많아짐에 따라 애플리케이션의 성능에 문제가 생길 수 있다. 

그렇기에 어떤 클래스를 Bean으로 등록하는지를 고민할 필요가 있다.  
평소에는 Controller, Service, Repository는 빈으로 관리한다는 무의식적인 개발을 했기에 명확한 기준을 설명하라고 말하면 조금 어려웠고 아래와 같이 추상적으로 생각했다.  

- 재사용이 잦은 객체(?)
- 상태가 없는 객체(?)

### 공식문서에서

스프링 공식문서에서는 일반적으로 서비스 계층, DAO, 웹 컨트롤러와 같은 인프라 객체를 정의한다고 말한다.  

또한 일반적인 도메인 세부 객체는 정의하지 않고, 이에 대한 이유로는 도메인 객체를 생성하고 로드하는 것은 대개 리포지토리와 비즈니스 로직의 책임이기 때문이라고 언급한다.  

> [!quote]
> These bean definitions correspond to the actual objects that make up your application. Typically, you define service layer objects, persistence layer objects such as repositories or data access objects (DAOs), presentation objects such as Web controllers, infrastructure objects such as a JPA `EntityManagerFactory`, JMS queues, and so forth. Typically, one does not configure fine-grained domain objects in the container, because it is usually the responsibility of repositories and business logic to create and load domain objects.
> 
> https://docs.spring.io/spring-framework/reference/core/beans/basics.html?utm_source=chatgpt.com#beans-factory-metadata

도메인 객체는 해당 도메인의 값을 담는 것이 주된 역할이다. 그리고 Client간 요청-응답이 끝난다면 소멸된다.  
반면 공식문서에서 언급하는 인프라 객체는 각 도메인에 대한 **로직, 작업수행**을 담당한다.  

정리하자면 다음과 같다.  

#### 빈으로 등록해야 하는 객체

- 공통 로직 및 비즈니스 컴포넌트
- 의존성 주입(DI)이 필요한 객체
- 공유해서 사용하는 설정/유틸리티 객체
- 외부 라이브러리 객체

#### 빈으로 등록하지 말아야 하는 객체

- 상태(State)를 가지며 일회성으로 생성/소멸하는 데이터 객체
- 의존성 주입이 필요 없는 단순 유틸리티 및 생성 즉시 사라지는 객체

## 출처 및 참고자료

```cardlink
url: https://docs.spring.io/spring-framework/reference/core/beans/basics.html?utm_source=chatgpt.com#beans-factory-metadata
title: "Container Overview :: Spring Framework"
host: docs.spring.io
favicon: ../../_/img/favicon.ico
```

```cardlink
url: https://maltyy.tistory.com/33
title: "Spring Bean — 왜 만들어야 하고, 왜 써야 할까?"
description: "1. 들어가며스프링을 쓰다 보면 빈(Bean)이라는 말을 정말 자주 듣는다.“스프링이 빈을 관리해준다”, “빈으로 등록해야 한다”, “빈 주입이 안 된다”…근데 솔직히 처음엔 이런 생각이 든다.“그냥 new로 객체 만들면 되는 거 아닌가?”“굳이 Bean으로 등록해야 하는 이유가 뭐야?”나도 그랬다. (나는 그랬다..비전공자 입장에서 Bean이라는게 싫었다..)그냥 자바 객체니까 new 해서 쓰면 되지,뭘 ‘등록’까지 해야 하나 싶었다.그런데 실제로 스프링을 깊게 쓰다 보면,“Bean으로 관리해야만 하는 이유”가 명확하게 보인다. 2. Bean이란 무엇인가? Bean은 간단히 말해서 “스프링이 대신 관리해주는 객체”다.즉, 우리가 new로 직접 만들지 않고,스프링이 대신 만들고, 대신 주입해주고, 대.."
host: maltyy.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2Fy6Bqn%2FbtsQ48lao1c%2FAAAAAAAAAAAAAAAAAAAAAGI_86fVEqVvlYRD_fYcYxIbGl6NdiiFtv0xNZ7BrpvC%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DXcKAtUF9%252BOP4AnCxI1iI6s7l2Iw%253D
```
