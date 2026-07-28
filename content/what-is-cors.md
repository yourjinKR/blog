---
title: CORS에 대해 설명해주세요
tags:
  - 면접준비
---
CORS는 **Cross-Origin Resource Sharing**, 즉 교차 출처 리소스 공유의 약자입니다. 브라우저가 동일 출처 정책을 유지하면서도, 서버가 명시적으로 허용한 다른 출처에는 리소스 접근을 허용하도록 만든 HTTP 기반 메커니즘입니다.

여기서 출처인 Origin은 다음 세 요소의 조합으로 결정됩니다.

- 프로토콜
- 호스트
- 포트
    

예를 들어 프론트엔드가 `https://app.example.com`이고 API 서버가 `https://api.example.com`이라면 호스트가 다르기 때문에 서로 다른 출처로 판단됩니다.

## 동일 출처 정책과 CORS

브라우저에는 기본적으로 **동일 출처 정책**, 즉 Same-Origin Policy가 적용됩니다. 이는 한 웹사이트의 JavaScript가 사용자가 로그인해 둔 다른 서비스의 데이터를 임의로 읽지 못하도록 제한하는 보안 정책입니다.

CORS는 이 동일 출처 정책을 제거하는 것이 아니라, **서버가 허용한 출처에 한해서만 예외적으로 응답을 읽을 수 있도록 허용하는 방식**입니다.

따라서 CORS는 서버 간 요청에 적용되는 정책이 아닙니다. Postman이나 curl에서는 정상적으로 호출되지만 브라우저에서는 CORS 오류가 발생할 수 있는 이유도, CORS를 검사하고 응답 접근을 차단하는 주체가 브라우저이기 때문입니다.

## 기본적인 동작 과정

브라우저가 다른 출처의 서버로 요청할 때는 요청 헤더에 자신의 출처를 나타내는 `Origin` 값을 포함합니다.

```http
Origin: https://app.example.com
```

서버가 해당 출처를 허용한다면 응답에 다음과 같은 헤더를 포함합니다.

```http
Access-Control-Allow-Origin: https://app.example.com
```

브라우저는 요청의 `Origin`과 응답의 `Access-Control-Allow-Origin`을 비교합니다.

출처가 허용되어 있으면 응답 데이터를 JavaScript에 전달하고, 허용되어 있지 않거나 CORS 응답 헤더가 없다면 서버가 정상적으로 응답했더라도 JavaScript가 해당 응답을 읽지 못하게 차단합니다.

중요한 점은 **CORS 오류가 발생했다고 해서 요청 자체가 항상 서버에 전달되지 않은 것은 아니라는 것**입니다. 단순 요청의 경우 실제 요청이 이미 서버에 전달되어 데이터 변경까지 발생했지만, 브라우저가 응답만 차단했을 수도 있습니다.

## 단순 요청

다음과 같이 CORS 안전 목록의 조건을 만족하는 요청은 별도의 사전 확인 없이 본 요청이 바로 전송될 수 있습니다.

- `GET`, `HEAD`
    
- 제한된 형태의 `POST`
    
- 허용된 요청 헤더만 사용
    
- 제한된 `Content-Type` 사용
    

대표적으로 다음 Content-Type은 단순 요청 조건에 포함될 수 있습니다.

```text
application/x-www-form-urlencoded
multipart/form-data
text/plain
```

반대로 `application/json`을 사용하는 POST 요청은 일반적으로 단순 요청 조건을 만족하지 않기 때문에 Preflight가 발생합니다.

## Preflight 요청

브라우저가 실제 요청을 바로 보내기 위험하다고 판단하면, 본 요청 전에 서버가 해당 요청을 허용하는지 확인하기 위해 **Preflight 요청**을 보냅니다.

Preflight는 `OPTIONS` 메서드로 전송됩니다.

예를 들어 실제 요청이 다음과 같다고 가정하겠습니다.

```http
DELETE /api/members/1
Authorization: Bearer ...
```

브라우저는 먼저 다음과 같은 요청을 전송합니다.

```http
OPTIONS /api/members/1
Origin: https://app.example.com
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: authorization
```

각 헤더의 의미는 다음과 같습니다.

- `Origin`: 요청을 보내는 출처
    
- `Access-Control-Request-Method`: 실제 요청에서 사용할 HTTP 메서드
    
- `Access-Control-Request-Headers`: 실제 요청에서 사용할 추가 헤더
    

서버는 허용 여부를 다음과 같이 응답합니다.

```http
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
```

브라우저는 Preflight 응답을 검사한 뒤 요청 조건이 모두 허용된 경우에만 실제 요청을 전송합니다.

조건이 맞지 않으면 본 요청은 전송하지 않습니다.

Preflight는 주로 다음과 같은 경우 발생합니다.

- `PUT`, `PATCH`, `DELETE` 등의 메서드 사용
    
- `Authorization`과 같은 안전 목록에 없는 헤더 사용
    
- `Content-Type: application/json` 사용
    
- 사용자 정의 요청 헤더 사용
    

서버는 `Access-Control-Max-Age` 헤더를 통해 Preflight 결과를 일정 시간 동안 캐시하도록 설정할 수도 있습니다.

```http
Access-Control-Max-Age: 3600
```

이를 사용하면 같은 조건의 요청마다 `OPTIONS` 요청이 반복되는 것을 줄일 수 있습니다.

다만 Preflight가 성공했더라도 실제 응답에도 `Access-Control-Allow-Origin` 등 필요한 CORS 헤더가 포함되어 있어야 브라우저가 최종 응답을 JavaScript에 공개합니다.

## withCredentials 옵션

