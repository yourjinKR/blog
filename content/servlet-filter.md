---
title: 서블릿 필터
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

https://www.youtube.com/watch?v=v86B35pwk6s

​