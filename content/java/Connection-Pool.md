---
title: 커넥션 풀
aliases:
  - 커넥션 풀
  - Connection Pool
---
[[JDBC]] API를 사용하여 데이터베이스와 연결하기 위해 [[JDBC#Connection|Connection]] 객체를 생성하는 작업은 비용이 많이 드는 작업 중 하나이다.

- 애플리케이션에서 DB 드라이버를 통해 커넥션을 조회
- DB 드라이버는 DB와 TCP/IP 커넥션을 연결한다. ([[tcp#TCP 3-way Handshake|3 way handshake]] 발생)
- DB 드라이버는 커넥션이 연결되면 아이디와 패스워드, 기타 부가 정보를 DB에 전달
- DB는 아이디, 패스워드를 통해 내부 인증을 거친 후 내부에 DB를 생성
- DB는 커넥션 생성이 완료되었다는 응답을 전송
- DB 드라이버는 커넥션 객체를 생성해서 클라이언트에 반환

매번 커넥션을 생성하는 것은 비효율적이다.  
이를 해결하기 위해 등장한 것이 **Connection Pool**이다.

## Connection Pool

- 애플리케이션을 시작하는 시점에 커넥션 풀은 필요한 만큼 커넥션을 미리 생성하여 보관한다.
- 서비스의 특징과 스펙에 따라 생성되는 Connection 객체의 개수는 다르지만 일반적으로 기본값으로 10개를 생성한다.
- 커넥션 풀에 들어있는 Connection 객체는 TCP/IP로 DB와 연결되어 있는 상태이기 때문에 즉시 SQL을 DB에 전달할 수 있다.
- 즉, DB 드라이버를 통해 새로운 커넥션을 획득하는 것이 아닌 이미 생성되어 있는 커넥션을 참조하여 사용하게 된다.
- 커넥션 풀에 있는 커넥션을 요청하면 커넥션 풀은 자신이 가지고 있는 커넥션 객체 중 하나를 반환한다.

![[Pasted image 20260723210823.png]]  
https://docs.oracle.com/cd/E13222_01/wls/docs81/ConsoleHelp/jdbc_connection_pools.html  

## 출처 및 참고자료

https://ittrue.tistory.com/250#google_vignette