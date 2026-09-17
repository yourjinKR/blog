---
tags:
  - 면접
  - 스터디
  - Network
  - Java
  - Spring
  - DB
---
[[면접 스터디 6주차]]의 이론을 **요청 하나가 Java 애플리케이션과 DB를 통과하는 과정, 그리고 그 과정이 느려지거나 실패하는 이유**로 확장하는 학습 로드맵입니다.

기존 [[JDBC]], [[Connection-Pool]], [[@Transactional의 동작 원리에 대해 설명해주세요]], [[N+1 문제란 무엇이며, 해결 방법에는 어떤 것들이 있나요]]를 네트워크 관점으로 다시 연결하는 것을 추천합니다. 아래 실습은 앞으로 수행할 제안이며 측정 결과가 아닙니다. RDB 공통 개념을 중심으로, 구체적인 드라이버 설정은 MySQL을 예로 듭니다. 설정의 기본값·단위·지원 여부는 프로젝트의 JDK·Spring·드라이버 버전으로 확인합니다.

## 학습 우선순위

| 순서 | 연결할 네트워크 개념 | Java·Spring·RDB 학습 주제 | 설명할 수 있어야 할 질문 |
| --- | --- | --- | --- |
| 1 | 계층, 소켓, 포트 | 요청부터 JDBC까지의 처리 경로 | HTTP 요청 하나가 DB 쿼리로 어떻게 이어지는가? |
| 2 | Handshake, Keep-Alive | HTTP 연결 재사용, HikariCP | 연결을 재사용하면 어떤 비용을 줄이는가? |
| 3 | RTT, 손실, 재전송 | 타임아웃, 재시도, 멱등성 | 응답이 없으면 실패했다고 확신할 수 있는가? |
| 4 | 네트워크 대기, 동시성 | 트랜잭션 범위, 커넥션 풀 고갈 | 외부 API 지연이 왜 DB 장애처럼 보이는가? |
| 5 | TLS, 인증서 | 프록시 TLS 종료, Java truststore, DB TLS | 어느 구간이 암호화되고 누구를 신뢰하는가? |
| 6 | DNS, TTL | JVM DNS 캐시, 장애 조치 | DNS 변경 후에도 왜 이전 서버에 연결되는가? |
| 7 | RTT, 대역폭 | N+1, batch fetching, JDBC batching | 빠른 쿼리 여러 개가 왜 API를 느리게 하는가? |
| 8 | 소켓 I/O, 흐름 제어 | MVC·WebFlux·JDBC의 실행 모델 | 스레드를 늘리거나 비동기로 바꾸면 해결되는가? |

## 1. HTTP 요청 하나를 DB까지 추적하기

관련 노트: [[OSI 7계층과 TCP IP 4계층에 대해 설명해주세요]], [[Socket]], [[Port]], [[Spring MVC의 동작 과정에 대해 설명해주세요]], [[JDBC]]

원격 DB를 사용하는 일반적인 Spring MVC 서비스의 경로를 직접 그려봅니다.

```text
브라우저 ── HTTPS ──> Nginx / 로드 밸런서
                         │ 별도의 HTTP 또는 HTTPS 연결
                         v
                    서블릿 컨테이너(Tomcat 등)
                         → Filter / Spring Security
                         → DispatcherServlet
                         → HandlerMapping / HandlerAdapter
                         → Controller → Service → Repository
                         → JPA / JDBC → DataSource에서 연결 대여
                         │ 별도의 DB 프로토콜 연결(TCP, 필요하면 TLS)
                         v
                         RDB
```

**브라우저와 맺은 연결이 그대로 DB까지 이어지는 것은 아닙니다.** 애플리케이션은 HTTP 서버인 동시에 외부 API·DB의 클라이언트가 됩니다. JDBC는 Java API이며, 실제 네트워크에서는 드라이버가 MySQL·PostgreSQL 등의 DB 프로토콜을 사용합니다. 임베디드 H2처럼 네트워크를 사용하지 않는 경우도 구분합니다.

실습: 조회 API 하나에 요청 식별자를 붙여 Controller 진입, Service, SQL, 응답 시점을 기록합니다. 브라우저 개발자 도구의 요청 시간과 서버 로그를 함께 보고 어느 구간의 시간인지 설명합니다. JSON 응답은 일반적으로 `HttpMessageConverter`를 거치며 항상 ViewResolver를 사용하는 것은 아닙니다. [Spring: DispatcherServlet](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html)

