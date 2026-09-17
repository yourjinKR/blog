---
aliases:
  - 인증서
  - Certificate Authority
---
신뢰할 수 있는 인증기관(CA)이 서버의 신원을 검증하고 인증서를 발급한다.

- CA는 CA 공개 키와 CA 비밀 키를 가진다.
- 서버는 서버 공개 키와 서버 비밀 키를 만든다.
- 서버는 공개 키와 서버 정보를 CA에게 전달하여 인증서를 요청한다.
- CA는 검증 후 **CA 비밀 키로 인증서에 전자서명**하여 인증서를 발급한다.
- 클라이언트는 **CA 공개 키로 인증서의 서명을 검증**한다.
- 인증서에는 서버 정보와 서버 공개 키가 있으며, 검증에 성공하면 해당 공개 키가 서버의 것임을 신뢰할 수 있다.

![[Pasted image 20260917025453.png|539]]

## 출처 및 참고자료

```cardlink
url: https://youtu.be/VvacoRwYGZc?t=735
title: "AWS를 이해하기 위한 기초지식 : 암호화,SSL/TLS 인증"
description: "암호화 및 SSL/TLS의 인증서에 대해서 알아보겠습니다.*AWS 강의실 오픈 채팅방 : https://open.kakao.com/o/g7pIU9wf"
host: youtu.be
favicon: https://www.youtube.com/s/desktop/df3ceec1/img/favicon_32x32.png
image: https://i.ytimg.com/vi/VvacoRwYGZc/maxresdefault.jpg
```
