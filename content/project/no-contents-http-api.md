---
title: 리소스가 없을 수도 있는 API에 대한 고민
tags:
  - 맛추리
---
## 개요

사용자의 위치 정보를 조회하는 API가 추가됐다.  
위치 정보는 한 유저가 하나의 위치정보만을 갖고 있기에 `me` 기반 조회로 설계했다.  

```http
GET api/v1/members/me/location
```

해당 API는 요청한 유저의 위치 정보가 없을 경우 `404 Not Found`를 반환한다.  
그러나 FE 측에서 해당 정보는 필수 입력 정보가 아니기에 `404` 에러 발생에 대해 검토를 제안했다.  

1. `404 Not Found` (기존 방식)
2. `200 OK` + `data : null` (제안한 방식)

두가지 선택지 중에서 `204 No Content`를 명시하도록 제안했다. 그러나 해당 방식에 대해 확신이 들지는 않았기에  
RFC 표준스펙에서는 `204` 응답이 어떤 의미이며 기존 방식 혹은 제안해준 방식도 검토하여 방향성을 정하기로 했다.  

## `204 Not Content`

> 요청에 대해서 보내줄 수 있는 콘텐츠가 없지만, 헤더는 의미있을 수 있습니다.  
> 사용자-에이전트는 리소스가 캐시된 헤더를 새로운 것으로 업데이트 할 수 있습니다.
> [출처: MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Status#%EC%84%B1%EA%B3%B5_%EC%9D%91%EB%8B%B5)

![[Pasted image 20260715151330.png]]  
https://www.rfc-editor.org/rfc/rfc9110.html#section-15.3.5

핵심은 body에 값을 넣지 않도록 설계됐다는 점이다.  
이에 대응하여 [일부 프레임워크](https://www.rockyourcode.com/express.js-send-responses/)에서는 `204` 응답에 대해 `body`의 본문을 무시한다고 한다.   

## `404 Not Founds`

`GET` 요청은 대상 리소스에 대한 현재 선택된 표현의 전송을 요청하는 것이다.

![[Pasted image 20260715154043.png]]

대상 리소스를 서버가 찾을 수 없다는 `404 Not Found` 또한 충분히 표준에 맞는 응답이다.

## `200 OK + null`

성공과 데이터 없음을 표현하는 것이 과연 괜찮을까?
1:1 대응 관계에서 리소스가 없다면 `null`를 반환할 수도 있다고 [json api 스펙](https://jsonapi.org/format/#fetching-resources-responses-200)에서 언급한다.  

## 결론

현재는 위치 정보를 입력 여부에 따른 사용자를 구분할 필요가 없다. 또한, 위치 정보는 필수 입력값이 아니기에 사용자 기준으로 위치 정보를 조회하는 것이 클라이언트 오류라고 해석하기에는 어렵다고 판단하여 `200 + null`로 결정했다.  

### 결정 기준

- `404 Not Found`
	- `GET` 요청에 대한 리소스가 없는 것을 명확히 표현
	- 위치정보를 입력하지 않은 유저가 페이지 진입하는 것 만으로 클라이언트 오류로 해석
- `200 OK + null`
	- `GET` 요청에 대한 성공과는 별개로 리소스의 여부는 `body` 내부 값으로 표현
	- 사용자가 위치 정보를 갖고 있음 여부를 구분할 필요가 없을 때 
	- `body` 내부 `data` 자체가 nullable
- `204 No Contents`
	- 요청한 리소스가 없음을 명시
	- `body`에 값이 없기에 `http status`로 분기 처리 필요
		- `200` → `body` 확인
		- `204` → 데이터 없음 간주

