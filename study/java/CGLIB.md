---
date: 2026-09-29
tags:
  - Java
aliases:
  - Code Generator Library
---
코드 생성 라이브러리로서 **런타임에 동적으로 자바 클래스의 프록시를 생성해주는 기능**을 제공한다.  
인터페이스가 아닌 클래스에 대해서 동적 프록시를 생성할 수 있다.

### AspectJ와 CGLib

AOP 프레임워크 중 하나인 AspectJ는 프록시를 사용하지 않는다.  대신 AspectJ는 CGlib를 사용하여 타깃 오브젝트의 바이트를 고쳐서 부가기능을 직접 넣어주는 방법을 사용한다. 바이트 코드에 우리가 직접 작성한 코드와 부가 기능 코드가 뒤섞여 있는 이유가 CGLib 때문이다.  

CGLib를 사용하는 이점은 다음과 같다.  

- 바이트 코드를 조작하면 Spring과 같은 컨테이너의 도움이 필요 없기 때문이다.
- 프록시 방식보다 훨씬 강력하고 유연한 AOP를 제공할 수 있다.

## 출처 및 참고자료

```cardlink
url: https://velog.io/@suhongkim98/JDK-Dynamic-Proxy%EC%99%80-CGLib
title: "JDK Dynamic Proxy와 CGLib를 알아보자 #2"
description: "Dynamic Proxy와 CGLib을 실습해보며 AOP를 이해해보았습니다."
host: velog.io
favicon: https://static.velog.io/favicons/favicon-32x32.png
image: https://velog.velcdn.com/images/suhongkim98/post/f93225b8-4fd2-4f9c-91cc-92e76f25f818/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202022-01-27%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%201.33.38.png
```
