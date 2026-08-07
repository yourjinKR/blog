---
title: String, StringBuilder, StringBuffer의 차이점과, 각각 어떤 상황에서 사용해야 하는지 설명해주세요
tags:
  - 면접
  - 스터디
---
`String`은 자바에서 문자열을 조작하는 대표적인 클래스이며 간단한 문자열을 조작할때 주로 사용됩니다. 불변의 특성을 가지고 있기에 문자열에 연산자를 여러번 사용한다면 기존 값을 복사하면서 새로운 문자열을 만들기에 비효율적입니다.

이를 해결하기 위해 StringBuilder, StrigBuffer가 사용됩니다.  
StringBuilder과 StringBuffer의 차이점은 thread-safe 여부입니다. StringBuilder는 동기화가 지원되지 않지만 StringBuffer는 동기화가 지원되어 멀티 스레드 환경에서 주로 사용됩니다. 다만 성능상으로 차이가 있기에 단일 스레드 환경에서는 StringBuilder를 주로 사용합니다.
