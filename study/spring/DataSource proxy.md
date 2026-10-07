---
date: 2026-09-04
tags:
  - Spring
aliases:
  - 쿼리 정보 집계 로깅
---
DataSource 객체에 프록시를 하여 쿼리에 대한 상세 정보를 조회할 수 있는 라이브러리.

## 설정 방법

### build.gradle.kts

```kotlin
implementation("net.ttddyy:datasource-proxy:1.10")
```

### application.yaml

```yaml
net.ttddyy.dsproxy.listener: DEBUG
```

```yaml
spring:
  datasource:
    hikari:
      jdbc-url: jdbc:mysql://localhost:3306/mydb # 사용하시는 DB URL
      driver-class-name: com.mysql.cj.jdbc.Driver # DB에 맞는 드라이버
      username: root
      password: mypassword
      maximum-pool-size: 10
```

## 구현 방식

### 방법 1) 직접 `DataSource` 등록

DataSource를 프록시로 감싸 `ProxyDataSourceBuilder`를 통해 커스텀

```java
@Configuration  
@EnableTransactionManagement  
public class DatabaseConfig {  
  
    @Value("${matchuri.query-monitor.enabled}")  
    public boolean queryMonitorEnabled;  
  
    @Bean  
    @ConfigurationProperties(prefix = "spring.datasource.hikari")  
    public HikariConfig hikariConfig(DataSourceProperties dataSourceProperties) {  
        HikariConfig hikariConfig = new HikariConfig();  
        hikariConfig.setJdbcUrl(dataSourceProperties.determineUrl());  
        hikariConfig.setUsername(dataSourceProperties.determineUsername());  
        hikariConfig.setPassword(dataSourceProperties.determinePassword());  
        hikariConfig.setDriverClassName(dataSourceProperties.determineDriverClassName());  
        return hikariConfig;  
    }  
  
    @Bean(name = "dataSource")  
    public DataSource dataSource(HikariConfig hikariConfig) {  
  
        DataSource originalDataSource = new HikariDataSource(hikariConfig);  
        if (!queryMonitorEnabled) return originalDataSource;  
  
        Formatter formatter = FormatStyle.BASIC.getFormatter();  
  
        // 기존 Hikari DataSource를 감싸는 Proxy DataSource 생성  
        return ProxyDataSourceBuilder.create(originalDataSource)  
                // 실행된 SELECT/INSERT/UPDATE/DELETE 등의 개수를 집계  
                .countQuery()  
                // 실행된 JDBC 쿼리 정보를 SLF4J의 DEBUG 레벨로 출력  
                .logQueryBySlf4j(SLF4JLogLevel.DEBUG)  
                // Proxy DataSource에 이름 부여  
                .name("matchuri-query-log")  
                // SQL을 Hibernate Formatter로 보기 좋게 포맷  
                .formatQuery(formatter::format)  
                // Query 로그를 여러 줄 형태로 출력  
                .multiline()  
                // 일정 시간보다 오래 걸린 쿼리를 별도로 WARN으로 기록  
                .logSlowQueryBySlf4j(2, TimeUnit.MINUTES, SLF4JLogLevel.WARN)  
                // 설정한 Proxy DataSource 생성  
                .buildProxy();  
    }  
}
```

### 방법 2) `BeanPostProcessor`를 활용하여 프록싱

[[BeanPostProcessor]]를 활용하여 Spring이 만들어준 Bean을 가로채기

```java
@Configuration(proxyBeanMethods = false)  
@ConditionalOnProperty(name = "app.query.logging.enabled", havingValue = "true")  
public class DataSourceProxyConfig {  
  
    private static final String LOGGER_NAME = "org.example.knockin.query";  
  
    @Bean  
    static BeanPostProcessor dataSourceProxyBeanPostProcessor() {  
        return new BeanPostProcessor() {  
            @Override  
            public Object postProcessAfterInitialization(@NotNull Object bean, @NotNull String beanName) {  
                if (!(bean instanceof DataSource dataSource) || bean instanceof ProxyDataSource) {  
                    return bean;  
                }  
  
                return ProxyDataSourceBuilder.create(dataSource)  
                        .name(beanName)  
                        .logQueryBySlf4j(SLF4JLogLevel.INFO, LOGGER_NAME)  
                        .countQuery()  
                        .build();  
            }  
        };  
    }  
}
```

