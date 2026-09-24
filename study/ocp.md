---
title: OCP
aliases:
  - OCP
  - 개방 폐쇄 원칙
---
## Open-Closed Principle (개방-폐쇄 원칙)

개방-폐쇄 원칙(OCP)은 **소프트웨어 엔티티(클래스, 모듈 등)는 확장에는 열려 있어야 하고, 수정에는 닫혀 있어야 한다**는 원칙이다. 기존 코드를 변경하지 않고도 기능을 추가할 수 있어야 함을 뜻한다.

## 준수 시 이점

- **유연성**: 새로운 요구사항이 생길 때 기존 코드를 건드리지 않고 새로운 클래스를 추가하는 것만으로 대응 가능하다.
- **안정성**: 기존의 검증된 코드를 수정하지 않으므로, 수정으로 인해 발생할 수 있는 '사이드 이펙트(Side Effect)'를 방지한다.

## 예시 코드

```java
interface Shape {
    double calculateArea();
}

class Rectangle implements Shape {
    double width, height;
    public double calculateArea() { return width * height; }
}

class Circle implements Shape {
    double radius;
    public double calculateArea() { return Math.PI * radius * radius; }
}

// 새로운 도형이 추가되어도 AreaCalculator의 코드는 변하지 않음
class AreaCalculator {
    public double sum(Shape[] shapes) {
        double total = 0;
        for (Shape shape : shapes) total += shape.calculateArea();
        return total;
    }
}
```
