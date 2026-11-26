---
date: 2026-11-09
tags:
  - Spring
aliases:
  - "@Configuration"
---


### proxyBeanMethods

`proxyBeanMethods = false`는 스프링의 `@Configuration` 클래스를 **CGLIB 프록시로 감싸지 않고 일반 POJO 클래스처럼 직접 호출하도록 동작 방식을 변경하는 옵션**이다.  

```java
@Configuration(proxyBeanMethods = false)
public class AppConfig {

    @Bean
    public MemberRepository memberRepository() {
        return new MemoryMemberRepository();
    }

    @Bean
    public MemberService memberService() {
        return new MemberServiceImpl(memberRepository()); // 새 객체 생성!
    }

    @Bean
    public OrderService orderService() {
        return new OrderServiceImpl(memberRepository()); // 또 다른 새 객체 생성!
    }
}
```

| **구분**       | **proxyBeanMethods = true (Full)** | **proxyBeanMethods = false (Lite)**    |
| ------------ | ---------------------------------- | -------------------------------------- |
| **프록시 생성**   | CGLIB 프록시 바이트코드 조작 적용              | 순수 Java 객체 (프록시 없음)                    |
| **싱글톤 보장**   | `@Bean` 내부 직접 호출 시에도 싱글톤 보장        | 내부 메서드 직접 호출 시 새 인스턴스 생성               |
| **성능 / 리소스** | 프록시 생성 비용 발생, 메모리 및 시작 시간 소폭 증가    | CGLIB 처리 생략으로 시작 시간 및 메모리 절약           |
| **주 사용처**    | 빈 간의 의존 관계를 메서드 직접 호출로 해결할 때       | 스프링 부트 내부 자동 구성(`AutoConfiguration`) 등 |