---
date: 2026-09-24
aliases:
  - 리플렉션
tags:
  - Java
---
Reflaction은 런타임에 클래스, 인터페이스의 필드, 메서드, 생성자를 검사하고 수정할 수 있는 기능이다.  ^intro

```java
Class<?> clazz = User.class;

Method method = clazz.getDeclaredMethod("getName");
Object result = method.invoke(user);
```

## Class 객체

[[JVM]]이 `User` 클래스를 로딩하면 해당 클래스의 메타데이터를 표현하는 `Class<User>` 객체가 존재한다.

```java
Class<User> clazz = User.class;
```

해당 객체에서는 다음과 같은 정보를 조회할 수 있다.  

- 클래스명
- Modifier
- 생성자
- 필드
- 메서드
- 인터페이스
- 부모 클래스
- 어노테이션

```java
// 컴파일 타임에 타입을 알 수 있음
Class<User> clazz = User.class;

// 이미 객체가 존재할 때 사용
User user = new User();
Class<?> clazz = user.getClass();

// 문자열을 통해 런타임에 클래스를 찾음, 가장 리플렉션스러운 방식
Class<?> clazz = Class.forName("com.example.User");
```

## 리플렉션 활용 대표 예시

- 동적 클래스 로딩
- 테스트 자동화 및 프레임워크 개발
- 객체 직렬화/역직렬화
- 의존성 주입

리플렉션은 프레임워크나 라이브러리가 사용자 코드를 미리 알 수 없을 때 주로 사용한다.  

- [[Spring DI]], Spring [[Java Annotation|Annotation]] 기반 프로그래밍, [[Spring AOP]]
- Hibernate의 동적 객체-테이블 매핑
- JUnit의 테스트 케이스를 동적으로 로드하고 실행

## 리플렉션의 단점

1. 타입 안정성 저하
2. 코드가 복잡도 증가 및 가독성 저하
3. 성능 저하

## 출처 및 참고자료

```cardlink
url: https://jimoou.github.io/java/2024/10/29/post21.html
title: "Java Reflection이란 무엇인가"
description: "여는글"
host: jimoou.github.io
favicon: https://jimoou.github.io/assets/images/favicon/image.png
```

```cardlink
url: https://www.youtube.com/watch?v=RZB7_6sAtC4
title: "[10분 테코톡] 헙크의 자바 Reflection"
description: "🙋‍♀️ 우아한테크코스의 크루들이 진행하는 10분 테크토크입니다. 🙋‍♂️'10분 테코톡'이란  우아한테크코스 과정을 진행하며 크루(수강생)들이 동료들과 학습한 내용을 공유하고 이야기하는 시간입니다. 서로가 성장하기 위해 지식을 나누고 대화하며 생각해보는 시간으로 자기 주도적인..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/85a3164d/img/favicon_32x32.png
image: https://i.ytimg.com/vi/RZB7_6sAtC4/maxresdefault.jpg
```
