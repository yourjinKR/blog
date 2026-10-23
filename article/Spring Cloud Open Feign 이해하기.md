---
date: 2026-10-21
tags:
  - Spring
  - SpringCloud
  - 노크인
---
팀원이 올려주신 PR를 보고 코드를 이해하기 위한 정리글이다.  

```cardlink
url: https://github.com/Team-Unearned-Income/11th-1team-BE/pull/363
title: "Refactor: 카카오 소셜 연결 해제에 OpenFeign 및 서킷 브레이커 적용 by Developer-Choi-Jae-Young · Pull Request #363 · Team-Unearned-Income/11th-1team-BE"
description: "PR 타입(하나 이상의 PR 타입을 선택해주세요) Feat : 새로운 백엔드 기능 추가 Bug : 서버/로직 버그 발견 및 수정 Refactor : 백엔드 코드 구조 개선 Chore : 의존성/설정/인프라 유지보수 API : API 엔드포인트 및 스펙 변경 DB : DB 스키마/쿼리/마이그레이션 변경 Performance : 성능 개선 ..."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/88d634e19a690813b734f778148f7175e96e2d69a8d80febba2c5e2b16e3aa78/Team-Unearned-Income/11th-1team-BE/pull/363
```

## 배경 이해하기

카카오에서는 회원 탈퇴시 [연결 해제 API](https://developers.kakao.com/docs/ko/kakaologin/rest-api#unlink)를 호출하도록 권장하고 있다.  

![[IMG-20261021010309448.png]]
https://developers.kakao.com/docs/ko/kakaologin/common#unlink

### RestTemplate로 API 호출

그래서 기존에는 `RestTemplate`를 사용하여 카카오측 외부 API를 직접 호출했다.  

```java
@Override  
public boolean requestUnlink(String providerId) {  
	String unlinkUrl = "https://kapi.kakao.com/v1/user/unlink";  

	HttpHeaders headers = new HttpHeaders();  
	headers.set("Authorization", "KakaoAK " + kakaoAdminKey);  
	headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);  

	MultiValueMap<String, String> body = new LinkedMultiValueMap<>();  
	body.add("target_id_type", "user_id");  
	body.add("target_id", providerId);  

	HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);  

	try {  
		ResponseEntity<String> response = restTemplate.postForEntity(unlinkUrl, request, String.class);  
		return response.getStatusCode().is2xxSuccessful();  
	} catch (RestClientException e) {  
		log.error("카카오 연결 끊기(Unlink) 실패. Provider ID: {}, 에러: {}", providerId, e.getMessage());  
		return false;  
	}  
}  
```

`RestTemplate`는 코드 단에서 URL를 직접 구성하여 HTTP를 호출한다.

- Header 생성
- Content-Type 설정
- Body 생성
- HttpEntity 생성
- POST 요청
- Response 처리

### 카카오 API의 에러가 우리 서비스로 전파 

`try-catch`를 통해 카카오 `unlink` 요청이 실패시 서비스의 탈퇴 로직도 실패처리가 된다는 것이다.  
즉, 카카오 서버에 의해 우리 서비스의 탈퇴 로직에 영향을 끼친다.  

`unlink` 요청과 회원 탈퇴 로직을 분리하면 그만인걸까?
그렇게 된다면 일시적인 네트워크 오류로 인한 잠깐의 장애로 인해 특정 유저들은 unlink되지 않고 탈퇴되며 이를 추적하기에도 불편함이 있을 것이다.   

## 무엇이 바뀌었을까?

우선 HTTP를 호출하는 방식이 `OpenFeign` 방식으로 바뀌었다.  

> [!INFO] OpenFeign이란? 
> Open Feign은 Netflix에 의해 처음 만들어진 Declarative(선언적인) HTTP Client 도구로써, 외부 API 호출을 쉽게할 수 있도록 도와준다. 여기서 “선언적인” 이란 어노테이션 사용을 의미하는데, Open Feign은 인터페이스에 어노테이션들만 붙여주면 구현이 된다. 이러한 방식은 Spring Data JPA와 유사하며, 상당히 편리하게 개발을 할 수 있도록 도와준다.

인터페이스의 추상 메서드에 아래와 같이 어노테이션만 붙여줘도 HTTP 요청이 가능하다.  

```java
@FeignClient(name = "kakao-unlink", url = "https://kapi.kakao.com")
public interface KakaoUnlinkFeignClient {
    @PostMapping(
	    value = "/v1/user/unlink", 
	    consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE
	)
    String unlink(
	    @RequestHeader("Authorization") String authorization,  
	    @RequestBody Map<String, ?> form
	);
```

심지어 해당 인터페이스의 구현체 없이 서비스 코드에 바로 선언해도 동작한다.  
이는 Spring Cloud OpenFeign에서 Feign Proxy 객체 생성 후 Bean을 등록하기 때문이다.  

그렇다면 단순히 간결한 코드 작성만을 위해 OpenFeign을 도입하는걸까?

외부 API 호출을 명시적인 Client 계층으로 분리하였기에  [[Circuit Breaker]] 적용 지점을 명확하게 할 수 있다는 점이다.   
그리고 이러한 장점은 기존에는 카카오 외부 API 실패가 서비스 로직의 실패로 전파된다는 문제점을 해결해 줄 수 있다.  

![[Circuit Breaker#^intro]]

자바 진영에서는 [[Resilience4j]]와 같은 라이브러리를 통해 Circuit Breaker 패턴을 쉽게 구현할 수 있다.  

```java
// 위 unlink 메서드에 추가
@CircuitBreaker(name = "kakaoUnlink", fallbackMethod = "unlinkFallback")
```

특히 인터페이스 default 메서드를 정의하여 어노테이션 속성을 통해 fallback 메서드를 등록할 수 있다.  

```java
default String unlinkFallback(String authorization, Map<String, ?> form, Exception e) {
	var log = LoggerFactory.getLogger(KakaoUnlinkFeignClient.class);
	if (e instanceof CallNotPermittedException) {
		log.warn("생략");
	} else if (e instanceof FeignException feignException) {
		log.warn("실패", feignException.status());
	} else {
		log.warn("실패", e.getClass().getSimpleName());
	}
	return null;
}
```

설정값을 통해 CircuitBreaker/Retry 동작 방식을 제어할 수 있으며 우리의 정책은 다음과 같다.  

- 최근 최대 10개 호출을 관찰
- 최소 5개가 쌓이면 판단 시작
- 실패율 >= 50% OR 2초 이상 걸린 호출 비율 >= 50%
- OPEN
- 30초 동안 외부 호출 차단
- HALF_OPEN
- 최대 3회 시험 호출
	- 정상 → CLOSED
	- 장애 → OPEN

## 의문

의존성 추가 없이 Spring HTTP Service Clients로 구현 가능한데 Spring Cloud Open Feign을 도입해야 할까?

![[IMG-20261021035255607.png]]

직접 테스트를 진행해봤다.  
[[IntelliJ에서 @ImportHttpServices Bean을 인식하지 못하는 문제|Intellij가 Bean을 인식 못하는 버그]]가 있었기에 IDE 자체를 버전업하는 이슈가 있었다.  

```cardlink
url: https://github.com/yourjinKR/11th-1team-BE/pull/1
title: "Refactor: 카카오 Unlink API 선언형 클라이언트 전환 및 서킷브레이커 적용 by yourjinKR · Pull Request #1 · yourjinKR/11th-1team-BE"
description: "PR 타입(하나 이상의 PR 타입을 선택해주세요) Feat : 새로운 백엔드 기능 추가 Bug : 서버/로직 버그 발견 및 수정 Refactor : 백엔드 코드 구조 개선 Chore : 의존성/설정/인프라 유지보수 API : API 엔드포인트 및 스펙 변경 DB : DB 스키마/쿼리/마이그레이션 변경 Performance : 성능 개선 ..."
host: github.com
favicon: https://github.githubassets.com/favicons/favicon.svg
image: https://opengraph.githubassets.com/45d7aedfad74d6875c89168e98cb5cf80d393c097e09ebc464130a8565327780/yourjinKR/11th-1team-BE/pull/1
```


base-url를 인식 못함

![[IMG-20261021152151364.png]]

![[IMG-20261021152234045.png]]

결국 해당 방식 또한 restclient 의존성을 추가해야 특정 http 클라이언트를 그룹화하여 관리할 수 있다.  

```groovy
implementation 'org.springframework.boot:spring-boot-starter-restclient'
```


## 결론

기존 구조에서는 Kakao API의 지연이나 장애가 회원 탈퇴 기능까지 직접 전파되어, 외부 시스템의 상태에 따라 우리 서비스의 가용성에 영향을 받는 문제가 있었다.

그렇다고 일시적인 네트워크 오류 한두 번만으로 외부 호출을 모두 차단하는 것도 적절하지 않다. 따라서 OpenFeign을 통해 Kakao API 호출을 명시적인 외부 클라이언트 계층으로 분리하고, 해당 호출 경계에 Circuit Breaker를 적용하였다. 최근 호출의 실패율과 지연 비율이 일정 기준을 초과한 경우에만 일시적으로 외부 호출을 차단하여, 간헐적인 장애는 허용하면서 반복되는 외부 장애가 우리 서비스까지 전파되는 것을 방지한다.  

## 출처 및 참고자료

```cardlink
url: https://docs.spring.io/spring-cloud-openfeign/reference/spring-cloud-openfeign.html
title: "Spring Cloud OpenFeign Features :: Spring Cloud Openfeign"
host: docs.spring.io
favicon: ./_/img/favicon.ico
```

```cardlink
url: https://docs.spring.io/spring-framework/reference/integration/rest-clients.html#rest-http-service-client
title: "REST Clients :: Spring Framework"
host: docs.spring.io
favicon: ../_/img/favicon.ico
```

```cardlink
url: https://oliveyoung.tech/2023-08-31/circuitbreaker-inventory-squad/
title: "Circuitbreaker를 사용한 장애 전파 방지 | 올리브영 테크블로그"
description: "Circuitbreaker와 Resilience4j A to Z"
host: oliveyoung.tech
favicon: https://oliveyoung.tech/favicon.png
image: https://oliveyoung.tech/blog-images/2023-08-31/banner.png
```

```cardlink
url: https://mangkyu.tistory.com/278
title: "[Spring] OpenFeign이란? OpenFeign 소개 및 사용법"
description: "최근에 있었던 사내 엔지니어링 데이에서 발표를 하였는데, 상당히 편리하지만 많은 분들이 모르시는 OpenFeign을 준비하였습니다. 그리고 발표하면서 준비했던 내용을 블로그 포스팅에서도 적어두었습니다. 아래의 내용은 Spring Cloud OpenFeign 공식 문서를 기반으로 개인적인 경험을 더해 작성한 내용입니다. 1. OpenFeign이란? Open Feign 소개 및 역사 [ OpenFeign이란? ] Open Feign은 Netflix에 의해 처음 만들어진 Declarative(선언적인) HTTP Client 도구로써, 외부 API 호출을 쉽게할 수 있도록 도와준다. 여기서 “선언적인” 이란 어노테이션 사용을 의미하는데, Open Feign은 인터페이스에 어노테이션들만 붙여주면 구현이 된다. 이.."
host: mangkyu.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FdOeRhP%2FbtrQN88y5G7%2FAAAAAAAAAAAAAAAAAAAAAAnJmZ4cy2fWnY4N-tvtpJS_lt8-c-s6AO3OFAk3XJ5J%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D32AGzJrsTNXHayKujYAx8A6LRoo%253D
```

```cardlink
url: https://mangkyu.tistory.com/279
title: "[Spring] OpenFeign 타임아웃(Timeout), 재시도(Retry), 로깅(Logging) 등 설정하기"
description: "최근에 있었던 사내 엔지니어링 데이에서 발표를 하였는데, 상당히 편리하지만 많은 분들이 모르시는 OpenFeign을 준비하였습니다. 그리고 발표하면서 준비했던 내용을 블로그 포스팅에서도 적어두었습니다. 아래의 내용은 Spring Cloud OpenFeign 공식 문서를 기반으로 개인적인 경험을 더해 작성한 내용입니다. 1. OpenFeign 타임아웃(Timeout), 재시도(Retry), 로깅(Logging) 등 설정하기 OpenFeign의 설정은 yml과 Java config 모두로 할 수 있다. 만약 yml과 Java config 모두 존재한다면 YML의 정보가 Java config를 덮어씌우며 우선순위를 가진다. 하지만 이러한 우선순위 설정은 바꿔줄 수 있으며, 심지어 Feign Client 별로 .."
host: mangkyu.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FccKtKH%2FbtrWeH5Kdt3%2FAAAAAAAAAAAAAAAAAAAAANvOC74j7ju_vUoSgQ-MzoBRHnR95GT35NigzYhiQctv%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3DhaNCQJ2oHLdPwoSrPEZdvSjl%252BDg%253D
```

```cardlink
url: https://mangkyu.tistory.com/289
title: "[Spring] OpenFeign에 Resilence4J 서킷 브레이커 적용하는 방법과 예시 및 주의사항"
description: "이번에는 Java 진영의 서킷브레이커 라이브러리인 Resilence4J를 OpenFeign에 적용하는 방법에 대해 알아보도록 하겠습니다. 아래의 내용은 공식 문서와 직접 구현 및 테스트한 부분을 바탕으로 작성되었습니다. 1. Resilence4J 라이브러리와 구성 요소 [ Resilience4J란? ] Resilience4J는 함수형 프로그래밍으로 설계된 경량(lightweight) 장애 허용(fault tolerance) 라이브러리로, 서킷브레이커 패턴을 위해 사용된다. 서킷 브레이커 패턴에 대해서는 앞선 포스팅을 참고하도록 하자. fault-tolerance란 하나 이상의 구성 요소에 문제가 생겨도 시스템이 중단없이 계속 작동할 수 있는 시스템을 의미한다. Resilience4J를 적용하면 외부 서비.."
host: mangkyu.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FuNo1O%2FbtrZbPeAUL7%2FAAAAAAAAAAAAAAAAAAAAALyGMuDivOLOO9SdJpxui5WsbiloIkG2auaNVGeNyDdf%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1793458799%26allow_ip%3D%26allow_referer%3D%26signature%3D40vNzVt83%252F58Y5ESAwRzYRbBmzY%253D
```