> [!QUESTION]- DB 쿼리가 느리면 브라우저와의 TCP 연결도 새로 맺나요?
> 아닙니다. 일반적으로 HTTP 응답이 늦어지는 것이며 연결 재수립과는 별개입니다. 그 사이 프록시나 클라이언트의 타임아웃이 먼저 발생할 수 있습니다.

## 2. HTTP 연결 재사용과 DB 커넥션 풀을 함께 이해하기

관련 노트: [[HTTP Keep-Alive란 무엇인가요]], [[TCP 3-Way Handshake]], [[Connection-Pool]]

HTTP·DB 클라이언트 모두 연결을 재사용하면 TCP 연결 수립, TLS를 사용하는 경우 TLS 협상, 프로토콜 초기화 비용을 줄일 수 있습니다. DB는 인증과 세션 초기화도 필요합니다. Java `HttpClient`는 클라이언트 인스턴스의 연결 풀을 재사용할 수 있으므로 요청마다 새 인스턴스를 생성하는 패턴과 비교해봅니다. [Java HttpClient](https://docs.oracle.com/en/java/javase/25/docs/api/java.net.http/java/net/http/HttpClient.html)

HikariCP에서는 `maximumPoolSize`, 풀에서 연결을 기다리는 `connectionTimeout`, 연결 수명인 `maxLifetime`을 구분합니다. 풀에서 빌린 `Connection.close()`는 일반적으로 물리 연결을 끊지 않고 풀에 반환합니다. `maxLifetime`은 실행 중인 쿼리의 제한 시간이 아니며, 사용 중인 연결은 반환된 뒤 제거합니다. [HikariCP 설정](https://github.com/brettwooldridge/HikariCP#configuration-knobs-baby)

실습: 동일 API를 반복 호출하며 최초 호출과 이후 호출의 지연, 새 연결 수, Hikari의 active·idle·pending 상태를 비교합니다. 최초 요청은 JVM 워밍업 등의 영향도 받으므로 시간 차이 전부를 Handshake 비용으로 해석하지 않습니다.

> [!QUESTION]- HTTP Keep-Alive, TCP Keepalive, Hikari keepalive는 같은가요?
> HTTP Keep-Alive는 HTTP 연결 재사용, TCP Keepalive는 유휴 TCP 연결의 상대 생존 확인입니다. Hikari의 `keepaliveTime`은 유휴 DB 연결에 JDBC 검증 등을 수행하는 주기입니다. 같은 단어라도 계층과 동작이 다릅니다.

## 3. 타임아웃·재시도·멱등성을 하나의 문제로 보기

관련 노트: [[RTT]], [[TCP에서 패킷이 유실되었음을 어떻게 감지하고 재전송하나요]], [[HTTP Method의 차이를 설명해주세요]], [[멱등성]]

TCP가 전송을 재시도해도 애플리케이션은 무한히 기다릴 수 없습니다. 다음 제한 시간이 **어디에서 기다리는 시간인지** 구분합니다.

| 제한 시간 | 기다리는 대상 | 공부할 설정·API |
| --- | --- | --- |
| 연결 풀 획득 대기 | 사용 가능한 연결 | Hikari `connectionTimeout`, HTTP 클라이언트의 pool acquire timeout |
| 연결 수립 | 새 소켓 연결 | 드라이버·HTTP 클라이언트의 connect timeout |
| 네트워크 읽기 | 소켓에서 데이터 도착 | MySQL Connector/J `socketTimeout` 등 |
| SQL 실행 | DB 작업 완료 | JDBC `Statement.setQueryTimeout`, DB의 statement 제한 |
| 전체 요청 예산 | 모든 단계와 재시도를 포함한 처리 | 서비스의 deadline·전체 요청 timeout |

이름이 비슷해도 단위와 범위가 다릅니다. 특히 Hikari `connectionTimeout`은 DB 소켓 연결 제한 시간이 아닙니다. 읽기 타임아웃이 전체 응답 수신 시간을 제한하는지도 구현마다 확인합니다. [Connector/J 네트워크 설정](https://dev.mysql.com/doc/connector-j/en/connector-j-connp-props-networking.html), [JDBC Statement](https://docs.oracle.com/en/java/javase/25/docs/api/java.sql/java/sql/Statement.html#setQueryTimeout(int))

실습: 테스트용 주문 API에서 **DB 커밋 이후 응답만 지연**시켜 클라이언트 타임아웃을 재현합니다. 같은 요청을 재시도했을 때 주문이 중복 생성되는지 확인하고, 요청 키와 DB UNIQUE 제약을 이용해 막아봅니다. 키의 범위, 같은 키로 다른 본문을 보낸 경우, 처리 중인 요청, 기존 결과 반환 정책까지 정합니다.

재시도는 횟수 제한·지수 backoff·jitter와 전체 시간 예산 안에서 설계합니다. 예를 들어 전체 3초 예산이라면 남은 시간이 0.5초일 때 새로운 2초 시도를 시작하지 않도록 합니다. 이는 예시이며 운영 기본값 추천은 아닙니다. HTTP 멱등성의 의미는 [RFC 9110 §9.2.2](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2)를 참고합니다.

> [!QUESTION]- 타임아웃이 났으니 DB도 롤백되었겠죠?
> 단정할 수 없습니다. 서버가 커밋한 뒤 응답만 유실되었을 수 있고, 클라이언트의 대기 종료가 서버 작업의 취소를 보장하지도 않습니다. 결과가 불명확한 경우 업무 식별자로 처리 상태를 조회하고, 재시도에는 중복 방지가 필요합니다. TCP 재전송이 업무의 정확히 한 번 실행을 보장하지는 않습니다.

## 4. 외부 API 지연이 트랜잭션과 커넥션 풀에 미치는 영향

관련 노트: [[@Transactional의 동작 원리에 대해 설명해주세요]], [[Transaction]], [[Lock]], [[Connection-Pool]]

DB 작업으로 커넥션과 락을 확보한 뒤 같은 트랜잭션 안에서 느린 외부 API를 호출하면, 네트워크를 기다리는 동안에도 DB 자원을 오래 점유할 수 있습니다. 그 결과 커넥션 대기와 락 대기가 다른 요청으로 번집니다. 커넥션 획득 시점은 트랜잭션 매니저와 지연 획득 설정 등에 따라 달라지므로 메서드 진입부터 무조건 점유한다고 단정하지 않습니다.

실습: `DB 갱신 → 느린 테스트 API 호출 → 커밋` 구조에 부하를 주고, 외부 API 호출을 트랜잭션 밖으로 분리한 구조와 비교합니다. 외부 호출을 분리하면 부분 실패를 어떻게 처리할지도 함께 설계합니다. 단순히 호출 순서만 바꾸는 것으로 DB 변경과 외부 작업의 원자성이 보장되지는 않습니다. 이후 outbox·상태 전이·보상 처리로 확장할 수 있습니다.

관찰할 지표는 API p95 지연, DB 연결 점유 시간, 풀 대기, 락 대기입니다. 사고 실험으로 처리량이 초당 100건이고 평균 연결 점유가 0.1초라면 평균 점유는 약 10개, 1초라면 약 100개가 됩니다. 이는 정상 상태의 평균을 설명하는 계산이며 풀 크기를 그대로 결정하는 공식은 아닙니다.

> [!QUESTION]- 풀이 부족하면 maximumPoolSize를 크게 하면 되지 않나요?
> DB의 동시 처리 능력을 초과하면 락 경합과 대기가 더 늘 수 있습니다. 먼저 점유 시간과 느린 구간을 확인하고, 애플리케이션 인스턴스 수 × 풀 크기가 DB 연결 예산 안에 있는지도 확인합니다. `REQUIRES_NEW`는 외부 트랜잭션 자원을 유지한 채 추가 연결을 요구할 수 있습니다. [Spring: 트랜잭션 전파와 풀 고갈](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html)

## 5. TLS를 Java·프록시·DB 설정으로 연결하기

관련 노트: [[HTTPS란 무엇이며 동작 과정에 대해 설명해주세요]], [[spring-security]], [[nginx-header-buffer-issue|Nginx 502 에러]]

`브라우저 → 프록시 → Spring → DB` 각 구간에서 TLS 종료 위치와 인증 대상이 누구인지 표시합니다. Java에서는 자신의 개인키·인증서와 상대 검증에 사용할 신뢰 인증서를 구분하고, `SSLContext`, keystore, truststore의 역할을 학습합니다. 인증서 체인 오류와 호스트명 불일치를 구분하는 것도 목표입니다. [Java JSSE](https://docs.oracle.com/en/java/javase/25/security/java-secure-socket-extension-jsse-reference-guide.html)

MySQL Connector/J의 `sslMode=REQUIRED`는 암호화 연결을 요구하지만 서버 신원 검증까지 의미하지 않습니다. `VERIFY_CA`는 인증서 체인, `VERIFY_IDENTITY`는 여기에 호스트명 검증을 추가합니다. [Connector/J TLS 설정](https://dev.mysql.com/doc/connector-j/en/connector-j-connp-props-security.html)

실습: 로컬 테스트 인증서로 정상 연결, 신뢰하지 않는 CA, 호스트명 불일치를 각각 재현하고 원인을 설명합니다. 프록시 뒤에서는 원래 HTTPS 요청이 Spring에서 어떻게 인식되는지 확인합니다. `Forwarded`·`X-Forwarded-*`는 신뢰 경계의 프록시에서 정리해야 하며 외부 입력을 무조건 신뢰해서는 안 됩니다. [Spring: 전달 헤더 처리](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/filter/ForwardedHeaderFilter.html)

> [!QUESTION]- 브라우저에서는 열리는데 Java에서는 인증서 오류가 나는 이유는 무엇인가요?
> 브라우저와 JVM이 사용하는 신뢰 저장소나 인증서 체인 처리 환경이 다를 수 있습니다. 서버의 중간 인증서 누락, JVM truststore, 접속 호스트명을 확인합니다. 인증서 검증을 끄는 것으로 해결하지 않습니다.

## 6. DNS 변경과 Java 애플리케이션의 실제 재연결 시점

관련 노트: [[DNS]], [[www.naver.com에 접속할 때 생기는 과정을 설명해주세요]], [[Replication을 운영할 때 주의해야 할 점은 무엇인가요]]

DNS 레코드 TTL, JVM의 `InetAddress` 캐시 정책, HTTP·DB 연결 풀의 수명을 따로 봅니다. `networkaddress.cache.ttl`·`networkaddress.cache.negative.ttl`은 Java 보안 속성이며 일반적인 `-D` 시스템 속성과 혼동하지 않습니다. 클라이언트가 별도 DNS 리졸버를 사용한다면 해당 정책도 확인합니다. [Java InetAddress](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/net/InetAddress.html)

실습: 통제 가능한 테스트 도메인의 주소를 서버 A에서 B로 바꾸고, 이름 해석 결과와 실제 연결 목적지를 따로 기록합니다. 기존 연결 재사용과 새 연결 수립도 나눠 관찰합니다. DB 장애 조치 역시 이름이 바뀌었다는 사실과 기존 트랜잭션·연결의 복구를 구분합니다.

> [!QUESTION]- DNS TTL을 0으로 설정하면 DB 장애 조치가 즉시 끝나나요?
> 아닙니다. 이미 열린 연결은 그대로 남고 장애 감지, 새 연결 생성, DB 역할 전환에도 시간이 필요합니다. 끊긴 트랜잭션을 어떻게 처리할지도 별도로 결정해야 합니다.

## 7. N+1을 네트워크 왕복 비용으로 다시 보기

관련 노트: [[N+1 문제란 무엇이며, 해결 방법에는 어떤 것들이 있나요]], [[Fetch Join이란 무엇이며, 일반 Join과의 차이점은 무엇인가요]], [[RTT]]

단순화한 모델에서 순차 쿼리 101개가 각각 한 번의 왕복을 필요로 하고 RTT가 5ms라면, 네트워크 대기만 약 505ms입니다. SQL 실행 자체가 빨라도 왕복 횟수가 많으면 느립니다. 실제로는 프로토콜 동작, 결과 크기, 드라이버 처리 등이 추가되므로 측정으로 확인합니다.

실습: 같은 조회 API를 기본 지연 로딩, fetch join, batch fetching, DTO projection으로 구현하고 SQL 수·반환 행 수·응답 크기·p95를 비교합니다. 별도의 쓰기 실험에서는 JDBC batch를 적용합니다. **조회 batch fetching과 쓰기 JDBC batching은 서로 다른 기능**이며, batch API 호출이 언제나 하나의 네트워크 패킷을 뜻하지도 않습니다. 드라이버와 식별자 생성 전략의 제약을 확인합니다. [Hibernate: Fetching·Batching](https://docs.hibernate.org/orm/7.1/userguide/html_single/)

> [!QUESTION]- 쿼리 개수만 줄이면 가장 빠른가요?
> 아닙니다. 큰 조인으로 중복 행과 전송량이 늘거나 메모리 페이징이 발생할 수 있습니다. 왕복 횟수, 전송량, DB 실행 비용, 애플리케이션 메모리를 함께 비교해야 합니다.

## 8. MVC·WebFlux·JDBC의 I/O 모델과 병목 구분하기

관련 노트: [[Blocking, Non-blocking I-O와 동기, 비동기 I-O의 차이는 무엇인가요]], [[TCP의 흐름 제어와 혼잡 제어의 차이를 설명해주세요]], [[how-to-sse-in-matchuri|SSE 구현 방식에 대해]]

일반적인 동기 MVC 처리에서는 DB·외부 호출을 기다리는 동안 요청 처리 스레드가 점유됩니다. 컨테이너가 NIO 소켓을 사용한다는 사실과 애플리케이션 코드가 논블로킹이라는 말은 다릅니다. WebFlux는 이벤트 루프를 막지 않는 것이 중요하며, JDBC/JPA를 그대로 호출한다고 논블로킹 DB 접근이 되지는 않습니다. [Spring: WebFlux 실행 모델](https://docs.spring.io/spring-framework/reference/web/webflux/new-framework.html)

실습: 테스트 서버에서 느린 HTTP API와 느린 DB 쿼리를 각각 호출해 스레드 덤프, 대기 스레드 수, 풀 대기, 처리량을 비교합니다. 이어 JDBC 호출을 이벤트 루프에서 분리하거나 R2DBC를 사용하는 경우의 차이를 검토합니다. 별도 스레드로 옮겨도 JDBC 자체는 블로킹이며 DB 동시 처리 한도는 남아 있습니다.

> [!QUESTION]- TCP 흐름 제어가 있으니 애플리케이션의 부하 제어는 필요 없나요?
> TCP 흐름 제어는 수신 버퍼를 보호하는 기능입니다. 이미 수신한 HTTP 요청의 작업 큐나 DB 커넥션 대기까지 제한하지는 않습니다. 애플리케이션에는 동시 요청 제한, 유한한 큐, 타임아웃 등도 필요합니다.

## 기존 프로젝트 경험에 붙여 볼 확장 과제

- **SSE**: [[how-to-sse-in-matchuri]]에서 프록시 버퍼링, idle timeout, heartbeat, 재연결 후 이벤트 누락·중복을 실험합니다. HTTP 연결을 유지하는 것과 이벤트를 애플리케이션이 처리했음을 보장하는 것은 별개입니다. HTTP/2·HTTP/3에서는 HTTP/1.1의 chunked 전송을 전제로 설명하지 않습니다. [WHATWG: Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- **Nginx 502**: [[nginx-header-buffer-issue]]의 로그를 기준으로 요청 헤더와 upstream **응답 헤더**를 구분합니다. 해당 `upstream sent too big header` 사례를 TLS·TCP 연결 실패와 구별하고, 프록시 로그·응답 크기로 근거를 제시합니다. [Nginx: proxy_buffer_size](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffer_size)

## 추천하는 첫 실습

가장 먼저 **Spring Boot + RDB + 지연을 조절할 수 있는 테스트 외부 API**로 주문 생성 API 하나를 만들어봅니다.

1. 정상 요청의 HTTP·Service·SQL 구간 시간을 기록합니다.
2. DB 연결을 확보한 뒤 외부 API를 지연시켜 커넥션 점유와 풀 대기를 관찰합니다.
3. 외부 호출을 트랜잭션 밖으로 분리하고 부분 실패 정책을 정합니다.
4. 커밋 이후 응답을 지연시킨 뒤 재시도하여 중복 생성 문제를 재현합니다.
5. 멱등성 키와 UNIQUE 제약을 적용하고, 같은 키로 동시에 요청해도 중복 생성되지 않는지 확인합니다.

완료 기준은 **“어느 단계에서 기다렸는지, 어떤 자원이 고갈되었는지, 재시도가 왜 안전한지”를 로그·지표·DB 상태로 설명하는 것**입니다. 이후 TLS와 DNS 실험을 붙이면 6주차 이론을 실제 장애 분석 경험으로 연결할 수 있습니다.

## 복습하면서 표현을 다듬을 부분

- [[HTTP란 무엇이며 특징에 대해 설명해주세요]]의 비연결성은 버전별 지속 연결과 함께 설명합니다. HTTP의 무상태성이 매 요청마다 TCP 연결을 끊는다는 뜻은 아닙니다.
- [[TCP에서 패킷이 유실되었음을 어떻게 감지하고 재전송하나요]]의 중복 ACK는 수신자가 다음에 기대하는 데이터가 아직 오지 않았다는 단서입니다. “해당 ACK를 받지 못했다”와 구분하며, 중복 ACK 3개는 전통적인 Fast Retransmit 기준으로 설명합니다.
- [[Connection-Pool]]의 연결 생성 과정은 “DB 내부에 데이터베이스를 생성”하는 것이 아니라 인증된 연결·세션과 관련 자원을 준비하는 과정으로 이해합니다. 풀의 초기 개수도 구현·설정에 따라 달라집니다.
