---
tags:
  - Network
---
[[TCP]] 연결 종료시 수행되는 과정이다.  

1. 클라이언트는 서버에게 연결을 종료한다는 FIN 플래그를 보낸다.
2. 서버는 FIN을 받고, 확인했다는 ACK를 클라이언트에게 보낸다. (이때 모든 데이터를 보내기 위해 CLOSE_WAIT 상태가 된다)
3. 데이터를 모두 보냈다면, 연결이 종료되었다는 FIN 플래그를 클라이언트에게 보낸다.
4. 클라이언트는 FIN을 받고, 확인했다는 ACK를 서버에게 보낸다. (아직 서버로부터 받지 못한 데이터가 있을 수 있으므로 TIME_WAIT을 통해 기다린다.)
5. 서버는 ACK를 받은 이후 소켓을 닫는다 (Closed)
6. TIME_WAIT 시간이 끝나면 클라이언트도 닫는다 (Closed)

![[IMG-20260915224456997.png]]

## Half-Close

처음 보내는 종료 요청인 **FIN 패킷**에 실질적으로 **ACK**가 포함되어 있는데, 이는 “**Half-Close 기법”** 을 사용하기 때문이다. 종료 요청자는 종료되었지만 피요청자는 아직 남은 작업(데이터 미전송)이 있기에 데이터를 받을 준비는 해야 한다. 이후 피요청자가 데이터 전송을 마친 후 FIN을 보낼 경우 최초 요청자는 나머지 반을 닫아 안전하게 연결을 종료한다.  

## 4단계인 이유

클라이언트가 종료됐다고 해서 서버도 바로 종료할 수는 없다.  
예를 들어 서버에 아직 클라이언트로 보낼 데이터가 남아있을 경우에는 데이터 전송 작업을 다 마친 후 종료해야 한다.  

## 출처 및 참고자료

```cardlink
url: https://gyoogle.dev/blog/computer-science/network/TCP%203%20way%20handshake%20&%204%20way%20handshake.html
title: "[TCP] 3 way handshake & 4 way handshake | 👨🏻‍💻 Tech Interview"
description: "Ready for Tech-Interview"
host: gyoogle.dev
favicon: https://gyoogle.dev/blog/images/logo.png
```
