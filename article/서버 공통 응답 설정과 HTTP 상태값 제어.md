---
date: 2026-11-21
tags:
  - Spring
  - HTTP
  - 노크인
---
해당 과정을 실험한 Repository입니다.  

```cardlink
url: https://github.com/yourjinKR/spring-mvc-http-status-test
title: "GitHub - yourjinKR/spring-mvc-http-status-test: 공통 응답 DTO의 필드값으로 HTTP Status Code 제어하기"
description: "공통 응답 DTO의 필드값으로 HTTP Status Code 제어하기. Contribute to yourjinKR/spring-mvc-http-status-test development by creating an account on GitHub."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/238d1743cf443e199806e1f8d99f13e811bc191e6e700ee8b281414dc35f71e3/yourjinKR/spring-mvc-http-status-test
```

## 들어가며

서버 측에서 응답 포맷을 통일하여 일관된 응답값을 클라이언트에게 제공하기로 했다.  

```java
@Getter  
@AllArgsConstructor(access = AccessLevel.PRIVATE)  
public class CommonResponse<T> {  
    private final int code;  
    private final T data;  
    private final ErrorResponse error;
}
```

> _이전에는 `ApiResponse`라는 이름을 애용했으나 Swagger의 클래스명과 겹쳐 `CommonResponse`를 사용했다._  

해당 방식에는 다음과 같은 문제점이 있었다.  
`code` 필드가 HTTP 상태값을 나타내는 필드였다.  

```java
@Getter  
@AllArgsConstructor(access = AccessLevel.PRIVATE)  
public class CommonResponse<T> {  
    private final int code;  // <- HTTP Status
    private final T data;  
    private final ErrorResponse error;
}
```

평소에는 주로 [[ResponseEntity]]를 사용하여 HTTP Status Code를 쉽게 제어할 수 있었다. 그러나 공통 응답 DTO를 사용하게 되면서 실제 네트워크가 표현하는 상태와 응답값이 표현하느 상태가 불일치하기 시작했다. 

그렇게 된다면 2중, 3중으로 클래스들을 Wrapping하는 불편함이 있다.  

```java
@GetMapping("/basic")  
public ResponseEntity<CommonResponse<ExampleDto>> basic() {  
    ExampleDto exampleDto = exampleService.example();  
    return ResponseEntity.ok(new CommonResponse<>(200, exampleDto, null));  
}
```

결국 기존에 정했던 응답 포맷을 단순화 하자는 컨벤션 방향성과 어긋난다고 생각했다.  
이를 해결하기 위해 Spring에서 HTTP Status가 정해지는 과정을 ResponseEntity의 흐름을 중점으로 알아봤다.  

## ResponseEntity가 동작하는 과정

ResponseEntity를 통해 HTTP 상태값을 편리하게 제어할 수 있다.  
내부에는 어떤 식으로 동작할까?
HTTP 상태값이 어떻게 저장되는지를 중점으로 먼저 바라보자.  

```java
@GetMapping  
public ResponseEntity<?> findMember() {  
    return ResponseEntity.status(200).body(memberService.findMembers());  
}
```

[[Spring MVC]]에서는 `HandlerAdapter`를 통해 컨트롤러 메서드가 실행된다.  
이때 어노테이션 기반의 컨트롤러일 경우에는 `RequestMappingHandlerAdapter`가 사용된다.  

이 때 [[RestController|REST API]]일 경우에는 `ReturnValueHandler`를 거쳐 `HttpMessageConverter`가 직렬화 후 HTTP Body로 반한된다.  

Spring에서는 지원하는 `ReturnValueHandler` 구현체 목록들을 관리하고 적합한 핸들러를 찾기 위해 [[Composite|컴포지트 패턴]]을 적용한 `HandlerMethodReturnValueHandlerComposite`가 사용된다.    

`HandlerMethodReturnValueHandlerComposite`에서 `handleReturnValue` 메서드에 의해 `ResponseEntityReturnValueHandler`가 선택되며 그 이후 `handleReturnValue`가 호출된다.  

![[IMG-20261120203619440.png]]

`ResponseEntityReturnValueHandler` 내부에서는 `HttpEntityMethodProcessor`의 `handleReturnValue` 호출한다.  

![[IMG-20261120203841541.png]]

`HttpEntityMethodProcessor`에서 `httpEntity`가 `ResponseEntity` 타입일 때 `responseEntity.getStatusCode()`를 호출하여 `returnStatus` 변수값으로 저장한다.  

![[IMG-20261120202440432.png]]

그리고 해당 변수값은 `HttpServletResponseWrapper`에서 `setStatus` 메서드를 통해 설정한다.  

![[IMG-20261120202646629.png]]

ResponseFacade로 의해 Response의 status가 설정되는데 이 부분은 Tomcat의 구현부이다.  

![[IMG-20261120204535261.png]]


## 방법 1 – RequestResponseBodyMethodProcessor 확장

