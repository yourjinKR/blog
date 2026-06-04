---
title: 청크 인코딩
---
# 청크 인코딩

- HTTP 응답을 한번에 다 만들고 보내는 방식이 아니라, 작은 조각 단위로 나누어 계속 보내는 방식이다.  
- 청크 전송 인코딩에서 데이터 스트림은 서로 겹치지 않은 **청크**로 나눈다.  
	- 각 청크는 서로 독립적으로 송수신된다.  
	- 송신자와 수신자 모두 현재 처리 중인 청크 이외의 데이터 스트림에 대해 알 필요가 없다.  
	- 각 청크 앞에는 해당 청크의 크기가 표시되며, **크기가 0인 덩어리가 수신되면 전송이 종료된다.**  
- Transfer-Encoding 헤더 의 chunked 키워드는 청크 단위 전송을 나타냅니다.

## 일반적인 HTTP 방식의 한계점

보통 HTTP 응답은 다음과 같다.  

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 42

{"id":1,"name":"kim","age":20}
```

서버가 응답 본문의 전체 길이를 미리 알고 있다.  

> 서버가 클라이언트에게 → "야! 응답 본문은 42바이트야, 이만큼 받으면 끝이야"

아래와 같이 보통 일반적인 API 응답은 서버가 JSON을 완성한 뒤 한번에 내려보내기 때문이다.

```java
return ResponseEntity.ok(memberDto);
```

그런데, 실시간 기능과 같은 스트리밍은 서버가 전체 길이를 알기 힘들다.  
그렇기에 Content-Length를 쓸 수 없다.  

이 때 사용하는 것이 **청크 인코딩**이다.  

## 그래서 청크 인코딩이란

청크 인코딩은 응답 본문을 여러 조각으로 나눈다.  

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Transfer-Encoding: chunked
```

> `Transfer-Encoding: chunked`는 전체 응답은 모르니깐 데이터를 조각 단위로 보내겠다.  

데이터는 아래와 같이 전송된다.  

```http
5
Hello
6
World
```

만약 0을 보낸다면 더 이상 보낼 데이터가 없다는 것이며 접속이 종료된다.

```http
5
Hello
6
World
```



## 출처 및 참고자료

https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Headers/Transfer-Encoding  
https://en.wikipedia.org/wiki/Chunked_transfer_encoding  
