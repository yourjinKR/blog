---
title: Nginx 502 에러
date: 2026-04-26
tags:
  - 맛추리
  - 트러블슈팅
  - nginx
---
운영서버에서 로그인 시도시 502 Bad Gateway가 발생한다.  

![[Pasted image 20260722010300.png]]  

nginx 로그를 살펴보니 아래와 같은 로그를 확인할 수 있었다.

```
upstream sent too big header while reading response header from upstream
```

![[Pasted image 20260722011256.png]]

해당 로그는 헤더의 버퍼 사이즈보다 더 많은 크기의 요청이 들어올 때 발생하는 것이다.  

> [!info]
> [[buffer|버퍼]]란 데이터가 한 곳에서 다른 곳으로 전송되는 동안 데이터를 임시로 저장하는 데 사용되는 물리적 메모리의 저장소이다.

## 빠른 해결 방법

가장 단순한 해결 방법은 `nginx.conf` 파일에서 아래와 같이 버퍼 최대길이를 늘려준다.  

```nginx
server {
    listen 443 ssl;
    server_name example;

    location / {
        proxy_pass http://127.0.0.1:8080;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 예시값: upstream 응답 헤더 버퍼 확장
        proxy_buffer_size 16k;
        proxy_buffers 8 16k;
    }
}
```

이후 nginx를 재가동한다.  

```
sudo systemctl reload nginx
```

### 설정값

- `proxy_buffer_size`: 백엔드 서버 응답의 첫 부분을 읽기 위한 버퍼 크기를 설정
- `proxy_buffers`: 백엔드 서버로부터의 응답 데이터를 읽는 데 사용할 버퍼의 수와 크기를 설정

## 헤더의 크기를 키우는 것만으로 해결일까?

Spring Security 환경에서 OAuth2 인증을 처리할 때, 인증 요청(Authorization Request)의 상태 정보를 유지하기 위해 세션 대신 객체 전체를 통째로 직렬화하여 쿠키에 넣을 경우 아래와 같이 헤더 크기가 굉장히 커질 수 있다.  

> 헤더 버퍼 기본값은 1KB이지만, 당시 아래와 같은 응답은 약 2~3KB로 예상된다.  

![[Pasted image 20260722015730.png]]

그렇다고 해서 헤더를 키우고 네트워크 통신을 주고 받는다고 가정한다면 동시 접속사가 늘어날수록 서버의 메모리가 고갈될 수도 있다. 앞서 언급한 상황과 같은 배경이라고 가정할 때 다음과 같은 선택지가 있다.  

- OAuth2 구간에만 Session 사용
- 쿠키 직렬화 압축 개선
- Redis Session 도입

## 출처 및 참고자료

https://velog.io/@csk917work/Nginx-%EC%84%9C%EB%B2%84-%EC%84%A4%EC%A0%95  
https://mangkyu.tistory.com/294  
