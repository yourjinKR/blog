---
tags:
  - Network
aliases:
  - 포트
---
포트란 하나의 [[IP]] 주소 안에서 실행되는 여러 프로그램이나 서비스를 구분하기 위한 번호이다.  

## 잘 알려진 포트 번호

> 포트번호는 16비트로 이루어져 있다.  (0 ~ 65535)  
> 그 중에서도 0~1023은 well-known ports, system ports (널리 알려진 포트)라고 불린다.  

- **포트 80**: 웹 통신 ([[HTTP]])
- **포트 443**: 보안 웹 통신 ([[HTTPS]])
- **포트 21**: 파일 전송 (FTP)
- **포트 22**: 보안 접속 (SSH)

## 등록된 번호

> IANA에 등록된 번호이다.  

- **3306 포트**: MySQL
- **8080 포트**: Apache Tomcat server


## 출처 및 참고자료

```cardlink
url: https://ooeunz.tistory.com/104
title: "[Network] Port와 포트 포워딩(Port-Forwarding)이란?"
description: "Port란 예를 들어 하나의 서버가 있을 때 이 서버는 다양한 역학을 하게 되는 경우가 있습니다. 웹사이트를 전달해주는 역할, 그리고 파일을 요청하는 역할이 있다고 해보겠습니다. 이럴 경우 클라이언트가 서버에 요청을 보냈을 때, 웹사이트 요청인지 파일 요청인지 구분할 수 있는 방법이 필요하게 됩니다. 이때 바로 Port를 사용하게 됩니다. 포트는 숫자로 표현하게 되어 있으며 65535번까지 존재하며 아래와 같이 3종류로 표현이 됩니다. 0번 ~ 1023번: 잘 알려진 포트 (well-known port) 1024번 ~ 49151번: 등록된 포트 (registered port) 49152번 ~ 65535번: 동적 포트 (dynamic port) 잘 알려진 포트 번호의 대표적 예는 다음과 같습니다. 20 :.."
host: ooeunz.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FkB4pj%2FbtqDjHQjRGR%2FAAAAAAAAAAAAAAAAAAAAADnQyYQHgUy1UbmVpmW-k3dDdGaR38g61qd7Grk9wE2x%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DS85Ubnd%252BX3%252F%252FL05aouItWhwDamA%253D
```
