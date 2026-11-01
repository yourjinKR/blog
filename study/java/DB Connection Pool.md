---
date: 2026-09-24
aliases:
  - 커넥션 풀
  - 데이터베이스 커넥션 풀
tags:
  - Java
  - DB
---
웹 애플리케이션과 데이터베이스 간의 **연결(Connection)을 미리 여러 개 생성해 두고 보관하는 저장소**이다.

> 데이터베이스 Connection에 대한 Cache

## JDBC Connection Pool

> 대표적인 구현체로 HikariCP가 있다.  

- 애플리케이션을 시작하는 시점에 커넥션 풀은 필요한 만큼 커넥션을 미리 생성하여 보관한다.
- 서비스의 특징과 스펙에 따라 생성되는 Connection 객체의 개수는 다르지만 일반적으로 기본값으로 10개를 생성한다.
- 커넥션 풀에 들어있는 Connection 객체는 TCP/IP로 DB와 연결되어 있는 상태이기 때문에 즉시 SQL을 DB에 전달할 수 있다.
- 즉, DB 드라이버를 통해 새로운 커넥션을 획득하는 것이 아닌 이미 생성되어 있는 커넥션을 참조하여 사용하게 된다.
- 커넥션 풀에 있는 커넥션을 요청하면 커넥션 풀은 자신이 가지고 있는 커넥션 객체 중 하나를 반환한다.

![[IMG-20261013035042098.png]]  
https://docs.oracle.com/cd/E13222_01/wls/docs81/ConsoleHelp/jdbc_connection_pools.html  

> [!CAUTION]
> Pool의 크기를 너무 크게 잡을 경우 DB 메모리/스케줄링 부담 증가로 인한 성능 저하가 발생

%%%%
### 등장배경

[[JDBC]] API를 사용하여 데이터베이스와 연결하기 위해 [[JDBC#Connection|Connection]] 객체를 생성하는 작업은 비용이 많이 드는 작업 중 하나이다.

Connection 객체를 생성하는 과정은 다음과 같다.  

- 애플리케이션에서 DB 드라이버를 통해 커넥션을 조회
- DB 드라이버는 DB와 TCP/IP 커넥션을 연결한다. ([[TCP 3-Way Handshake]] 발생)
- DB 드라이버는 커넥션이 연결되면 아이디와 패스워드, 기타 부가 정보를 DB에 전달
- DB는 아이디, 패스워드를 통해 내부 인증을 거친 후 내부에 DB를 생성
- DB는 커넥션 생성이 완료되었다는 응답을 전송
- DB 드라이버는 커넥션 객체를 생성해서 클라이언트에 반환

매번 커넥션을 생성하는 것은 비효율적이다.  
이를 해결하기 위해 등장한 것이 **Connection Pool**이다.

> [!INFO] TCP를 계속 연결하는건 비용이 들지 않는건가?
> 비용이 아예 없는거 아니다. 다만 커넥션을 다시 수립하는 것보다는 비용이 상대적으로 저렴하기 때문이다. SQL을 실행하지 않는 동안에는 TCP 연결이 **[[TCP#TCP State|Established 상태]]로 존재한다.** 네트워크 대역폭이나 CPU 비용은 매우 적고 TCP Keepalive나 DB의 상태 확인 패킷이 가끔 발생할 수 있지만 이것도 일반적으로 큰 비용은 아니다. 

## 출처 및 참고자료

```cardlink
url: https://ittrue.tistory.com/250
title: "[Java] JDBC란 무엇인가? - Java Database Connectivity"
description: "JDBC란? JDBC(Java Database Connectivity)는 Java 기반 애플리케이션의 데이터를 데이터베이스에 저장 및 업데이트하거나, 데이터베이스에 저장된 데이터를 Java에서 사용할 수 있도록 하는 자바 API이다. JDBC는 Java 애플리케이션에서 데이터베이스에 접근하기 위해 JDBC API를 사용하여 데이터베이스에 연동할 수 있으며, 데이터베이스에서 자료를 쿼리(Query)하거나 업데이트하는 방법을 제공한다. JDBC 표준 인터페이스 JDBC는 3가지 기능을 표준 인터페이스로 정의하여 제공한다. java.sql.Connection - 연결 java.sql.Statement - SQL을 담은 내용 java.sql.ResultSet - SQL 요청 응답 Spring Data JDBC,.."
host: ittrue.tistory.com
favicon: https://t1.daumcdn.net/tistory_admin/favicon/tistory_favicon_32x32.ico
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FIS7Q7%2FbtrR4G2GJPN%2FAAAAAAAAAAAAAAAAAAAAAPQhyoXhser_gAUkcXs9nNPb-HmSTllvbG5GObNy1xOC%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1796050799%26allow_ip%3D%26allow_referer%3D%26signature%3D%252BssfDwMd4rrNwrNO4G8Zyo1mxig%253D
```

```cardlink
url: http://www.ktword.co.kr/test/view/view.php?no=657
title: "TCP 상태"
host: www.ktword.co.kr
```
