---
title: WebAsyncManagerIntegrationFilter
tags:
  - Spring-Security
---
# WebAsyncManagerIntegrationFilter

이 필터는 DefaultSecurityFilterChain에 기본적으로 등록되는 필터로 두 번째에 위치한다.

필터가 등록되는 목적은 서블릿단에서 비동기 작업을 수행할 때 서블릿 입출력 쓰레드와 작업 쓰레드가 동일한 [[SecurityContextHolder|SecurityContextHolder]]의 [[SecurityContextHolder#SecurityContext|SecurityContext]] 영역을 참조할 수 있도록 도와준다.

즉, SecurityContextHolder의 [[ThreadLocal]] 전략에 따라 동일한 쓰레드에서만 SecurityContext에 접근할 수 있는데, 비동기 방식의 경우 하나의 작업을 2개의 쓰레드로 수행하기 때문에 이 부분을 보완하기 위해 필터가 존재한다.

커스텀 SecurityFilterChain을 생성해도 등록된다.

## 출처 및 참고자료

https://www.youtube.com/watch?v=vGdQ-RJsVSY&list=PLJkjrxxiBSFCFM0pjDwm6F98veieD0MER&index=10  
