---
title: HTTP Keep-Alive
aliases:
  - HTTP keep-alive
  - HTTP persistent connection
  - HTTP connection reuse
  - Persistence connection
---
단일 [[TCP 3-Way Handshake|TCP 연결]]을 사용하여 복수의 [[HTTP|HTTP]] 요청/응답을 주고받는다는 개념이다.  

매번 요청/응답마다 연결을 맺고 끊음을 반복한다면 오버헤드가 발생한다.  
기존 연결을 재사용한다면 지연시간과 서버-클라이언트의 연결 관리 비용을 줄일 수 있다.  

> [!NOTE]
> 대표적인 오버헤드로는 [[TCP 3-Way Handshake]]와 [[HTTPS]]일 경우에는 TLS Handshake까지 수행

**HTTP 1.1부터 지속 연결이 기본 동작**이 되면서 일반적으로 별도의 `keep-alive` 선언이 없이도 연결을 재사용한다.  

![[IMG-20260916171317800.png]]

## 사용 방법

HTTP/1.1부터는 지속연결이 기본 동작이며 아래와 같이 HTTP 헤더에서 확인 가능하다.  
또한 타임아웃(`time`)과 최대 요청 개수(`max`)를 설정하여 연결 상태 최대치를 제어한다.  

```http
HTTP/1.1 200 OK
Connection: Keep-Alive
Content-Encoding: gzip
Content-Type: text/html; charset=utf-8
Date: Thu, 11 Aug 2016 15:23:13 GMT
Keep-Alive: timeout=5, max=1000
Last-Modified: Mon, 25 Jul 2016 04:32:39 GMT
Server: Apache

(body)
```

> [!INFO]
> HTTP 1.1 부터 기본적으로 활성화, 수동으로 비활성화하려면 `Connection: close`를 명시

%%%%
## HOL Blocking

HOL Blocking이란 앞선 요청이나 응답 처리가 지연되면, 뒤에 있는 요청/응답도 함께 지연되는 현상을 말한다.  

HTTP/1.1에서는 요청-응답은 항상 순서를 유지하고 동기적으로 수행된다.  
그렇기에 이전의 요청이 처리되지 않는다면 이후 요청들까지 지연된다.  

```
|------------a.png------------|
                              |-b.png-|
                                      |---c.png---|
```

이를 완화하기 위해 HTTP/1.1에서는 [[HTTP Pipelining]]이라는 기능을 내세웠다.  
그러나 응답을 요청 순서대로 반환한다는 고질적인 문제점이 존재하기에 이를 온전히 해결한 방식은 아니다.  

이를 근본적으로 해결하고자 HTTP/2에서는 [[Multiplexing]]을 지원하였고 HTTP 레벨의 HOL Blocking은 해결됐다.  

## 출처 및 참고자료

```cardlink
url: https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Headers/Keep-Alive
title: "Keep-Alive - HTTP | MDN"
description: "Keep-Alive 일반 헤더는 송신자가 연결에 대한 타임아웃과 요청 최대 개수를 어떻게 정했는지에 대해 알려줍니다."
host: developer.mozilla.org
favicon: https://developer.mozilla.org/favicon.ico
```

```cardlink
url: https://bin-repository.tistory.com/185
title: "HTTP Keep-Alive, 성능 최적화의 핵심일까? 쓸데없는 설정일까?"
description: "웹 성능을 최적화할 때 자주 등장하는 개념 중 하나가 HTTP Keep-Alive다. Keep-Alive는 TCP 연결을 유지해 여러 개의 HTTP 요청을 처리할 수 있도록 도와주지만, 모든 환경에서 무조건 좋은 선택이 되는 것은 아니다. 이번 글에서 Keep-Alive의 개념, 동작 원리, 장단점을 분석해 이것이 성능 최적화의 필수 요소인지, 아니면 특정 환경에서는 피해야 할 설정인지 살펴보자. Keep-Alive 가 뭔데? 기본적으로 HTTP 는 요청과 응답이 끝나면 연결을 끊는 방식으로 동작한다.  하지만 Keep-Alive 가 활성화되면 한번 맺은 TCP 연결을 재사용할 수 있다. 🌱 Keep-Alive 가 비활성화된 기본 HTTP 동작은 어떻게 하는거지?1. 클라이언트가 서버에 요청을 보낸다..."
host: bin-repository.tistory.com
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FJXzxs%2FbtsMkwE4g7E%2FAAAAAAAAAAAAAAAAAAAAAPiPAdpFSM0h2WQOU8s3ecZnBl-4ZY3H9iosvZBQCxbd%2Fimg.jpg%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1790780399%26allow_ip%3D%26allow_referer%3D%26signature%3DEHqeIINUzIcGIZeF1p5ZRsuPaps%253D
```

```cardlink
url: https://velog.io/@dnr6054/HOL-Blocking
title: "HOL Blocking 이란?"
description: "HTTP와 TCP에서의 HOL Blocking 에 대해 알아보자"
host: velog.io
favicon: https://static.velog.io/favicons/favicon-32x32.png
image: https://velog.velcdn.com/images/dnr6054/post/e4131340-6b03-42ad-94f3-7bc8068d49b0/http%3A2%20in%20action%20thumbnail.png
```

```cardlink
url: https://mark-kim.blog/HTTP_0_9_to_1_1/
title: "HTTP 진화과정 이해하기 첫번째 - HTTP 0.9부터 HTTP 1.1까지"
description: "HTTP 0.9 버전부터 HTTP 1.1까지 각 버전의 차이점과 등장 배경 및 버전 별 특징을 정리해본다."
host: mark-kim.blog
image: https://mark-kim.blog/static/872807acc03335bdc0c4b6d83381ea7f/thumbnail.png
```
