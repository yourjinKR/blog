---
date: 2026-09-24
aliases:
  - 서블릿
tags:
  - Java
  - Web
---
**서블릿(Servlet)이란 동적 웹 페이지를 만들 때 사용되는 자바 기반의 웹 애플리케이션 프로그래밍 기술이다.**  ^intro

> 자바로 구현된 [CGI](https://www.ibm.com/docs/ko/i/7.5.0?topic=functionality-cgi)(Common Gate Interface)이다.

## Servlet의 주요 특징

- 클라이언트의 요청에 동적으로 작동하는 웹 컴포넌트
- HTML을 사용하여 응답
- Java의 스레드를 이용하여 동작 (멀티쓰레딩 지원)
- MVC 패턴에서의 컨트롤러로 이용
-  HTTP 프로토콜을 지원하는 `javax.servlet.http.HttpServlet` 클래스를 상속
- UDP 보다 느린 속도(?)
- HTML 변경 시 Servlet을 다시 컴파일 → 이를 해결하기 위해 JSP, Thymeleaf와 같은 템플릿 엔진 사용

## Servlet의 생명주기

Servlet의 생명주기는 해당 인터페이스의 메서드를 통해 관리된다.  

![[IMG-20261030025438300.png]]

- `init()`:  서블릿이 처음 생성될 때 한 번 호출되며, 초기화 작업을 수행합니다.
- `service()`: 클라이언트의 각 요청마다 호출되는 메서드입니다. Http Method에 맞는 기능을 동작합니다.  
- `destroy()`: 서블릿이 제거될 때 한 번 호출되며, 자원을 해제하거나 종료 작업을 수행합니다.

## Servlet Container

서블릿은 스스로 실행되는 프로그램이 아니라 **Servlet Container에 의해 생성되고 관리되며 실행**된다.  
Servlet Container는 클라이언트의 HTTP 요청을 받아 적절한 Servlet을 찾아 실행하고, Servlet이 생성한 응답을 다시 클라이언트에게 전달하는 역할을 수행한다.  
대표적인 Servlet Container로 **[[Apache Tomcat]], Jetty, Undertow** 등이 있다. 

### Servlet Container의 주요 역할

- HTTP 요청/응답 처리
- Servlet 생명주기 관리
- 요청과 Servlet 매핑
- 멀티스레드 요청 처리

Servlet Container는 Servlet 실행뿐 아니라 다음과 같은 웹 애플리케이션 기능도 제공

- Session 관리
- Cookie 처리 지원
- Filter 관리
- Listener 관리
- 보안 및 인증 관련 기능
- ServletContext 관리


추가 포인트

![[IMG-20261030024057667.png]]

## 출처 및 참고자료

```cardlink
url: https://velog.io/@falling_star3/Tomcat-%EC%84%9C%EB%B8%94%EB%A6%BFServlet%EC%9D%B4%EB%9E%80
title: "[Servlet] 서블릿(Servlet)이란?"
description: "서블릿의 개념과 동작 과정, 생명주기(메서드), 인터페이스, 서블릿 컨테이너에 대해 공부하고 정리한 내용입니다."
host: velog.io
favicon: https://static.velog.io/favicons/favicon-32x32.png
image: https://velog.velcdn.com/images/falling_star3/post/5197eedd-405b-4b0d-8d3d-d274d3409e80/%EC%84%9C%EB%B8%94%EB%A6%BF.JPG
```

```cardlink
url: https://www.youtube.com/watch?v=calGCwG_B4Y&t
title: "[10분 테코톡] 🐶 코기의 Servlet vs Spring"
description: "🙋‍♀️ 우아한테크코스의 크루들이 진행하는 10분 테크토크입니다. 🙋‍♂️'10분 테코톡'이란  우아한테크코스 과정을 진행하며 크루(수강생)들이 동료들과 학습한 내용을 공유하고 이야기하는 시간입니다. 서로가 성장하기 위해 지식을 나누고 대화하며 생각해보는 시간으로 자기 주도적인..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/0b8a310c/img/favicon_32x32.png
image: https://i.ytimg.com/vi/calGCwG_B4Y/maxresdefault.jpg
```

```cardlink
url: https://mangkyu.tistory.com/14
title: "[JSP] 서블릿(Servlet)이란?"
description: "1. Servlet(서블릿) 서블릿을 한 줄로 정의하자면 아래와 같습니다. 클라이언트의 요청을 처리하고, 그 결과를 반환하는 Servlet 클래스의 구현 규칙을 지킨 자바 웹 프로그래밍 기술 간단히 말해서, 서블릿이란 자바를 사용하여 웹을 만들기 위해 필요한 기술입니다. 그런데 좀더 들어가서 설명하면 클라이언트가 어떠한 요청을 하면 그에 대한 결과를 다시 전송해주어야 하는데, 이러한 역할을 하는 자바 프로그램입니다. 예를 들어, 어떠한 사용자가 로그인을 하려고 할 때. 사용자는 아이디와 비밀번호를 입력하고, 로그인 버튼을 누릅니다. 그때 서버는 클라이언트의 아이디와 비밀번호를 확인하고, 다음 페이지를 띄워주어야 하는데, 이러한 역할을 수행하는 것이 바로 서블릿(Servlet)입니다. 그래서 서블릿은 자바.."
host: mangkyu.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F991605335A04132123
```
  