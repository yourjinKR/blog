---
tags:
  - Network
aliases:
  - 포트 포워딩
---
포트포워딩이란 네트워크 내 특정 호스트에 IP 주소와 [[Port|포트]] 번호를 미리 할당하고, 해당 IP 주소:포트 번호로써 해당 호스트에게 패킷을 전달하는 기능이다.  

![[IMG-20260914160833419.png|424]]

## 도커 포트포워딩

대표적으로 Doker에서도 포트포워딩에 개념이 존재한다.  
호스트 컴퓨터의 포트를 컨테이너 내부 포트와 연결하여 외부에서 컨테이너 내부의 서비스에 접속하게 한다.  

```bash
docker run -p [호스트_포트]:[컨테이너_포트] [이미지 이름]
```

```bash
docker run -d -p 8080:80 --name my-web-server httpd
```

## 출처 및 참고자료

```cardlink
url: https://ooeunz.tistory.com/104
title: "[Network] Port와 포트 포워딩(Port-Forwarding)이란?"
description: "Port란 예를 들어 하나의 서버가 있을 때 이 서버는 다양한 역학을 하게 되는 경우가 있습니다. 웹사이트를 전달해주는 역할, 그리고 파일을 요청하는 역할이 있다고 해보겠습니다. 이럴 경우 클라이언트가 서버에 요청을 보냈을 때, 웹사이트 요청인지 파일 요청인지 구분할 수 있는 방법이 필요하게 됩니다. 이때 바로 Port를 사용하게 됩니다. 포트는 숫자로 표현하게 되어 있으며 65535번까지 존재하며 아래와 같이 3종류로 표현이 됩니다. 0번 ~ 1023번: 잘 알려진 포트 (well-known port) 1024번 ~ 49151번: 등록된 포트 (registered port) 49152번 ~ 65535번: 동적 포트 (dynamic port) 잘 알려진 포트 번호의 대표적 예는 다음과 같습니다. 20 :.."
host: ooeunz.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FkB4pj%2FbtqDjHQjRGR%2FAAAAAAAAAAAAAAAAAAAAADnQyYQHgUy1UbmVpmW-k3dDdGaR38g61qd7Grk9wE2x%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DS85Ubnd%252BX3%252F%252FL05aouItWhwDamA%253D
```

```cardlink
url: https://medium.datadriveninvestor.com/port-forwarding-for-beginners-11355d000867
title: "Port forwarding for beginners"
description: "Before getting into port forwarding, let me explain a few basic networking concepts. Each device connected to a network has a unique…"
host: medium.datadriveninvestor.com
favicon: https://miro.medium.com/v2/5d8de952517e8160e40ef9841c781cdc14a5db313057fa3c3de41c6f5b494b19
image: https://miro.medium.com/v2/resize:fit:1104/1*taIkKo9sDBnhAEZhxqySbQ.jpeg
```