### 로깅 정보

- `Name`: 이 쿼리를 실행한 **ProxyDataSource의 이름**
- `Connection`: datasource-proxy가 식별을 위해 부여한 **JDBC Connection 식별 번호**
- `Time`: JDBC 쿼리 실행에 걸린 **시간(ms)**
- `Success`: JDBC 쿼리 실행의 **성공 여부**
- `Type`: 사용된 JDBC Statement 타입. `Prepared`는 **PreparedStatement 사용**을 의미
- `Batch`: **JDBC Batch 실행 여부**
- `QuerySize`: 이번 실행 컨텍스트에 포함된 **SQL 개수**
- `BatchSize`: Batch 실행에 포함된 **파라미터 세트 개수**. Batch가 아니면 보통 `0`
- `Query`: 실제 실행된 **Prepared SQL**
- `Params`: SQL의 `?`에 바인딩된 **실제 파라미터 값**

![[IMG-20261007221503550.png]]

### ApiQueryCountFilter

해당 필터는 HTTP API 요청 하나가 처리되는 동안 발생한 SQL 쿼리 개수와 JDBC 실행 시간 집계하여 로깅한다.

![[IMG-20260904135051108.png]]

```java
import jakarta.servlet.FilterChain;  
import jakarta.servlet.ServletException;  
import jakarta.servlet.http.HttpServletRequest;  
import jakarta.servlet.http.HttpServletResponse;  
import java.io.IOException;  
import lombok.extern.slf4j.Slf4j;  
import net.ttddyy.dsproxy.QueryCount;  
import net.ttddyy.dsproxy.QueryCountHolder;  
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;  
import org.springframework.stereotype.Component;  
import org.springframework.web.filter.OncePerRequestFilter;  
  
@Slf4j  
@Component  
@ConditionalOnProperty(name = "matchuri.query-monitor.enabled", havingValue = "true")  
public class ApiQueryCountFilter extends OncePerRequestFilter {  
  
    @Override  
    protected void doFilterInternal(  
            HttpServletRequest request,  
            HttpServletResponse response,  
            FilterChain filterChain  
    ) throws ServletException, IOException {  
        QueryCountHolder.clear();  
  
        try {  
            filterChain.doFilter(request, response);  
        } finally {  
            QueryCount queryCount = QueryCountHolder.getGrandTotal();  
            log.info(  
                    "API_QUERY_BEFORE method={} uri={} status={} total={} select={} insert={} update={} delete={} other={} jdbcMs={}",  
                    request.getMethod(),  
                    request.getRequestURI(),  
                    response.getStatus(),  
                    queryCount.getTotal(),  
                    queryCount.getSelect(),  
                    queryCount.getInsert(),  
                    queryCount.getUpdate(),  
                    queryCount.getDelete(),  
                    queryCount.getOther(),  
                    queryCount.getTime()  
            );  
            QueryCountHolder.clear();  
        }  
    }  
}
```

## 오버헤드

운영환경에서도 DataSource Proxy를 적용하는 것은 심각한 성능 저하와 보안 이슈를 유발할 수 있다.  
그렇기에 local/prod별 적정한 환경분리가 필요하다.  

