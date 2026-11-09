---
date: 2026-11-09
tags:
  - Spring
---
`RestTemplate`은 동기 방식으로 HTTP 요청을 수행하고 RESTful 서비스를 호출하기 위해 제공되는 클라이언트 클래스이다.  

```java
import org.springframework.web.client.RestTemplate;

RestTemplate restTemplate = new RestTemplate();
```

## 기본 사용법

### 지원 메서드

| **Method**            | **HTTP Method** | **Return Type**   | **설명**                                |
| --------------------- | --------------- | ----------------- | ------------------------------------- |
| **getForObject()**    | GET             | `Object`          | GET 요청에 대한 결과를 객체로 반환합니다              |
| **getForEntity()**    | GET             | `ResponseEntity`  | GET 요청에 대한 결과를 ResponseEntity로 반환합니다  |
| **postForLocation()** | POST            | `URI`             | POST 요청에 대한 결과로 헤더에 저장된 URI 반환합니다     |
| **postForObject()**   | POST            | `Object`          | POST 요청에 대한 결과를 객체로 반환합니다             |
| **postForEntity()**   | POST            | `ResponseEntity`  | POST 요청에 대한 결과를 ResponseEntity로 반환합니다 |
| **put()**             | PUT             | `void`            | PUT 요청을 실행합니다                         |
| **patchForObject()**  | PATCH           | `Object`          | PATCH 요청을 실행하고 결과를 객체로 반환합니다          |
| **delete()**          | DELETE          | `void`            | DELETE 요청을 실행합니다                      |
| **headForHeaders()**  | HEADER          | `HttpHeaders`     | 헤더 정보를 추출하고 HTTP HEAD 메서드를 사용합니다      |
| **optionsForAllow()** | OPTIONS         | `Set<HttpMethod>` | 지원되는 HTTP 메서드를 추출합니다                  |
| **exchange()**        | any             | `ResponseEntity`  | 헤더를 생성하고 모든 요청 방법을 허용합니다              |
| **execute()**         | any             | `T`               | 요청/응답 콜백을 수정합니다                       |

### 헤더 추가

`HttpHeaders`로 헤더 추가 가능

```java
// RestTemplate 생성
RestTemplate restTemplate = new RestTemplate();

// 요청 매개변수 설정
HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.APPLICATION_JSON);
HttpEntity<RequestDto> request = new HttpEntity<>(requestDto, headers);

// HTTP 요청 및 응답 처리
ResponseDto responseDto = restTemplate.exchange(url, HttpMethod.POST, request, ResponseDto.class).getBody();
```

### 쿼리 파라미터 추가

`UriComponentsBuilder`로 추가

```java
RestTemplate restTemplate = new RestTemplate();

HttpHeaders headers = new HttpHeaders();
headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl("<http://example.com/api/users>")
        .queryParam("page", 2)
        .queryParam("size", 10);

HttpEntity entity = new HttpEntity<>(headers);

ResponseEntity response = restTemplate.exchange(
        builder.toUriString(),
        HttpMethod.GET,
        entity,
        String.class);
```

### 바디 추가

```java
MultiValueMap<String, String> body = new LinkedMultiValueMap<>();  
body.add("client_id", clientId);  
body.add("client_secret", clientSecret);  
body.add("token", providerRefreshToken);  
body.add("token_type_hint", "refresh_token");  
  
HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);  
restTemplate.exchange(URL, HttpMethod.POST, request, Void.class);
```


## 로깅 추가

`HttpClientInterceptor`를 구현

```java
public class CustomInterceptor implements HttpClientInterceptor {
    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body,
            ClientHttpRequestExecution execution) throws IOException {
        // Request 수정
        request.getHeaders().add("Custom-Header", "Custom-Value");

        // Request 정보 로깅
        log.info("Request URI : {}", request.getURI());
        log.info("Request Method : {}", request.getMethod());
        log.info("Request Headers : {}", request.getHeaders());
        log.info("Request Body : {}", new String(body, "UTF-8"));

        // 다음 인터셉터 또는 요청 실행
        ClientHttpResponse response = execution.execute(request, body);

        // Response 정보 로깅
        log.info("Response Status : {}", response.getStatusCode());
        log.info("Response Headers : {}", response.getHeaders());

        return response;
    }
}

```

## 타임아웃 등록

`SimpleClientHttpRequestFactory`를 활용하여 구현 가능

