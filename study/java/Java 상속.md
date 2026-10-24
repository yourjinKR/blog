---
date: 2026-10-24
tags:
  - Java
aliases:
  - 자바 상속
---
**상속**(Inheritance)은 기존 클래스(부모)의 필드와 메서드를 새로운 클래스(자식)가 물려받는 것이다.  
자식 클래스가 부모 클래스를 상속할때는 `extends` 키워드를 사용한다.  

```java
// 부모 클래스
class Rectangle {
    int width, height;

    int getArea() {
        return width * height;
    }
}

// 자식 클래스 (Rectangle을 상속)
class Square extends Rectangle {
    // width, height, getArea()를 모두 사용할 수 있음
}
```

## super 키워드

`super` 키워드를 통해 부모 클래스를 가리킬 수 있다.  

- `super()`
- `super.field`
- `super.method()`

### super를 명시해야 하는 케이스

부모 클래스에 기본 생성자가 없는 경우, 자식 클래스에서 반드시 `super`를 명시적으로 호출해야 한다.  

> [!CAUTION] 
> 자식 클래스 생성자에서 `super(...)` 또는 `this(...)`를 명시하지 않으면 컴파일러가 첫 줄에 `super()`를 자동으로 삽입한다. 즉 부모 클래스에 기본생성자가 없는데 자식 클래스 생성자에서 별다른 부모 생성자를 호출하지 않을 경우 컴파일 에러가 발생한다. 또한 자식 클래스는 부모 클래스 생성자를 명시적으로 하지 않았을 경우에는 항상 `super()`가 먼저 호출됨을 기억하자.  

## 필드 하이딩

부모 클래스와 자식 클래스에 같은 이름의 필드가 있으면, 자식의 필드가 부모의 필드를 가린다.  

```java
class Parent {
	String x = "Parent";
}

class Child extends Parent {
	String x = "Child" // 부모의 x를 가림
}
```

필드와 같은 경우는 선언 타입을 기준으로 가져오기에 선언 타입에 따라 결과가 다르다.  

```java
System.out.println(p.name); // Parent  
System.out.println(child.name); // Child
```

## 출처 및 참고자료

```cardlink
url: https://jeongcheogi.edugamja.com/coding/java/inheritance
title: "Java 상속(extends), super, this()와 필드 하이딩"
description: "Java 상속(extends)의 개념과 super/this() 키워드, 생성자 체이닝, 필드 하이딩을 알아봅니다. 정보처리기사 실기에 출제된 상속 문제를 풀기 위한 핵심 개념을 정리합니다."
host: jeongcheogi.edugamja.com
favicon: https://jeongcheogi.edugamja.com/favicon.ico?favicon.2ns115htqsj_s.ico
image: https://jeongcheogi.edugamja.com//folder-icons/coding/java/inheritance.webp
```