> [!quote]- AI의 답변
> 프로덕션(운영) 환경에서 DataSource Proxy의 모든 기능을 그대로 켜두는 것은 심각한 성능 저하와 보안 이슈를 유발할 수 있으므로, **기능을 대폭 축소하여 제한적으로만 사용**해야 합니다.
> 
> **발생 가능한 주요 오버헤드 및 리스크**
> 
> *   **문자열 연산에 따른 CPU 및 GC(Garbage Collection) 부하:** 쿼리의 `?` 위치에 파라미터를 직접 삽입(인라인 매핑)하고 포매팅하는 과정은 무거운 String 객체 생성 연산을 동반합니다. 트래픽이 높은 운영 환경에서는 불필요한 메모리 할당이 급증하여 GC 지연(Stop-the-world)이 발생하고 CPU 사용률이 치솟습니다.
> *   **디스크 I/O 병목:** 애플리케이션에서 발생하는 모든 쿼리를 포매팅하여 로그 파일이나 콘솔에 쓰게 되면, 로깅 I/O 자체가 시스템의 최대 병목 지점(Bottleneck)이 되어 전체 응답 속도가 저하됩니다.
> *   **민감 정보(PII) 및 보안 데이터 노출:** 파라미터를 그대로 로깅하면 회원의 비밀번호, 전화번호, 이메일, 인증 토큰 등이 사내 로그 수집 시스템(ELK, Datadog 등)에 평문으로 적재되어 심각한 보안 컴플라이언스 위반으로 이어질 수 있습니다.
> *   **프록시 래핑 오버헤드:** DB 커넥션, PreparedStatement, ResultSet 등 모든 JDBC 객체를 프록시로 감싸고 실행을 가로채기 때문에 미세한 리플렉션/프록시 호출 비용이 트랜잭션마다 누적됩니다.
> 
> **운영 환경 적용을 위한 필수 조정 지침**
> 
> *   **전체 쿼리 로깅 비활성화:** 정상적으로 수행된 일반 쿼리는 로깅하지 않습니다. SLF4J 로깅 레벨을 조정하여 DEBUG 레벨의 쿼리 로그가 운영 환경에서는 출력되지 않도록 차단해야 합니다.
> *   **Slow Query 로깅만 제한적 활성화:** 병목 탐지를 위해 `logSlowQueryBySlf4j(3, TimeUnit.SECONDS, SLF4JLogLevel.WARN)`와 같이 임계치를 설정하여, 3초 등 특정 시간을 초과한 악성 쿼리만 WARN 또는 ERROR 레벨로 남기도록 설정합니다.
> *   **Pretty Format 및 Multiline 옵션 제거:** 줄바꿈과 띄어쓰기를 맞추는 쿼리 정렬(`formatQuery`, `multiline`)은 연산 비용이 들 뿐만 아니라, 로그 수집기(Logstash, Fluentd 등)가 멀티라인 로그를 파싱할 때 에러를 유발하기 쉽습니다. 운영에서는 무조건 단일 줄(Single-line)로 출력해야 합니다.
> *   **파라미터 마스킹(Masking) 처리:** 프록시 라이브러리가 제공하는 `ParameterTransformer` 등의 인터페이스를 구현하여, 특정 파라미터(예: password 컬럼) 바인딩 시 로그에는 `***`로 치환되어 출력되도록 안전 장치를 마련해야 합니다.

## Hibernate 로깅과 비교

Hibernate 로깅(Statistics 포함)은 **ORM 애플리케이션 계층**에서 동작하고, DataSource Proxy는 **JDBC 드라이버 계층**에서 동작한다.  

| **비교 항목**         | **Hibernate Logging / Statistics** | **DataSource Proxy (e.g., net.ttddyy)**       |
| ----------------- | ---------------------------------- | --------------------------------------------- |
| **파라미터 바인딩**      | 쿼리에는 `?`로 표시되고, 하단에 별도 로그로 값 출력    | 쿼리 내 `?` 위치에 실제 값을 삽입하여 완성된 SQL 출력            |
| **쿼리 복붙 및 테스트**   | **불가능** (개발자가 `?`에 값을 일일이 대입해야 함)  | **즉시 가능** (로그를 복사해서 DataGrip/DBeaver에서 바로 실행) |
| **로깅 커버리지**       | JPA/Hibernate를 통해 실행된 쿼리만 로깅       | `JdbcTemplate`, `MyBatis` 등 모든 JDBC 통신 로깅     |
| **실행 시간 측정 기준**   | ORM 내부 쿼리 생성 및 매핑 시간 위주            | **실제 네트워크를 타고 DB에 다녀온 정확한 소요 시간**             |
| **Slow Query 탐지** | 전체 통계(Statistics) 위주의 확인           | 특정 시간(예: 3초) 초과 쿼리만 필터링하여 경고 로그(WARN) 발생 가능   |

