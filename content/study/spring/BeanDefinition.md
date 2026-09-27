---
tags:
  - Spring
aliases:
  - 빈 정의
---
BeanDefinition은 스프링 컨테이너가 [[Spring Bean|스프링 빈]]을 생성하고 관리하기 위해 사용하는 설정 메타정보 추상화 모델이다.  

Spring은 BeanDefinition이라는 추상화를 통해 다양한 설정 형식을 지원할 수 있는 것이다.  

![[IMG-20260928201533224.png]]

주요 속성은 다음과 같다.  

![[IMG-20260928204148694.png|447]]

- **BeanClassName**: 생성할 빈의 클래스명
    - 예) hello.core.service.MemberServiceImpl
    - 팩토리 메서드 방식에서는 생략될 수 있다.
- **factoryBeanName**: 팩토리 역할을 하는 빈의 이름
    - 예) appConfig
- **factoryMethodName**: 빈을 생성할 팩토리 메서드명
    - 예) memberService
- **Scope**: 빈의 범위(기본값: 싱글톤)
    - 예) singleton, prototype
- **lazyInit**: 빈을 지연 초기화할지 여부
    - true로 설정 시 스프링 컨테이너가 빈을 바로 생성하지 않고, 실제 사용할 때까지 생성을 지연한다.
- **InitMethodName**: 빈의 초기화 메서드
    - 빈 생성 후 의존관계 주입이 완료된 뒤 호출된다.
- **DestroyMethodName**: 빈의 소멸 메서드
    - 빈의 생명주기가 끝나기 직전에 호출된다.
- **Constructor Arguments, Properties**: 의존관계 주입 시 사용된다.

## 출처 및 참고자료

```cardlink
url: https://drcode-devblog.tistory.com/334
title: "[Spring] 스프링 빈 설정 메타 정보 - BeanDefinition"
description: "스프링은 어떻게 이런 다양한 설정 형식을 지원하는 것일까? 그 중심에는 'BeanDefinition'이라는 추상화가 있다. 쉽게 이야기해서 '역할과 구현을 개념적으로 나눈 것'이다 XML을 읽어서 BeanDefinition을 만들면 된다. 자바 코드를 읽어서 BeanDefinition을 만들면 된다. 스프링 컨테이너는 자바 코드인지, XML인지 몰라도 된다. 오직 BeanDefinition만 알면 된다. 'BeanDefinition'을 빈 설정 메타정보라 한다. '@Bean', ''당 각각 하나씩 메타 정보가 생성된다. 스프링 컨테이너는 이 메타정보를 기반으로 스프링 빈을 생성한다. \"코드 레벨로 조금 더 깊이 있게 들어가보자.\" 'AnnotationConfigApplicationContext'는 'An.."
host: drcode-devblog.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FTvZGb%2FbtrtehTRcoP%2FAAAAAAAAAAAAAAAAAAAAACyJ1i2xeHy2PY22OSN1bjh_PB-SDjupH9ySRhSidzmT%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DZPI0%252BcrrFHtAxWQuVPnkRVztHvE%253D
```

```cardlink
url: https://mininkorea.tistory.com/71
title: "스프링 BeanDefinition 완벽 정리: 빈 설정 메타정보 탐구"
description: "스프링 BeanDefinition 완벽 정리: 빈 설정 메타정보 탐구1. BeanDefinition이란?BeanDefinition은 스프링 컨테이너가 빈(bean)의 메타정보를 담아두는 추상화 모델이다. 스프링은 다양한 형태의 빈 설정 정보(Java Config, XML, 어노테이션)를 모두 BeanDefinition이라는 하나의 모델로 추상화하여 사용한다.즉, 개발자가 Java 코드로 설정하든, XML로 설정하든 스프링 내부에서는 결국 BeanDefinition 객체로 변환되어 관리된다.  2. BeanDefinition 주요 정보BeanDefinition이 담고 있는 주요 속성은 다음과 같다:BeanClassName: 생성할 빈의 클래스명예) hello.core.service.MemberService.."
host: mininkorea.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbpSmZc%2FbtsLkKYAhOg%2FAAAAAAAAAAAAAAAAAAAAAIq8lr1-mhBBLEPhURDW-1WT4MloaRZUsszj9fAFy9e2%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DGlujXJOfKiPj1BRQ3EbTT%252BrjxgE%253D
```
