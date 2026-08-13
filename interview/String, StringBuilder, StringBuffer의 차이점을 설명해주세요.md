---
title: String, StringBuilder, StringBuffer의 차이점을 설명해주세요
tags:
  - 면접
  - 스터디
  - Java
---
`String`은 자바에서 문자열을 조작하는 대표적인 클래스이며 간단한 문자열을 조작할때 주로 사용됩니다. 불변의 특성을 가지고 있기에 문자열에 연산자를 여러번 사용한다면 기존 값을 복사하면서 새로운 문자열을 만들기에 비효율적입니다.

이를 해결하기 위해 StringBuilder, StrigBuffer가 사용됩니다.  
StringBuilder과 StringBuffer의 차이점은 thread-safe 여부입니다. StringBuilder는 동기화가 지원되지 않지만 StringBuffer는 동기화가 지원되어 멀티 스레드 환경에서 주로 사용됩니다. 다만 성능상으로 차이가 있기에 단일 스레드 환경에서는 StringBuilder를 주로 사용합니다.

> [!QUESTION]- String 타입을 가진 변수의 값을 수정하면 어떤 일이 생기나요
> String 타입은 불변이기에 값을 수정하다기 보다는 새로운 String 객체를 생성 후 해당 객체를 가리키는 메모리 주소를 저장합니다. 