- **압도적인 디버깅 생산성 (파라미터 인라인 매핑)** 가장 큰 이유입니다. Hibernate의 `TRACE` 레벨 로깅을 켜면 파라미터가 출력되긴 하지만, 쿼리와 파라미터가 분리되어 나옵니다. 파라미터가 10개만 넘어가도 디버깅 시 쿼리를 조립하는 데 엄청난 시간이 낭비됩니다. Proxy는 완성된 쿼리를 뱉어주므로 즉시 DB 툴에 붙여넣어 실행 계획(Explain)을 확인할 수 있습니다.
    
- **하이버네이트의 '거짓말' 회피** Hibernate는 쿼리를 생성하고 캐시에 올리는 시점의 정보를 로깅합니다. 실제 DB로 쿼리가 날아가지 않았는데도(예: 트랜잭션 롤백, 지연 쓰기 등) 쿼리 로그가 찍히는 경우가 발생하여 혼란을 줍니다. Proxy는 실제 DB 커넥션을 타고 넘어가는 순간을 가로채므로 "진짜 DB에 실행된 쿼리"만 정확하게 보여줍니다.
    
- **멀티 모듈 / 혼합 기술 스택에서의 통합 모니터링** 실무에서는 JPA 하나만 쓰기보다 복잡한 통계 쿼리를 위해 `JdbcTemplate`이나 `MyBatis`를 혼용하는 경우가 많습니다. Hibernate 로깅은 JPA 외의 기술로 날아가는 쿼리는 전혀 잡지 못합니다. Proxy를 씌우면 애플리케이션에서 나가는 모든 DB 요청을 하나의 포맷으로 일관되게 수집할 수 있습니다.
    
- **실제 네트워크 비용이 포함된 실행 시간(Slow Query) 측정** Hibernate Statistics가 제공하는 쿼리 실행 시간은 하이버네이트 내부의 처리 시간입니다. 반면 DataSource Proxy는 애플리케이션과 DB 사이의 네트워크 지연, Connection Pool 병목까지 포함된 '실제 체감 실행 시간'을 측정할 수 있어 실질적인 병목 탐지에 훨씬 유리합니다.

## P6Spy와 비교

| **비교 항목**       | **P6Spy**                                  | **DataSource Proxy (net.ttddyy.dsproxy)**                |
| --------------- | ------------------------------------------ | -------------------------------------------------------- |
| **주요 설정 방식**    | 주로 `spy.properties` 같은 별도 외부 설정 파일 의존      | Java 코드(`@Configuration`, `Builder`) 기반의 유연한 제어          |
| **인지도 및 레퍼런스**  | 역사가 깊고 가장 많이 쓰이는 **표준적인 라이브러리** (레퍼런스 압도적) | 상대적으로 모던하며, 객체지향적인 설정을 선호하는 개발자들이 사용                     |
| **확장 및 커스터마이징** | 정해진 옵션과 포매터 안에서 설정 변경                      | 커스텀 리스너(Listener), 파라미터 변환 로직 등을 Java 코드로 직접 구현하기 매우 용이함 |

## AOP, Dynamic Proxy를 활용한 카운팅

추가적인 의존성 없이 구현하는 방식을 설명하는 [블로그 글](https://velog.io/@ohzzi/API%EC%9D%98-%EC%BF%BC%EB%A6%AC-%EA%B0%9C%EC%88%98-%EC%84%B8%EA%B8%B0-2-JDBC-Spring-AOP-Dynamic-Proxy%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-%EC%B9%B4%EC%9A%B4%ED%8C%85)을 찾았다. 나중에 알아보자… 

%%TODO%%

## 출처 및 참고자료

https://github.com/jdbc-observations/datasource-proxy
[모니터링 솔루션 개선하기](https://medium.com/@hc07car/datasource-proxy%EB%A1%9C-%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81-%EC%86%94%EB%A3%A8%EC%85%98-%EC%BF%BC%EB%A6%AC-%EB%A1%9C%EA%B9%85-%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81-%ED%95%98%EA%B8%B0-3e6162a4c6b0)  
https://yeoon.tistory.com/138  
