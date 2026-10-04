---
date: 2026-07-29
tags:
  - SSE
  - Nginx
  - Web
---
맛추리 프로젝트에서 SSE를 사용하던 중 문제가 발생했고 이를 기반으로 정리했다.  
[[Nginx 리버스 프록시]] 환경에서 [[SSE]]를 사용시 아래와 같은 설정이 요구된다.

```nginx
location = /api/v1/realtime/events {
	proxy_pass http://127.0.0.1:8080;
	proxy_http_version 1.1;

	proxy_set_header Host $host;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	proxy_set_header X-Forwarded-Proto $scheme;

	proxy_buffering off;
	proxy_cache off;
	gzip off;

	proxy_read_timeout 1h;
	proxy_send_timeout 1h;

	add_header X-Accel-Buffering no always;
}
```

## 주요 설정 상세 설명

Nginx가 백엔드 응답을 모아서 보내지 않고 바로바로 클라이언트로 흘려보내야 하기에  
프록시 서버에서 버퍼링을 사용하지 않는다.    

```nginx
proxy_buffering off;
```

압축 과정에서 스트리밍 응답이 버퍼링될 수 있기에 SSE에서는 비활성화.

```nginx
gzip off;
```

백엔드에서 일정 시간 동안 데이터가 안오면 Ngnix가 연결을 끊기에 최소 하트비트 주기보다는 훨씬 길게 잡는다.  

```nginx
proxy_read_timeout 1h;
```

Nginx 앞단에 있는 다른 네트워크 장비(또 다른 프록시, CDN 등)에게도 버퍼링을 하지 말고 바로 응답을 클라이언트로 넘기도록 강제 지시한다.

```nginx
add_header X-Accel-Buffering no always;
```

## 출처 및 참고자료

```cardlink
url: https://whdudev.tistory.com/35
title: "[auctify] Nginx 리버스 프록시일 경우 SSE연결 오류 해결"
description: "✅ 문제 상황로컬 환경에서는 SSE(Server-Sent Events) 연결이 정상적으로 작동했지만,서버 환경에서는 SSE 연결이 수립되지 않거나 응답이 도착하지 않는 문제가 발생했습니다. ✅ 문제 해결 과정처음에는 코드에는 문제가 없어 보였기 때문에, 로컬과 서버 환경의 차이점을 중점적으로 분석했습니다.그 결과, 서버에서는 Nginx가 리버스 프록시로 동작하고 있다는 점이 문제의 핵심이었습니다.Nginx는 기본적으로 응답을 버퍼링하거나, 일정 시간 응답이 없으면 연결을 끊는 설정이 적용되어 있습니다.이로 인해, 실시간으로 데이터를 스트리밍해야 하는 SSE 연결이 정상적으로 유지되지 않았던 것입니다. ✅ 해결 방법Nginx 설정에서 /api/sse/subscribe 경로에 대해 아래와 같이 SSE에 .."
host: whdudev.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Ftistory_admin%2Fstatic%2Fimages%2FopenGraph%2Fopengraph.png
```
