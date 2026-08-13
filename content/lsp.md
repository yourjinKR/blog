---
title: LSP
aliases:
  - LSP
  - 리스코프 치환 원칙
---
## Liskov Substitution Principle (리스코프 치환 원칙)

리스코프 치환 원칙(LSP)은 **프로그램의 객체는 프로그램의 정확성을 깨뜨리지 않으면서 하위 타입의 인스턴스로 바꿀 수 있어야 한다**는 원칙이다. 즉, 자식 클래스는 부모 클래스의 역할을 완전히 수행할 수 있어야 한다.

## 준수 시 이점

- **다형성 활용**: 부모 클래스 타입으로 작업하는 클라이언트 코드가 자식 클래스의 상세 구현을 몰라도 올바르게 동작함을 보장한다.
- **코드 예측 가능성**: 상속 구조에서 예상치 못한 동작을 방지하여 디버깅 시간을 줄여준다.

## 예시 코드

```java
class Bird {
    void fly() { /* 날기 구현 */ }
}

// 펭귄은 날 수 없으므로 Bird를 상속받으면 LSP 위반!

// 올바른 설계: 날 수 있는 새와 없는 새를 구분하거나 행동을 인터페이스로 분리
interface Flyable { 
	void fly(); 
}

class Sparrow extends Bird implements Flyable {
    public void fly() { /* 참새 비행 */ }
}

class Penguin extends Bird {
    // fly()를 구현하지 않음으로써 오해를 방지
}
```
