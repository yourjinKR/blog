---
title: Nginx 502 에러
date: 2026-04-26
tags:
  - 맛추리
  - 트러블슈팅
  - nginx
---
## 문제상황

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

%%  %%
## 해결 방법 1) 버퍼 최대 길이 늘리기

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

### 해결 방법 2) 큰 요청에 대해서만 별개로 처리하기

대부분의 HTTP 요청들은 헤더의 크기가 작을 것이다. 그런데 일부 특수한 상황을 위해 모든 요청에 대한 버퍼 크기를 늘리는 것은 과한 선택지가 될 수 있다. 

아래와 같이 설정시 평소 요청에는 1KB로 처리하고 큰 요청이 왔을 때만 8KB로 처리할 수 있다.

```nginx
client_header_buffer_size 1k;
large_client_header_buffers 4 8k;
```

### 설정값 정리

- `proxy_buffer_size`: 백엔드 서버 응답의 첫 부분을 읽기 위한 버퍼 크기를 설정
- `proxy_buffers`: 백엔드 서버로부터의 응답 데이터를 읽는 데 사용할 버퍼의 수와 크기를 설정

## 출처 및 참고자료

https://velog.io/@csk917work/Nginx-%EC%84%9C%EB%B2%84-%EC%84%A4%EC%A0%95  
https://sub0709.tistory.com/175  
https://mangkyu.tistory.com/294  
