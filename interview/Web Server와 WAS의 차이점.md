---
date: 2026-10-01
tags:
  - 면접
ai: true
---
Web Server는 **클라이언트의 HTTP 요청을 받아 정적 콘텐츠를 제공하거나, 동적 처리가 필요한 요청을 WAS 등의 애플리케이션 서버로 전달하는 서버**이다.

Web Application Server(WAS)는 **애플리케이션의 비즈니스 로직을 실행하여 동적인 콘텐츠를 생성하고 HTTP 응답을 제공하는 서버**이다.

## Web Server는 동적 콘텐츠를 제공하지 못하는가?

엄밀히 말하면 **Web Server도 동적 콘텐츠를 제공할 수 있다.**

과거부터 Web Server는 CGI(Common Gateway Interface), 서버 모듈, 스크립트 실행 등의 방법을 이용하여 프로그램을 실행하고 그 결과를 HTTP 응답으로 반환할 수 있었다.

예를 들어 Apache HTTP Server는 CGI나 PHP 모듈 등을 이용하여 동적인 HTML을 생성할 수 있다.

따라서 아래와 같이 기능적으로 완전히 구분하는 것은 정확하지 않다.

> Web Server = 정적 콘텐츠만 처리  
> WAS = 동적 콘텐츠만 처리

둘의 차이는지원 기능 여부에 대한 구분보다는 어떤 목적으로 설계했는가로 접근해보자.  
일반적인 웹 애플리케이션 구조에서는 다음과 같이 역할을 분리한다.

```
Client
   ↓
Web Server / Reverse Proxy
   ├── 정적 파일 → 직접 응답
   │
   └── 동적 요청
          ↓
         WAS
          ↓
   Application Logic
          ↓
         DB
```

Web Server는 HTML, CSS, JavaScript, 이미지와 같은 정적 파일을 효율적으로 제공하고, 동적인 처리가 필요한 요청은 WAS로 전달한다.

반면 WAS는 Java/Spring과 같은 애플리케이션을 실행하면서 Controller, Service 등의 비즈니스 로직을 수행하고 그 결과를 응답한다.

또한 WAS 역시 정적 콘텐츠를 제공할 수 있다. 예를 들어 Spring Boot의 내장 Tomcat도 `static` 디렉터리에 있는 정적 리소스를 직접 응답할 수 있다.

따라서 실제 시스템에서 Web Server와 WAS를 분리하는 이유는 **기능적으로 불가능해서가 아니라 역할 분리, 성능, 확장성, 보안 및 운영상의 장점을 얻기 위해서이다.**

## Web Server와 WAS를 둘 다 사용하는 이유

### 역할을 분리하여 효율적으로 요청을 처리할 수 있다.  

HTML, CSS, JavaScript, 이미지와 같은 정적 콘텐츠는 Web Server가 처리하고, 비즈니스 로직이 필요한 요청만 WAS로 전달할 수 있다. 이를 통해 WAS가 애플리케이션 처리에 집중하도록 할 수 있다.
    
### Reverse Proxy 역할을 수행할 수 있다.  

클라이언트가 WAS에 직접 접근하지 않고 Web Server를 통해 접근하도록 구성할 수 있다.
    
```
Client → Nginx → Spring Boot
```
    
이 경우 외부에서는 내부 WAS의 주소나 포트를 직접 알 필요가 없다.
    
### TLS(HTTPS) 처리를 앞단에서 담당할 수 있다.  

Web Server나 Reverse Proxy에서 TLS 인증서를 관리하고 HTTPS 연결의 암호화·복호화를 수행한 뒤 내부 WAS로 요청을 전달할 수 있다. 이를 TLS Termination이라고 한다.
    
단, **TLS 처리를 반드시 Web Server에서 해야 하는 것은 아니다.** WAS나 Load Balancer가 직접 TLS를 처리하는 구성도 가능하다.

### 여러 WAS로 요청을 분산할 수 있다.

Web Server 또는 별도의 Load Balancer를 이용하여 여러 WAS에 요청을 분산할 수 있다.
    
```
				┌─ WAS 1
Client → Nginx ─┼─ WAS 2
				└─ WAS 3
```

이를 통해 특정 서버에 요청이 집중되는 것을 방지하고 애플리케이션을 수평 확장할 수 있다.
    
### 장애 대응과 운영 유연성을 높일 수 있다.  
    
여러 WAS를 운영한다면 하나의 WAS에 장애가 발생했을 때 정상적인 다른 WAS로 요청을 전달할 수 있다. 또한 서버를 한 대씩 교체하거나 배포하는 방식으로 서비스 중단을 최소화할 수 있다.
    
## 핵심

Web Server와 WAS의 차이는 단순히

```
Web Server = 정적
WAS = 동적
```

으로 구분하기보다는 다음과 같이 이해하는 것이 좋다.

```
Web Server
→ HTTP 요청의 앞단에서 정적 리소스 제공, Reverse Proxy,
   TLS Termination, 요청 전달 등의 역할에 특화

WAS
→ 애플리케이션을 실행하고 비즈니스 로직을 처리하여
   동적인 응답을 생성하는 역할에 특화
```

즉, **Web Server와 WAS 모두 어느 정도 서로의 기능을 수행할 수 있지만, 관심사를 분리하여 시스템의 성능·확장성·보안·운영성을 높이기 위해 역할을 나누어 사용하는 경우가 많다.**