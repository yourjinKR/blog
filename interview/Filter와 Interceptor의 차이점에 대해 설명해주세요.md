---
tags:
  - 면접
  - 스터디
  - Spring
---
Filter, Interceptor, AOP는 공통 관심사를 분리하기 위해 사용하지만 적용 위치가 다릅니다. 

Filter는 서블릿 컨테이너에서 DispatcherServlet 전후로 동작하므로 전체 HTTP 요청의 인코딩, CORS, 보안 처리 등에 적합합니다. 

Interceptor는 Spring MVC에서 컨트롤러 호출 전후로 동작하며 핸들러 정보를 활용할 수 있어 컨트롤러별 인증이나 로깅에 적합합니다.

AOP는 Spring Bean의 메서드 실행 전후에 적용되며 웹 계층에 한정되지 않기 때문에 트랜잭션이나 서비스 실행 시간 측정 같은 횡단 관심사를 처리하는 데 사용합니다.

## 출처 및 참고자료

https://junhyunny.github.io/spring-boot/filter-interceptor-and-aop/