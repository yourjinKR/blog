---
date: 2026-10-30
aliases:
  - 아파치 톰캣
  - 톰캣
---

기본적으로 아파치와 톰캣의 기능은 나뉘어져 있지만 톰캣 안에 있는 컨테이너를 통해 일부 아파치의 기능을 발휘하기에 보통 아파치 톰캣으로 둘을 묶어 부른다.  

## Apache (Apache HTTP Server)

클라이언트(브라우저)의 요청을 받아 HTML, CSS, 이미지 같은 **정적인(Static) 데이터**를 처리하고 응답합니다.  

## Tomcat

DB 조회나 비즈니스 로직 처리가 필요한 동적인(Dynamic) 데이터를 생성하기 위해 자바(JSP, [[Servlet]]) 코드를 실행하는 역할을 합니다.


## 출처 및 참고자료

```cardlink
url: https://velog.io/@kdhyo/Apache-Tomcat-%EB%91%98%EC%9D%B4-%EB%AC%B4%EC%8A%A8-%EC%B0%A8%EC%9D%B4%EC%A7%80
title: "Apache? Tomcat?? 둘이 무슨 차이지?"
description: "학교에서 php를 하고, 회사에서 spring boot + jsp를 사용하면서아파치 톰캣을 자연스럽게 사용하게 되었다.하지만, 사용하는 동안 이게 도대체 무엇이길래 웹을 할 때 많은 곳에서 사용하는지?이게 정확히 무엇을 해주는건지?에 대해 많은 궁금증을 가지면서 하다가"
host: velog.io
favicon: https://static.velog.io/favicons/favicon-32x32.png
image: https://velog.velcdn.com/images/kdhyo/post/1e3e3aa2-9f0f-4c06-ad84-662132c09f4b/ah64.jpg
```

```cardlink
url: https://communication-with-it.tistory.com/59
title: "[230623] 네트워크와 Java Spring 기본 개념 이해하기 (1)"
description: "HTTP 네트워크의 핵심은 \"요청\"하고 \"응답\" 받기이다. 자유롭게 요청을 보낸다면 응답을 해주는 쪽에서 요청에 대한 정확한 응답을 내려주기 힘들 것이다. 컴퓨터는 정확히 알려주지 않으면 모르기 때문이다. 제대로 된 응답을 받기 위해 제대로 된 요청을 보내야 했다. 이를 위해 만들어진 규약이 HTTP이다. Web Server HTTP 요청에 대해 정적인 데이터와 동적인 데이터를 응답받을 수 있다. 정적인 데이터의 경우 Web Server에서 처리를 하며 동적인 데이터의 경우 WAS(Web Application Server)에서 처리를 해준다. WAS도 정적인 페이지를 처리를 해줄 수 있지만 정적, 동적 페이지를 분리를 해서 각 서버에서 응답을 해주는 것이 효율이 좋다. 정적인 데이터를 응답해 주는 데에 .."
host: communication-with-it.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FbXoIFd%2Fbtsk833YeXM%2FAAAAAAAAAAAAAAAAAAAAAIqNYt2-TvdAuzG3FVPJN7V6nH6vYu0joyKgkdr-5wyr%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DnnQhI8QdUg1WEGfWeTB8QUSkPWQ%253D
```
