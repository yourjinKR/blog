---
title: ISP
aliases:
  - ISP
  - 인터페이스 분리 원칙
---
## Interface Segregation Principle (인터페이스 분리 원칙)

인터페이스 분리 원칙(ISP)은 **특정 클라이언트를 위한 인터페이스 여러 개가 범용 인터페이스 하나보다 낫다**는 원칙이다. 사용하지 않는 메서드에 의존하도록 강제해서는 안 된다.

## 준수 시 이점

- **가벼운 구현**: 클래스가 자신에게 꼭 필요한 메서드만 구현하면 되므로 코드가 간결해진다.
- **재컴파일 방지**: 관련 없는 메서드의 변경으로 인해 해당 인터페이스를 사용하는 다른 클래스들을 다시 컴파일할 필요가 없어진다.

## 예시 코드

```java
// bad: 모든 기능을 한 인터페이스에 넣음
interface SmartPrinter {
    void print();
    void fax();
    void scan();
}

// good: 기능을 세분화
interface Printer { void print(); }
interface Fax { void fax(); }
interface Scanner { void scan(); }

class BasicPrinter implements Printer {
    public void print() { /* 인쇄만 수행 */ }
}
```