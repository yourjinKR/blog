---
title: CORS
---

# CORS (Cross-Origin Resource Sharing)

[[SOP]]에 의해 제한된 교차 출처 간 리소스 공유를 허용하기 위한 방식이다.  
요구사항이 복잡해지면서 다른 도메인의 리소스를 활용하는 경우가 많아졌기 때문에 등장했다.  

## 동작 원리

- 서버는 응답 처리 코드에서 CORS 관련 헤더를 설정 가능
- CORS 요청 전 Preflight 요청이 발생 가능

### 단순 요청

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

- 서버는 `Access-Control-Allow-Origin`에 허용된 리소스를 명시하여 응답한다

![[Pasted image 20260712215512.png|501]]

## 출처 및 참고자료

https://developer.mozilla.org/ko/docs/Web/HTTP/Guides/CORS  
https://www.youtube.com/watch?v=BQykNALA2WA  
https://velog.io/@wjdwl002/CORS%EC%9D%98-%EA%B8%B0%EB%B3%B8-%EA%B0%9C%EB%85%90%EA%B3%BC-%EB%8F%99%EC%9E%91-%EB%B0%A9%EC%8B%9D%EB%B6%80%EC%A0%9C-Preflight-%EC%9A%94%EC%B2%AD%EC%9D%B4%EB%9E%80  