`ResponseBody`가 적용된 컨트롤러의 경우는 `RequestResponseBodyMethodProcessor`가 선택된다.  

![[IMG-20261121185248165.png]]

![[IMG-20261120215423783.png]]

그렇기에 `RequestResponseBodyMethodProcessor`를 먼저 확장하는 방식을 우선적으로 시도했다.  

```java
@Override
public boolean supportsReturnType(MethodParameter returnType) {
	return super.supportsReturnType(returnType)
			&& CommonResponse.class.isAssignableFrom(
			returnType.getParameterType()
	);
}

@Override
public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
		ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws IOException,
		HttpMediaTypeNotAcceptableException, HttpMessageNotWritableException {

	if (returnValue instanceof CommonResponse<?> response) {
		createOutputMessage(webRequest).setStatusCode(HttpStatusCode.valueOf(response.status()));
	}

	super.handleReturnValue(returnValue, returnType, mavContainer, webRequest);
}
```

기존 Processor에는 [[ProblemDetail]]에 대한 제어가 있는데 이는 에러 핸들링 영역이며 `resolveErrorView`와 같은 경우도 json 형식이 아닌 html 방식의 view를 resolve 하기에 해당 구현에 대한 부분은 고려하지 않아도 된다.  

![[IMG-20261121223228069.png]]

### WebConfig

커스텀한 핸들러 또한 Composite에 등록할 필요가 있다.  
Composite는 `RequestMappingHandlerAdapter`에 의해 관리되기에 의존성 주입하여 커스텀 핸들러를 추가한다.   

```java
import java.util.ArrayList;  
import java.util.List;  
import lombok.RequiredArgsConstructor;  
import org.springframework.beans.factory.InitializingBean;  
import org.springframework.context.annotation.Configuration;  
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;  
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;  
  
@Configuration  
@RequiredArgsConstructor  
public class WebConfig implements InitializingBean {  
  
    private final RequestMappingHandlerAdapter adapter;  
  
    @Override  
    public void afterPropertiesSet() throws Exception {  
        List<HandlerMethodReturnValueHandler> defaultHandlers = adapter.getReturnValueHandlers();  
  
        assert defaultHandlers != null;  
        ArrayList<HandlerMethodReturnValueHandler> handlers = new ArrayList<>();  
  
        CustomRequestResponseBodyMethodProcessor customProcessor = new CustomRequestResponseBodyMethodProcessor(adapter.getMessageConverters());  
        handlers.add(customProcessor);  // 커스텀 processor를 먼저 배열에 추가
        handlers.addAll(defaultHandlers);  
  
		// 커스텀 + 기존 핸들러들을 모두 등록
        adapter.setReturnValueHandlers(handlers);  
    }  
}
```

> [!CAUTION] 핸들러 등록 순서
> 이때 커스텀한 핸들러를 먼저 등록하자.  
> 그렇지 않을 경우 기존 `RequestResponseBodyMethodProcessor`가 우선적으로 처리된다.  

%%%%
## 방법 2 – ResponseBodyAdvice  구현

`RequestMappingHandlerAdapter`에서 기본 핸들러를 생성하는 과정에서 `RequestResponseBodyMethodProcessor`를 다음과 같이 생성한다.  

```java
handlers.add(
	new RequestResponseBodyMethodProcessor(
		getMessageConverters(), 
		this.contentNegotiationManager,  
		this.requestResponseBodyAdvice, 
		this.errorResponseInterceptors
	)
);
```

해당 생성자를 보면 다음과 같은 인자를 받는다.  

![[IMG-20261121194525775.png]]

특이한 점은 `requestResponseBodyAdvice`만 `Object` 타입이다.  
그 이유와 해당 클래스들의 역할은 무엇일까?

`AbstractMessageConverterMethodArgumentResolver`의 `advice` 필드를 초기화한다.  
해당 필드의 타입은 `RequestResponseBodyAdviceChain`이다.  

![[IMG-20261121195351637.png]]

`RequestResponseBodyAdviceChain`은 각 Advice를 묶는 객체이다.  

![[IMG-20261121195554577.png]]

[[Spring MVC]]에서 사용하는 `Advice`는 **HTTP 요청 또는 응답을 처리하는 과정에 개입하여 공통적인 작업을 수행하도록 지원하는 확장 기능**이다.

그중 질문에 나온 `requestResponseBodyAdvice`는 HTTP 메시지 본문(Body)을 처리하는 과정에 개입하는 두 종류의 Advice를 관리한다.

- `RequestBodyAdvice`: 요청 본문을 Java 객체로 변환하기 전후에 개입한다.
- `ResponseBodyAdvice`: 컨트롤러의 반환 객체를 HTTP 응답 본문으로 변환하기 직전에 개입한다.