```java
@Configuration
public class RestClientConfig {

    @Bean
    public RestClient googleCaptchaRestClient(
            RestClient.Builder builder, // Spring에서 제공하는 기본적인 Builder를 활용
            GoogleRecaptchaProperties properties
    ) {
        SimpleClientHttpRequestFactory requestFactory =
                new SimpleClientHttpRequestFactory();

        requestFactory.setConnectTimeout(
                Duration.ofMillis(properties.getConnectTimeoutMillis())
        );
        requestFactory.setReadTimeout(
                Duration.ofMillis(properties.getReadTimeoutMillis())
        );

        return builder
                .requestFactory(requestFactory)
                .build();
    }
}
```

`RestTemplate`에는 고정적으로 설정된 timeout이 없다.  
대신 `ClientHttpRequestFactory`를 구현한 `SimpleClientHttpRequestFactory`를 사용한다.  

![[IMG-20261109220645793.png]]

`SimpleClientHttpRequestFactory`는 연결과 읽기에 대한 timeout이 `-1`(무한 대기)로 설정되어 있다.

```java
public class SimpleClientHttpRequestFactory implements ClientHttpRequestFactory {  
  
    private static final int DEFAULT_CHUNK_SIZE = 4096;  
  
  
    private @Nullable Proxy proxy;  
  
    private int chunkSize = DEFAULT_CHUNK_SIZE;  
  
    private int connectTimeout = -1;  
  
    private int readTimeout = -1;
}
```

그리고 이 timeout 설정은 JDK의 `HttpURLConnection`에 사용된다.  

![[IMG-20261109221015430.png]]


## 빈으로 등록

```java
@Configuration  
public class AppConfig {  
  
    @Bean  
    public RestTemplate getRestTemplate() {   
        return new RestTemplate();  
    }  
}
```


## 출처 및 참고자료

```cardlink
url: https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/client/RestTemplate.html
title: "RestTemplate (Spring Framework 7.0.10 API)"
description: "declaration: package: org.springframework.web.client, class: RestTemplate"
host: docs.spring.io
```

```cardlink
url: https://adjh54.tistory.com/234
title: "[Java] Spring Boot Web 활용 : RestTemplate 이해하기"
description: "해당 글에서는 RestTemplate에 대해 이해하고 활용 방법에 대해 확인해 봅니다.💡 [참고] Java에서 외부 통신을 하는 방법들에 대해 궁금하시면 아래의 글을 참고하시면 도움이 됩니다분류주제링크RestTemplateSpring Boot Web 활용 : RestTemplate 이해하기https://adjh54.tistory.com/234WebClientSpring Boot Webflux 이해하기 -1 : 흐름 및 주요 특징 이해https://adjh54.tistory.com/232WebClientSpring Boot Webflux 이해하기 -2 : 활용하기https://adjh54.tistory.com/233Open FeignSpring Cloud OpenFeign 이해하고 활용하기 -1 : 주요.."
host: adjh54.tistory.com
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdRCWcU%2FbtsLJNaaVMG%2FAAAAAAAAAAAAAAAAAAAAAP9liTn1c3MM_VkcOZQAxDnpEi4NUn-bDXZrsamv8T-U%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1796050799%26allow_ip%3D%26allow_referer%3D%26signature%3Duzso5hCaDsBIHU6cyJzjghpZURg%253D
```

```cardlink
url: https://brush-describr.tistory.com/entry/SPRING-RestTemplate%EC%9C%BC%EB%A1%9C-Http%ED%86%B5%EC%8B%A0%ED%95%98%EA%B8%B0boring-code-%EC%A4%84%EC%9D%B4%EA%B8%B0
title: "SPRING - RestTemplate으로 Http통신하기(boring code 줄이기)"
description: "RestTemplate를 적용하려는 팀원들에게 도움이 되고자 정리해봅니다. HTTP통신에는 URLConnection과 HttpClient가 있는데, 보통 HttpClient를 사용해왔다. CloseableHttpClient httpClient = HttpClients.createDefault(); HttpGet httpGet = new HttpGet(\"URI\"); CloseableHttpResponse response = httpClient.execute(httpGet); HttpEntity entity = response.getEntity(); String result = EntityUtils.toString(entity); URIconnection과 비교했을 때 HttpClient 방식은 1) 모든 .."
host: brush-describr.tistory.com
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Ftistory_admin%2Fstatic%2Fimages%2FopenGraph%2Fopengraph.png
```

