---
title: DIP
aliases:
  - DIP
  - 의존성 역전 원칙
---
## Dependency Inversion Principle (의존역전 원칙)

의존역전 원칙(DIP)은 **추상화에 의존해야지, 구체화에 의존하면 안 된다**는 원칙이다. 고수준 모듈은 저수준 모듈의 구현에 휘둘리지 않아야 하며, 둘 다 추상화(인터페이스)에 의존해야 한다.

## 준수 시 이점

- **결합도 감소**: 특정 기술(DB 종류, 외부 라이브러리 등)에 종속되지 않는 핵심 비즈니스 로직을 작성할 수 있다.
- **테스트 용이성**: 실제 객체 대신 가짜 객체(Mock)를 주입하기 쉬워져 단위 테스트 효율이 극대화된다.

## 예시 코드

```java
interface Keyboard { void type(); }

class MechanicalKeyboard implements Keyboard {
    public void type() { System.out.println("찰칵찰칵"); }
}

class Computer {
    private final Keyboard keyboard;

    // 구체적인 클래스가 아닌 인터페이스(추상화)에 의존
    public Computer(Keyboard keyboard) {
        this.keyboard = keyboard;
    }
    
    void start() { keyboard.type(); }
}
```