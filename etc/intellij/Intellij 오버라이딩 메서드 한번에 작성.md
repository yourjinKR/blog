---
date: 2026-11-01
tags:
  - Intellij
---
구현체 클래스를 먼저 만들고 인터페이스를 추후에 만들었을 때 오버라이드 메서드를 한꺼번에 만들때 사용한다.  
먼저 비어 있는 인터페이스를 만단 후 기존 클래스에 구현한다.  

```java
class ExampleClass implements EmptyInterface {
	// 수 많은 메서드
}
```

아래 단축키 실행

- **Window**: Ctrl + Alt + Shift + T  → `Pull Members Up`
- **MacOS**: Ctrl + Option + Shift + T → `Pull Members Up`

![[IMG-20261101171650690.png]]

![[IMG-20261101171727112.png]]

![[IMG-20261101171759725.png]]