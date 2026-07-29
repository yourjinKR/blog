---
title: HSTS
---
# HSTS (HTTP-Strict-Transport-Security)

HSTS는 사이트가 [[HTTPS]]를 통해서만 접근되어야 하며 향후 [[http|HTTP]]를 사용하여 사이트에 접근하려는 모든 시도는 자동으로 HTTPS로 변환되어야 함을 브라우저에 알리는 [[http-header|헤더]]값이다.

```
Strict-Transport-Security: max-age=<expire-time>
Strict-Transport-Security: max-age=<expire-time>; includeSubDomains
Strict-Transport-Security: max-age=<expire-time>; includeSubDomains; preload
```

![[Pasted image 20260713192353.png]]

## 지시어

- `max-age`: HTTPS를 통해서만 사이트에 접근할 수 있음을 브라우저가 기억해야 하는 시간(초)
- `includeSubDomains`: 매개변수 지정시, 사이트의 모든 하위 도메인에도 적용
- `preload`: `preload`를 사용하는 경우 `max-age` 지시어는 `31536000`(1년) 이상이어야 하며 `includeSubDomains` 지시문이 있어야 한다.  

## Cloudflare에서 설정

cloudflare에서는 `Edge Certificates` 탭에서 설정 가능

![[Pasted image 20260713192838.png]]

![[Pasted image 20260713192939.png]]
  
![[Pasted image 20260713192926.png]]

- **No-Sniff Header**: HSTS와는 목적이 살짝 다른 보안 헤더인 `X-Content-Type-Options: nosniff`를 응답에 추가합니다. → 키는 것을 권장

## 출처 및 참고자료

https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security