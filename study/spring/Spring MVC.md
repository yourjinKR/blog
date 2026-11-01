---
date: 2026-10-30
tags:
  - Spring
---
Spring Web [[MVC]]는 [[Servlet|서블릿]] API를 기반으로 구축된 웹 프레임워크이다.  

> [!quote]
> Spring Web MVC is the original web framework built on the Servlet API and has been included in the Spring Framework from the very beginning. The formal name, "Spring Web MVC," comes from the name of its source module (spring-webmvc), but it is more commonly known as "Spring MVC".  
> 
> https://docs.spring.io/spring-framework/reference/web/webmvc.html

%%%%
## 동작 과정

1. **`DispatcherServlet`이 Client의 HTTP 요청을 받는다.**
2. **`HandlerMapping`을 통해 요청을 처리할 Controller(Handler)를 찾는다.**
3. **`HandlerAdapter`를 통해 해당 Controller를 호출한다.**
4. **Controller는 요청을 처리하고 필요한 비즈니스 로직을 수행한 뒤 Model과 View 정보를 반환한다.**
5. **`DispatcherServlet`은 `ViewResolver`를 통해 View 이름에 해당하는 실제 View를 찾는다.**
6. **View는 Model 데이터를 이용하여 응답을 렌더링한다.**
7. **`DispatcherServlet`이 렌더링된 결과를 HTTP Response로 Client에게 반환한다.**

> [!TIP]
> [[RestController]]라면 **5~6번이 `HttpMessageConverter`를 이용한 JSON/XML 직렬화 과정으로 대체**

> [!QUESTION] 왜 DispatcherServlet이 Controller를 직접 호출하지 않는가?
> HandlerAdapter가 존재하는 이유는 Spring이 여러 형태의 Handler/Controller를 동일한 DispatcherServlet 구조에서 처리할 수 있도록 하기 위해서다. HandlerAdapter가 존재하는 이유는 Spring이 여러 형태의Handler/Controller를 동일한 DispatcherServlet 구조에서 처리할 수 있도록 하기 위해서다.

![[IMG-20261030013644590.png]]

## DispatcherServlet

> Dispatch(보내다/파견하다) + Servlet = Servlet을 보내는 객체

DispatcherServlet은 Spring MVC에서 프런트 컨트롤러 역할을 하는 핵심 구성 요소이다.  

> [!INFO]
> 기본적으로 Java의 Servlet은 하나의 Request에 대해서 하나의 Servlet을 생성한다.  
> 이 방법은 간단하고 직관적이지만 Servlet이 많이 생성되면 관리하기 힘들어지는 단점이 있다.  
> Spring에서는 DispatcherServlet이라는 FrontController 패턴을 사용해서 중앙에서 하나로 관리한다.  
> Servlet이 요청을 받아서 HandlerMapping을 통해 그에 맞는 컨트롤러로 분배하는 방식을 사용한다.  
> 하나의 객체에서 모든 요청을 먼저 처리하기 때문에 다음과 같은 이점을 누릴 수 있다.  
> 
> - 재사용성 및 유연한 매핑
> - 인터셉터의 사용
> - 관리의 용이성

Spring MVC에서는 `DispatcherServlet`이 전체 요청 처리 흐름을 통제한다.

- 들어오는 요청을 처리하고 적절한 컨트롤러로 전달
- 컨트롤러에게 요청을 처리하고 응답을 반환하는 방법을 알려줌
- 컨트롤러는 요청을 처리한 후 결과를 표시할 올바른 뷰를 선택

## 출처 및 참고자료

```cardlink
url: https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/mvc.html
title: "17. Web MVC framework"
host: docs.spring.io
```

```cardlink
url: https://www.geeksforgeeks.org/java/what-is-dispatcher-servlet-in-spring/
title: "What is Dispatcher Servlet in Spring? - GeeksforGeeks"
description: "Your All-in-One Learning Portal: GeeksforGeeks is a comprehensive educational platform that empowers learners across domains-spanning computer science and programming, school education, upskilling, commerce, software tools, competitive exams, and more."
host: www.geeksforgeeks.org
favicon: https://media.geeksforgeeks.org/wp-content/uploads/gfg_200X200-100x100.png
image: https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png
```

```cardlink
url: https://www.youtube.com/watch?v=hDKoMxhiKSM&t
title: "[10분 테코톡] 안나의 스프링 MVC와 DispatcherServlet"
description: "🙋‍♀️ 우아한테크코스의 크루들이 진행하는 10분 테크토크입니다. 🙋‍♂️'10분 테코톡'이란 우아한테크코스 과정을 진행하며 크루(수강생)들이 동료들과 학습한 내용을 공유하고 이야기하는 시간입니다. 서로가 성장하기 위해 지식을 나누고 대화하며 생각해보는 시간으로 자기 주도적인 ..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/0b8a310c/img/favicon_32x32.png
image: https://i.ytimg.com/vi/hDKoMxhiKSM/maxresdefault.jpg
```

```cardlink
url: https://ittrue.tistory.com/234
title: "[Spring MVC] 스프링 MVC란 무엇인가? - 스프링 MVC 구조 이해"
description: "본 내용은 온라인 강의 사이트 인프런의 김영한 님의 강의 내용이 포함되어 있습니다. '스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술' 스프링 MVC 1편 - 백엔드 웹 개발 핵심 기술 - 인프런 | 강의 웹 애플리케이션을 개발할 때 필요한 모든 웹 기술을 기초부터 이해하고, 완성할 수 있습니다. 스프링 MVC의 핵심 원리와 구조를 이해하고, 더 깊이있는 백엔드 개발자로 성장할 수 있습니다., - www.inflearn.com Intro 스프링 프레임워크의 모듈 중에는 웹 계층을 담당하는 몇 가지 모듈이 있다. 웹 계층에 서블릿(Servlet) API를 기반으로 클라이언트의 요청을 처리하는 모듈이 있는데 이를 스프링 웹 MVC(spring-web-mvc) 또는 스프링 MVC라고 한다. Spring MV.."
host: ittrue.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbAdB0R%2FbtrQPjHTCQR%2FAAAAAAAAAAAAAAAAAAAAAJ-Iv3p2v0AD2sU9XK7mpakF0tBHPWoMqsBHFzOnh2ye%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DB7lqucnkOoPmoV2vHB3PMnGvMIw%253D
```


