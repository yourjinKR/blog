---
aliases:
  - Inversion of Control
  - 제어의 역전
---
제어의 역전(IoC, Inversion of Control)은 프로그램의 제어 흐름 주도권을 개발자가 아니라 외부 프레임워크나 컨테이너가 가지는 소프트웨어 설계 원칙이다.  ^intro

## 출처 및 참고자료

```cardlink
url: https://junhyunny.github.io/spring-boot/design-pattern/spring-ioc-di/
title: "스프링 프레임워크의 제어의 역전(IoC)과 의존성 주입(DI)"
description: "<br />"
host: junhyunny.github.io
```

```cardlink
url: https://develogs.tistory.com/19
title: "제어의 역전(Inversion of Control, IoC) 이란?"
description: "Head First OOAD, Gof Design Pattern 같은 OOP 기본서에서 'Hollywood principle'이나 'Inversion of Control'이란 용어를 많이 들어봤을 것이다. 이런 디자인 관련 책들에서 굉장히 반복적으로 나오는 용어인 것을 보면 꽤 중요한 개념인 것 같은데, 설명은 아래와 같이 매우 간단한 문장으로 마치곤 한다. 'Don't call us, we'll call you' (우리한테 연락하지 마세요. 우리가 당신에게 연락할게요.) 물론 기본서이기 때문에 해당 개념에 대해 자세히 설명하고자 하면 더 복잡하게 될 것 같기도 하다. 나 같은 경우에는 대학생 때 Spring으로 웹서버를 개발하면서 Spring IoC를 통해 IoC에 대한 개념을 자연스럽게 익힐 수 있었.."
host: develogs.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbSHQ5T%2Fbtqz8YGPMTD%2FAAAAAAAAAAAAAAAAAAAAANy7G_WFfcWoe1fezC2SP3RpV9ruFCu_y5SSWXM2Wbia%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DMX4RSjr8O1%252Fhm7i%252BskRth%252Bi5t%252Bw%253D
```
