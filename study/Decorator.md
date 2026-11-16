---
date: 2026-11-17
tags:
  - DesignPattern
aliases:
  - 데코레이터 패턴
---
데코레이터 패턴은 **객체의 기존 코드를 수정하지 않고도 동적으로 새로운 기능이나 책임을 추가**할 수 있게 해주는 구조 패턴이다.  

### 기본 구조

데코레이터 패턴은 다음 요소들로 구성된다.  

- **Component**: 장식될 객체와 장식하는 객체(데코레이터)가 모두 구현해야 할 공통 인터페이스(또는 추상 클래스)입니다.
- **ConcreteComponent**: 장식의 대상이 되는 핵심 기능을 가진 구체적인 클래스입니다. (예: 기본 커피)
- **Decorator**: `Component` 인터페이스를 구현하면서, 내부에 `Component` 객체에 대한 참조를 가집니다. 이 참조를 통해 장식할 객체와 연결됩니다.
- **ConcreteDecorator**: `Decorator`를 상속받아 실제로 새로운 기능이나 책임을 추가하는 클래스입니다. (예: 우유 추가, 시럽 추가)

## 출처 및 참고자료

```cardlink
url: https://jeongcheogi.edugamja.com/theory/sw-design/design-pattern-structure-decorator
title: "데코레이터 decorator 패턴 - 자바스크립트 예제"
description: "데코레이터 decorator 패턴을 자바스크립트 코드와 함께 알아봅니다. 정보처리기사 대비 문제가 포함되어있습니다."
host: jeongcheogi.edugamja.com
favicon: https://jeongcheogi.edugamja.com/favicon.ico?favicon.2ns115htqsj_s.ico
image: https://jeongcheogi.edugamja.com//folder-icons/theory/sw-design/design-pattern-structure-decorator.webp
```