쿠키 기반 세션 인증처럼 교차 출처 요청에 자격 증명을 포함해야 한다면 클라이언트와 서버 양쪽에 추가 설정이 필요합니다.

XMLHttpRequest 또는 Axios에서는 `withCredentials` 옵션을 사용합니다.

```javascript
axios.get("https://api.example.com/members/me", {
  withCredentials: true
});
```

`withCredentials`의 기본값은 `false`입니다. 이를 `true`로 설정하면 브라우저가 교차 출처 요청에 쿠키와 같은 자격 증명을 포함할 수 있도록 요청합니다.

Fetch API에서는 다음과 같이 설정합니다.

```javascript
fetch("https://api.example.com/members/me", {
  credentials: "include"
});
```

하지만 클라이언트에서 `withCredentials: true`만 설정한다고 쿠키 인증이 동작하는 것은 아닙니다. 서버도 응답에 다음 헤더를 포함해야 합니다.

```http
Access-Control-Allow-Credentials: true
```

또한 자격 증명을 포함하는 요청에서는 다음 설정을 사용할 수 없습니다.

```http
Access-Control-Allow-Origin: *
```

와일드카드 대신 허용할 출처를 정확하게 지정해야 합니다.

```http
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true
```

즉, 쿠키를 포함한 CORS 요청이 동작하려면 최소한 다음 조건이 필요합니다.

```text
클라이언트: withCredentials: true
서버: Access-Control-Allow-Credentials: true
서버: Access-Control-Allow-Origin에 구체적인 출처 지정
```

Preflight 요청 자체에는 일반적으로 쿠키와 같은 자격 증명이 포함되지 않습니다. 브라우저가 Preflight 응답을 통해 서버의 허용 여부를 확인한 뒤, 실제 요청에 자격 증명을 포함합니다.

## 쿠키의 SameSite 설정

`withCredentials: true`는 브라우저의 쿠키 정책을 무시하고 쿠키를 강제로 전송하는 옵션이 아닙니다.

교차 사이트 요청에서 쿠키를 전송하려면 쿠키의 `SameSite` 정책도 만족해야 합니다. 일반적으로 교차 사이트 요청에서 쿠키를 사용하려면 다음과 같이 설정합니다.

```http
Set-Cookie: sessionId=abc;
SameSite=None;
Secure
```

`SameSite=None`을 사용하는 쿠키에는 일반적으로 `Secure` 설정도 함께 필요합니다. 따라서 HTTPS 환경에서 전송되어야 합니다.

쿠키 기반 CORS 문제가 발생하면 다음 설정들을 함께 확인해야 합니다.

- 클라이언트의 `withCredentials`
    
- 서버의 `Access-Control-Allow-Credentials`
    
- 서버의 구체적인 `Access-Control-Allow-Origin`
    
- 쿠키의 `SameSite`
    
- 쿠키의 `Secure`
    
- 쿠키의 Domain과 Path
    

## 응답 헤더 노출

서버가 사용자 정의 응답 헤더를 내려주더라도 JavaScript에서 기본적으로 모든 헤더를 읽을 수 있는 것은 아닙니다.

예를 들어 응답의 `X-Request-Id` 헤더를 JavaScript에서 읽으려면 서버가 다음과 같이 설정해야 합니다.

```http
Access-Control-Expose-Headers: X-Request-Id
```

## CORS와 보안

CORS는 인증이나 인가를 대신하지 않습니다. 또한 CORS를 설정했다고 해서 CSRF 공격이 자동으로 방지되는 것도 아닙니다.

CORS의 역할은 브라우저가 교차 출처 응답을 JavaScript에 공개할 수 있는지를 결정하는 것입니다.

따라서 서버에서는 CORS와 별개로 다음 보안 처리가 필요합니다.

- 사용자 인증
    
- 권한 검사
    
- CSRF 방어
    
- 입력값 검증
    

## 최종 답변

정리하면 CORS는 브라우저의 동일 출처 정책을 기반으로, 서버가 허용한 출처에 한해 교차 출처 응답을 JavaScript에서 읽을 수 있도록 허용하는 HTTP 메커니즘입니다. 브라우저는 요청의 `Origin`과 서버가 반환한 `Access-Control-Allow-Origin`을 비교해 응답 접근 여부를 판단합니다.

단순 요청은 본 요청이 바로 전송될 수 있지만, `DELETE`, `Authorization`, `application/json`과 같이 단순 요청 조건을 벗어나면 브라우저가 먼저 `OPTIONS` 방식의 Preflight 요청을 보내 서버의 허용 여부를 확인합니다.

쿠키 기반 인증을 사용하는 경우에는 클라이언트의 `withCredentials: true` 또는 Fetch의 `credentials: "include"` 설정과 함께, 서버의 `Access-Control-Allow-Credentials: true` 설정이 필요합니다. 이 경우 `Access-Control-Allow-Origin: *`는 사용할 수 없으며 허용할 출처를 구체적으로 지정해야 합니다. 또한 쿠키의 `SameSite`, `Secure` 설정까지 만족해야 실제 쿠키가 전송됩니다.

결국 CORS는 서버 요청 자체를 차단하는 기능이라기보다는, 서버의 허용 정책을 바탕으로 브라우저가 교차 출처 응답을 JavaScript에 공개할지를 결정하는 보안 메커니즘이라고 설명할 수 있습니다.

## 참고 공식 문서

- MDN Same-Origin Policy  
    [https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy)
    
- MDN CORS  
    [https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
    
- WHATWG Fetch Standard  
    [https://fetch.spec.whatwg.org/](https://fetch.spec.whatwg.org/)
    
- MDN XMLHttpRequest.withCredentials  
    [https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)
    
- MDN Set-Cookie  
    [https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)