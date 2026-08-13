---
title: equals()와 hashCode()를 함께 재정의해야 하는 이유를 설명해주세요
tags:
  - 면접
  - 스터디
  - Java
---

두 메서드는 논리적 동등성을 보장하기 위해 밀접한 관계가 있습니다.  
자바 규약상 equals()가 true인 객체는 반드시 같은 hashCode()를 반환해야 합니다.  

이 관계가 중요한 이유는 HashMap이나 HashSet 같은 해시 기반 컬렉션의 오동작을 막기 위해서 입니다. 만약 equals만 재정의하고 hashCode를 재정의 하지 않으면, 같은 객체임에도 해시 코드가 달라 다른 버킷에 저장되거나 데이터를 찾을 수 없는 문제가 발생합니다.

> equals가 true면 hashCode도 같아야 한다.  
> 이를 지키지 않으면 HashMap 등에서 데이터를 잃어버릴 수 있다.
