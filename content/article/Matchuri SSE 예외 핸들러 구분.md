---
tags:
  - 맛추리
  - Spring
  - SSE
  - 트러블슈팅
---
## 문제 상황

`IllegalStateException` 및 `AsyncRequestNotUsableException` 예외가 지속적으로 발생했습니다.  

```cardlink
url: https://gist.github.com/yourjinKR/37b877fb7a47b5b6d17f8e97136cf4f5
title: "2026-09-18 Matchuri SSE IllegalStateException"
description: "2026-09-18 Matchuri SSE IllegalStateException. GitHub Gist: instantly share code, notes, and snippets."
host: gist.github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://github.githubassets.com/assets/gist-og-image-54fd7dc0713e.png
```

```cardlink
url: https://gist.github.com/yourjinKR/4f0ac2e86942e42c36adac1b9ad2cf71
title: "2026-09-18 Matchuri AsyncRequestNotUsableException"
description: "2026-09-18 Matchuri AsyncRequestNotUsableException - gist:4f0ac2e86942e42c36adac1b9ad2cf71"
host: gist.github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://github.githubassets.com/assets/gist-og-image-54fd7dc0713e.png
```

`AsyncRequestNotUsableException` 에러는 보통은 클라이언트가 SSE 연결을 끊었는데 서버가 `send()`를 시도하면서 발생한다.   

해당 구조는 당연하다. 서버 입장에서는 클라이언트의 종료 시점을 정확히 파악하기 어렵기에 해당 예외에는 디버그만 남길뿐 조용히 처리할 필요가 있다.  

### 핸들러 추가

이에 맞춰 전역 핸들러에 `AsyncRequestNotUsableException`를 추가했다.  

```java
@ExceptionHandler(AsyncRequestNotUsableException.class)  
public void handleAsyncRequestNotUsableException(AsyncRequestNotUsableException e) {  
    log.debug("SSE client disconnected: {}", e.getMessage());  
}
```

그러나 `Exception.class`에 대응하는 로그가 발생하게 됐다.  

```java
@ExceptionHandler(Exception.class)  
public ResponseEntity<ApiResponse<Void>> handleUnexpectedException(Exception exception, HttpServletRequest request) {  
    log.error("Unexpected exception: path={}", request.getRequestURI(), exception);  
    return errorResponse(CommonErrorCode.INTERNAL_SERVER_ERROR);  
}
```

![[IMG-20260918185336714.png]]

이유는 사실 명확하다…

같은 @ControllerAdvice 안에서는 root exception에 매칭되는 handler를 cause에 매칭되는 handler보다 우선하기에 발생한 것이다. 

```
IllegalStateException <- 최상위(root) 예외
└─ HttpMessageNotWritableException
   └─ JacksonIOException
      └─ AsyncRequestNotUsableException <- 내가 추가한 핸들러
         └─ ClientAbortException
            └─ IOException
```

해당 내용은 아래와 같이 [Spring 공식 문서](https://docs.spring.io/spring-framework/reference/6.2-SNAPSHOT/web/webmvc/mvc-controller/ann-exceptionhandler.html?utm_source=chatgpt.com#mvc-ann-exceptionhandler-exc)에서도 명시되어 있다.  

> [!quote]
> For matching exception types, preferably declare the target exception as a method argument, as the preceding example shows. When multiple exception methods match, a root exception match is generally preferred to a cause exception match. More specifically, the `ExceptionDepthComparator` is used to sort exceptions based on their depth from the thrown exception type.

## 문제 해결: 상위 예외 핸들러 추가

그렇기에 `IllegalStateException`를 타겟을 잡는 메서드를 추가해야 된다.  
그러나 이 경우 모든 `IllegalStateException`를 핸들링하기에 너무 큰 범위라고 판단했다.  

```java
@ExceptionHandler(IllegalStateException.class)
public void handleIllegalStateException(IllegalStateException e) {
    log.debug("SSE client disconnected: {}", e.getMessage());
}
```

다른 경우에서도 발생할 수 있는 예외 상황을 모두 처리하기 때문이다.  
물론 내부적으로 cause를 찾아 에러에 대한 세분화가 가능하겠지만 이는 코드의 복잡성이 커진다고 판단했다.  

또한 기존의 `GlobalExceptionHandler`는 일반적인 REST API의 오류 처리를 담당하는 성격이 강했기에 지금과 같은 비동기 기반의 SSE 연결과는 핸들러를 구분하는 것이 충분히 적절하다고 판단했다.  

```java
package matchuri.backend.global.exception;  
  
import lombok.extern.slf4j.Slf4j;  
import org.springframework.core.Ordered;  
import org.springframework.core.annotation.Order;  
import org.springframework.web.bind.annotation.ExceptionHandler;  
import org.springframework.web.bind.annotation.RestControllerAdvice;  
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;  
  
@Slf4j  
@Order(Ordered.HIGHEST_PRECEDENCE)  
@RestControllerAdvice  
public class SseExceptionHandler {  
    @ExceptionHandler(AsyncRequestNotUsableException.class)  
    public void handleAsyncRequestNotUsableException(AsyncRequestNotUsableException e) {  
        log.debug("SSE connection is no longer usable: {}", e.getMessage());  
    }  
}
```

결과적으로 위와 같은 치상위 핸들러를 추가하여 예외를 처리하기로 했다.  

## 관련 PR

```cardlink
url: https://github.com/matchuri/backend/pull/376
title: "[Fix] SSE 연결 종료 예외 처리 개선 (MC-186) by yourjinKR · Pull Request #376 · matchuri/backend"
description: "관련 노션 백로그 IDMC-186📝 작업 내용AsyncRequestNotUsableException 전용 예외 핸들러를 추가해 종료된 비동기 응답에 공통 500 응답을 다시 쓰지 않도록 했습니다.SSE 전송 실패 후 completeWithError()를 중복 호출하지 않도록 변경했습니다.DisconnectedClientHelper로 정상적인..."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/66d02ae99367819767473a647db99284ec335e8a551f4821d90bdd61de0434e1/matchuri/backend/pull/376
```
