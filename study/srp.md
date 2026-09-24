---
title: SRP
aliases:
  - SRP
  - 단일 책임 원칙
---
## Single Responsibility Principle (단일 책임 원칙)

단일 책임 원칙(SRP)이란 **하나의 클래스가 하나의 책임만을 가져야 한다**는 것을 의미한다.  
클래스가 변경되어야 하는 이유는 단 하나여야 하며, 이를 통해 코드의 **응집도를 높일** 수 있다.

## 준수 시 이점

- **테스트**: 책임이 하나인 클래스는 테스트 시나리오가 단순해져 테스트 케이스 작성이 훨씬 쉬워진다.
- **낮은 결합도**: 단일 클래스에 포함된 기능이 적어질수록 다른 클래스와의 불필요한 의존성이 줄어든다.
- **가독성과 구성**: 규모가 작고 명확한 이름을 가진 클래스는 거대한 클래스(God Object)보다 검색과 이해가 훨씬 빠르다.

## 예시 코드

```java
// bad: 사용자 정보 관리와 로그 출력을 모두 담당
class UserSettings {
    void changeUsername(String name) { /* 유저네임 변경 로직 */ }
    void logError(String error) { System.out.println(error); } // 다른 책임!
}

// good: 책임을 분리
class UserSettings {
    void changeUsername(String name) { /* 유저네임 변경 로직 */ }
}

class Logger {
    void logError(String error) { System.out.println(error); }
}
```

