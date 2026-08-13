---
tags:
  - 면접
  - 스터디
  - Spring
---
Spring Bean의 생명주기는 Spring Container에 의해 다음과 같은 흐름으로 관리됩니다.  

- **스프링 컨테이너 생성**
- **스프링 빈 생성** (객체화)
- **의존관계 주입** (DI - Setter나 Field 주입 시점)
- **초기화 콜백** (빈이 완전히 생성된 후 할 일, `@PostConstruct`)
- **사용** (애플리케이션 로직 수행)
- **소멸 전 콜백** (죽기 전에 할 일, `@PreDestroy`)
- **스프링 종료**

생성한 스프링 빈을 등록할 때는 ComponentScan을 이용하거나 @Configuration 의 @Bean 을 사용하여 빈 설정파일에 직접 빈을 등록할 수 있습니다.

- Spring Bean Scope에 대해 자세히 설명해주세요
- 컴포넌트 스캔이란?
- Bean/Component 어노테이션에 대해서 설명해주시고, 둘의 차이점에 대해 설명해주세요.

## 출처

https://hianna.tistory.com/1222