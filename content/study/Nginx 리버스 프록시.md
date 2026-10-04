---
date: 2026-07-29
tags:
  - Nginx
  - Web
---
## Reverse Proxy

Reverse Proxy란 클라이언트 장치와 백엔드 서버 사이에 위치하여 클라이언트 요청을 백엔드 서버에 전달하고 서버의 응답을 클라이언트에 반환하는 서버입니다. 외부 서버에 대한 클라이언트 요청의 중개자 역할을 하는 Forward Proxy와 달리 Reverse Proxy 는 네트워크 트래픽 관리를 위한 추가 수준의 추상화 및 제어를 제공합니다.

## Nginx의 Reverse Proxy

`proxy_pass` 지시문으로 리버스 프록시 설정

```nginx
server {
	location / {
	    proxy_pass http://127.0.0.1:8080;
	}
}
```

## Nginx의 Load Balancer

NGINX Reverse Proxy 사용의 주요 이점 중 하나는 로드 밸런싱이다.  
아래와 같이 간단하게 로드밸런싱을 구축할 수 있다.  

```nginx
upstream backend_servers {
    server 172.17.0.2:8081;
    server 172.17.0.2:8082;
    server 172.17.0.2:8083;
}

server {
    listen 80;
    server_name yourdomain.com;
    location / {
        proxy_pass http://backend_servers;
    }
}
```

## 출처 및 참고자료

```cardlink
url: https://nginxstore.com/training/nginx-reverse-proxy-%EB%A1%9C-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0/
title: "NGINX Reverse Proxy 로 설정하기"
description: "NGINX Reverse Proxy 는 NGINX 인스턴스에 대해 가장 널리 배포된 사용 사례 중 하나이며 클라이언트와 서버 간의 원활한 네트워크 트래픽 흐름을 보장하기 위해 추가 수준의 추상화 및 제어를 제공합니다."
host: nginxstore.com
favicon: https://i0.wp.com/nginxstore.com/wp-content/uploads/2022/06/cropped-NGINX-STORE_Site_Icon.png?fit=32%2C32&ssl=1
```

```cardlink
url: https://www.cloudflare.com/ko-kr/learning/cdn/glossary/reverse-proxy/
title: "리버스 프록시란? | 프록시서버 설명"
description: "리버스 프록시는 웹 서버를 공격으로부터 보호하고 안정성을 제공합니다."
host: www.cloudflare.com
image: https://cf-assets.www.cloudflare.com/slt3lc6tev37/2fkUOlpeGbZoV4Cq2NgLlz/69471d35eb36c7d061b415845594c5e4/cdn-lc.png
```
