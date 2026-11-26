---
tags:
  - Java
---
- 자바 객체와 같은 메모리상의 데이터를 **저장하거나 네트워크를 통해 전송할 수 있는 형태로 변환하는 기술**이다. 
- [[JVM]]의 메모리에 상주(힙 또는 스택)되어 있는 객체 데이터를 바이트 형태로 변환하는 기술

## Serializable

기본 타입과 `java.io.Serializable` 인터페이스를 상속받은 객체는 직렬화 할 수 있는 기본 조건을 가진다.  

## transient

`transient` 예약어를 통해 특정 필드를 직렬화에 제외시킬 수 있다.  
직렬화/역직렬화 과정에서 노출되면 안되는 값들에 주로 해당 키워드를 붙인다.  

## 출처 및 참고자료

```cardlink
url: https://nesoy.github.io/blog/Java-Serialize
title: "Java의 직렬화(Serialize)란?"
description: "Java의 직렬화(Serialize)란? 들어가며 예전에 네트워크 통신을 할때 Serialize에 대해 공부를 한 경험이 있지만 지식의 부족함을 느끼고 조사하여 결과를 정리합니다."
host: nesoy.github.io
favicon: ../static/icon.png
image: https://nesoy.github.io/static/og-image.png
```

```cardlink
url: https://techblog.woowahan.com/2550/
title: "자바 직렬화, 그것이 알고싶다. 훑어보기편 | 우아한형제들 기술블로그"
description: "자바의 직렬화 기술에 대한 대한 이야기입니다. 간단한 질문과 답변 형태로 자바 직렬화에 대한 간단한 설명과 직접 프로젝트를 진행하면서 겪은 경험에 대해 이야기해보려 합니다. 자바 직렬화가 무엇(what)인가요?? 자바 직렬화란 자바 시스템 내부에서 사용되는 객체 또는 데이터를 외부의 자바 시스템에서도 사용할 수 있도록 바이트(byte) 형태로 데이터 변환하는 기술과 바이트로 변환된 데이터를 다시 객체로 변환하는 기술(역직렬화)을 아울러서 이야기합니다."
host: techblog.woowahan.com
favicon: https://techblog.woowahan.com/wp-content/uploads/2020/08/favicon.ico
image: https://techblog.woowahan.com/wp-content/uploads/2025/07/우아한테크-기술블로그-배너.png
```
