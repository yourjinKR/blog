---
date: 2026-09-24
title: 서블릿 필터
tags:
  - Java
  - Web
---
## jakarta.servlet.Filter

DispatcherServlet에 요청이 전달되기 전,후에 부가작업을 처리한다.  

```java
public interface Filter {
    default void init(FilterConfig filterConfig) throws ServletException {
    }

    void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException;

    default void destroy() {
    }
}
```

- `init()`: 서블릿 컨테이너 실행시 필터를 생성하고 초기화할 때 사용하는 메소드
- `doFilter()`: 요청에 대한 작업 수행 및 다음 필터를 호출하는 메소드
- `destory()`: 서블릿 컨테이너 종료시 초기화하는 메소드

## 출처

```cardlink
url: https://github.com/jakartaee/servlet/blob/main/api/src/main/java/jakarta/servlet/Filter.java
title: "servlet/api/src/main/java/jakarta/servlet/Filter.java at main · jakartaee/servlet"
description: "Jakarta Servlet. Contribute to jakartaee/servlet development by creating an account on GitHub."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/844945b79874ef7d2381f958e77af5db525ae866913af827364fb181095c2d83/jakartaee/servlet
```

```cardlink
url: https://junhyunny.github.io/spring-boot/filter-interceptor-and-aop/
title: "스프링(spring) 프레임워크의 필터(Filter), 인터셉터(Interceptor), AOP(Aspect Oriented Programming)"
description: "<br />"
host: junhyunny.github.io
```

```cardlink
url: https://www.youtube.com/watch?v=v86B35pwk6s
title: "[10분 테코톡] 조시, 쿤의 서블릿 필터 & 스프링 인터셉터"
description: "🙋‍♀️ 우아한테크코스의 크루들이 진행하는 10분 테크토크입니다. 🙋‍♂️'10분 테코톡'이란  우아한테크코스 과정을 진행하며 크루(수강생)들이 동료들과 학습한 내용을 공유하고 이야기하는 시간입니다. 서로가 성장하기 위해 지식을 나누고 대화하며 생각해보는 시간으로 자기 주도적인..."
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/5b8fd169/img/favicon_32x32.png
image: https://i.ytimg.com/vi/v86B35pwk6s/maxresdefault.jpg
```


​