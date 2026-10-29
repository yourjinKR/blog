---
date: 2026-10-29
tags:
  - 면접
  - Spring
---
`@Component`와 `@Bean`은 모두 객체를 [[Spring Bean]]으로 등록하기 위한 방법입니다.  
`@Component`는 클래스에 선언하고 Component Scan을 통해 Spring이 자동으로 객체를 생성해 등록하는 방식이고, `@Bean`은 주로 `@Configuration` 클래스의 메서드에 선언하여 개발자가 객체 생성 과정을 직접 정의하는 방식입니다.  
따라서 일반적으로 직접 작성한 애플리케이션 클래스는 `@Component`, `@Service` 등을 사용하고, 외부 라이브러리 객체나 생성 과정을 직접 제어해야 하는 경우에는 `@Bean`을 사용합니다.  
다만 등록 이후에는 둘 다 동일하게 Spring 컨테이너가 관리하는 Bean입니다.

|구분|`@Component`|`@Bean`|
|---|---|---|
|적용 위치|클래스|메서드|
|등록 방식|Component Scan으로 자동 탐색|설정 클래스의 메서드를 통해 명시적으로 등록|
|객체 생성|Spring이 생성|개발자가 생성 방식을 직접 정의|
|주로 사용|직접 만든 클래스|외부 라이브러리 또는 생성 과정 제어가 필요한 객체|
|대표 예|`@Service`, `@Repository`, `@Controller`|`ObjectMapper`, 외부 SDK Client 등|

## Comfiguration 어노테이션에 대한 추가 설명

`@Component`는 Component Scan을 통해 클래스를 Bean으로 자동 등록하기 위한 어노테이션입니다.  
`@Configuration` 역시 `@Component`로 메타 어노테이션되어 있기 때문에 Component Scan 대상이지만, 추가적으로 해당 클래스를 Bean 정의를 담고 있는 설정 클래스로 취급합니다.  
주로 내부에 `@Bean` 메서드를 선언하며, 기본 설정에서는 CGLIB 프록시를 이용해 `@Bean` 메서드 간 직접 호출을 가로채 Bean scope를 보장합니다.  
반면 `@Bean`은 메서드의 반환 객체를 Spring Bean으로 등록하는 어노테이션이며, `@Configuration`뿐 아니라 일반 `@Component` 내부에서도 사용할 수 있습니다.

- `@Component`: 클래스 자체를 Bean으로 등록
- `@Configuration`: 해당 클래스는 Bean 정의를 담고 있는 설정 클래스
- `@Bean`: 이 메서드가 반환하는 객체를 Bean으로 등록

## 출처 및 참고자료

```cardlink
url: https://curiousjinan.tistory.com/entry/spring-bean-component
title: "[Spring] @Component와 @Bean의 차이점"
description: "Spring에서 @Bean과 @Component의 차이와 최적의 활용 방법을 알아보자 아래의 포스트를 통해 @Bean과 @Component의 기본 지식을 보충하고 오시는것을 추천합니다! Spring 빈 등록: @Bean의 기본과 활용 이번 포스트에는 스프링에서 가장 중요한 빈 등록 방식 @Bean에 대해 소개한다. 📌 서론 Spring Framework에서 @Bean은 매우 중요한 개념이다. 이는 개발자가 직접 제어할 수 없는 외부 라이브러리나 복 curiousjinan.tistory.com Spring의 빈 등록: @Component 이번 포스트에서는 @Component를 사용하여 스프링 빈 등록하는 방법을 알아보자 📌 서론 Spring Framework의 @Component 어노테이션은 클래스 인스턴.."
host: curiousjinan.tistory.com
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdEKGDf%2FbtsAmpZqJlo%2FAAAAAAAAAAAAAAAAAAAAABQ4f9MyQvsX6SSadEs5ZEvvvrBr35hVf2rNKWdHe1AM%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3Ddsv1uOA5bl1jGfSuMlBGUs897Nw%253D
```
