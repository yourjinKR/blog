---
date: 2026-10-29
tags:
  - 면접
  - Spring
ai: true
---
Spring은 기본적으로 타입을 기준으로 Bean을 주입합니다. [[Spring DI#같은 타입의 빈이 여러개 일때|같은 타입의 빈이 여러개 일때]] 주입 대상을 하나로 결정할 수 없어 `NoUniqueBeanDefinitionException`이 발생할 수 있습니다. 이를 해결하기 위해 기본 Bean을 지정하는 `@Primary`나 특정 Bean을 명시하는 `@Qualifier`를 사용할 수 있습니다. 또한 필요하다면 같은 타입의 Bean들을 `List`나 `Map` 형태로 모두 주입받을 수도 있습니다.