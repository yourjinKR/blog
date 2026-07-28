---
title: CORS
---
# CORS (Cross-Origin Resource Sharing)

[[SOP]]에 의해 제한된 교차 출처 간 리소스 공유를 허용하기 위한 방식이다.  
요구사항이 복잡해지면서 다른 도메인의 리소스를 활용하는 경우가 많아졌기 때문에 등장했다.  

## 동작 원리

CORS 요청 전 [[#Preflight Request]]를 통해 허가된 출처인지 확인한다.  

브라우저가 다른 출처의 서버로 요청할 때는 요청 헤더에 자신의 출처를 나타내는 `Origin` 값을 포함한다.

```
Origin: https://app.example.com
```

서버가 해당 출처를 허용한다면 응답에 다음과 같은 헤더를 포함한다.

```
Access-Control-Allow-Origin: https://app.example.com
```

브라우저는 요청의 `Origin`과 응답의 `Access-Control-Allow-Origin`을 비교한다.

출처가 허용되어 있으면 응답 데이터를 JavaScript에 전달하고, 허용되어 있지 않거나 CORS 응답 헤더가 없다면 서버가 정상적으로 응답했더라도 JavaScript가 해당 응답을 읽지 못하게 차단합니다.

중요한 점은 **CORS 오류가 발생했다고 해서 요청 자체가 항상 서버에 전달되지 않은 것은 아니라는 것**입니다. 단순 요청의 경우 실제 요청이 이미 서버에 전달되어 데이터 변경까지 발생했지만, 브라우저가 응답만 차단했을 수도 있습니다.

### 단순 요청

일부 요청은 [[#Preflight Request]]가 발생하지 않으며 조건은 다음과 같다.

- `Content-Type`이 다음과 같은 `GET`, `HEAD`, `POST` 요청
    - `application/x-www-form-urlencoded`
    - `multipart/form-data`
    - `text/plain`

자세한 내용은 [해당 글](https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/CORS#%EB%8B%A8%EC%88%9C_%EC%9A%94%EC%B2%ADsimple_requests) 참고

### Preflight Request

교차 출처 리소스를 호스팅하는 서버가 실제 요청을 허가할 것인지 확인하기 위한 메커니즘이다.

- 브라우저에서 자동으로 실행
- `OPTIONS` 메서드를 사용
- 서버에서 설정한 CORS 관련 설정들을 Header 값으로 확인 가능

> 단순 요청 혹은 이전에 응답받은 Preflight 응답이 캐싱되어 있는 경우에는 Preflight 요청이 일어나지 않는다.  

해당 요청을 통해 CORS 정책을 위반하는 요청으로 인한 서버 부하를 줄인다.   

### Credendential Request

- 클라이언트는 `wittCredentials`를 `true`로 설정하여 요청한다
- 서버는 `Access-Control-Allow-Origin`에 허용된 리소스를 명시하여 응답한다

![[Pasted image 20260712215512.png|501]]

## 출처 및 참고자료

https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/CORS  
https://www.youtube.com/watch?v=BQykNALA2WA  
https://velog.io/@wjdwl002/CORS%EC%9D%98-%EA%B8%B0%EB%B3%B8-%EA%B0%9C%EB%85%90%EA%B3%BC-%EB%8F%99%EC%9E%91-%EB%B0%A9%EC%8B%9D%EB%B6%80%EC%A0%9C-Preflight-%EC%9A%94%EC%B2%AD%EC%9D%B4%EB%9E%80  