`RequestResponseBodyAdviceChain` 내부를 확인해보면 Spring Boot에서 기본적으로 등록되는 Advice는 다음과 같다. 이 중 `ResponseAdvice`는 `JsonViewResponseBodyAdvice` 밖에 없다.  

![[IMG-20261121201826046.png]]

지금과 같은 상황에서 `JsonViewResponseBodyAdvice`는 동작하지 않는다.  

> [!quote] JsonViewResponseBodyAdvice
> Spring MVC의 `@RequestMapping` 또는 `@ExceptionHandler` 메서드에 선언된 Jackson의 `@JsonView` 어노테이션을 지원하는 `ResponseBodyAdvice` 구현체입니다.
> 
> > [!quote]- 원본
> > A `ResponseBodyAdvice` implementation that adds support for Jackson's `@JsonView` annotation declared on a Spring MVC `@RequestMapping` or `@ExceptionHandler` method.  
> > 
> > https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/servlet/mvc/method/annotation/JsonViewResponseBodyAdvice.html

`ResponseAdvice`를 추가하고 `beforeBodyWrite`에서 `ServerHttpResponse`의 `status` 필드를 변경하는 로직을 추가한다.  

```java
import com.example.controller.CommonResponse;  
import org.jspecify.annotations.Nullable;  
import org.springframework.core.MethodParameter;  
import org.springframework.http.HttpStatusCode;  
import org.springframework.http.MediaType;  
import org.springframework.http.converter.HttpMessageConverter;  
import org.springframework.http.server.ServerHttpRequest;  
import org.springframework.http.server.ServerHttpResponse;  
import org.springframework.web.bind.annotation.RestControllerAdvice;  
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;  
  
@RestControllerAdvice  
public class CommonResponseAdvice implements ResponseBodyAdvice<Object> {  
  
    @Override  
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {  
        return CommonResponse.class.isAssignableFrom(returnType.getParameterType());  
    }  
  
    @Override  
    public @Nullable Object beforeBodyWrite(@Nullable Object body, MethodParameter returnType,  
                                            MediaType selectedContentType,  
                                            Class<? extends HttpMessageConverter<?>> selectedConverterType,  
                                            ServerHttpRequest request, ServerHttpResponse response) {  
  
        if (body instanceof CommonResponse<?> commonResponse) {  
            response.setStatusCode(HttpStatusCode.valueOf(commonResponse.status()));  
        }  
  
        return body;  
    }  
}
```

Application 구동 과정에서 해당 Advice가 추가되는 것을 확인할 수 있다.  

![[IMG-20261121220759811.png]]

이후 해당 방식을 통해서도 HTTP 상태값을 제어할 수 있음을 확인했다.  


%%%%
## 출처 및 참고자료

```cardlink
url: https://mingyum119.tistory.com/303
title: "[Spring] @ResponseBody와 ResponseEntity의 차이점과 동작 원리"
description: "스프링 어플리케이션을 개발하다보면 @ResponseBody나 ResponseEntity와 같이 응답과 관련한 스프링 프레임워크에 정의된 요소들을 사용하게 된다. 🔥 역할 @ResponseBody와 ResponseEntity의 공통적인 역할은 응답 객체를 JSON으로 직렬화한다는 것이다. 코드를 통해 알아보자. 📝 직렬화란? 객체를 직렬화한다는 것은 객체를 송수신이 가능한 형태로 변형하는 것이다. 네트워크 상에서는 Byte 단위로 데이터를 전달하는데, 서버와 클라이언트의 데이터 통신을 위해 객체를 직렬화하는 과정이 필요하다. @ResponseBody @GetMapping(\"/reservations\") public List getReservations() { return adminRepository.getR.."
host: mingyum119.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdnFbRS%2FbtsGI3BHxRJ%2FAAAAAAAAAAAAAAAAAAAAAFo5PpYHPg8EizO0EqReL5GMr_-OVYLpvB9z1mCekzvV%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1796050799%26allow_ip%3D%26allow_referer%3D%26signature%3D98wytq7mGRqo%252BbvGirFgoJUmdWA%253D
```

```cardlink
url: https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/servlet/mvc/method/annotation/JsonViewResponseBodyAdvice.html
title: "JsonViewResponseBodyAdvice (Spring Framework 7.1.0 API)"
description: "declaration: package: org.springframework.web.servlet.mvc.method.annotation, class: JsonViewResponseBodyAdvice"
host: docs.spring.io
```

```cardlink
url: https://github.com/yourjinKR/spring-mvc-http-status-test
title: "GitHub - yourjinKR/spring-mvc-http-status-test: 공통 응답 DTO의 필드값으로 HTTP Status Code 제어하기"
description: "공통 응답 DTO의 필드값으로 HTTP Status Code 제어하기. Contribute to yourjinKR/spring-mvc-http-status-test development by creating an account on GitHub."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/238d1743cf443e199806e1f8d99f13e811bc191e6e700ee8b281414dc35f71e3/yourjinKR/spring-mvc-http-status-test
```
