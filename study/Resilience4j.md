---
date: 2026-10-21
tags:
  - Java
  - Spring
---
Resilience4J는 함수형 프로그래밍으로 설계된 경량(lightweight) 장애 허용(fault tolerance) 라이브러리로, [[Circuit Breaker|서킷 브레이커 패턴]]을 위해 사용한다.  

## 주요 모듈

Resilience4j 의 코어 모듈은 아래와 같으며, 필요한 모듈을 선택하여 사용할 수 있습니다.

```groovy
dependencies {
  // 1. CircuitBreaker : 장애 전파 방지 기능 제공
  implementation("io.github.resilience4j:resilience4j-circuitbreaker:${resilience4jVersion}")
  // 2. Retry : 요청 실패 시 재시도 처리 기능 제공
  implementation("io.github.resilience4j:resilience4j-retry:${resilience4jVersion}")
  // 3. RateLimiter : 제한치를 넘어서 요청을 거부하거나 Queue 생성하여 처리하는 기능 제공
  implementation("io.github.resilience4j:resilience4j-ratelimiter:${resilience4jVersion}")
  // 4. TimeLimiter : 실행 시간제한 설정 기능 제공
  implementation("io.github.resilience4j:resilience4j-timelimiter:${resilience4jVersion}")
  // 5. Bulkhead : 동시 실행 횟수 제한 기능 제공
  implementation("io.github.resilience4j:resilience4j-bulkhead:${resilience4jVersion}")
  // 6. Cache : 결과 캐싱 기능 제공
  implementation("io.github.resilience4j:resilience4j-cache:${resilience4jVersion}")
}
```

각 모듈은 아래와 같은 순서로 동작한다.  (Retry 모듈이 가장 마지막에 적용)

- **Retry ( CircuitBreaker ( RateLimiter ( TimeLimiter ( BulkHead ( TargetFunction ) ) ) ) )**

## 속성

CircuitBreaker/Retry 설정에 사용되는 속성값으로 동작 방식을 제어한다.  

### CircuitBreaker property

| property                              | description                                                                                                                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| failureRateThreshold                  | 실패 비율 임계치를 백분율로 설정 해당 값을 넘어갈 시 Circuit Breaker 는 Open 상태로 전환되며, 이때부터 호출을 차단한다 (기본값: 50)                                                                                                          |
| slowCallRateThreshold                 | 임계값을 백분율로 설정, CircuitBreaker는 호출에 걸리는 시간이 slowCallDurationThreshold보다 길면 느린 호출로 간주,  <br>해당 값을 넘어갈 시 Circuit Breaker 는 Open상태로 전환되며, 이때부터 호출을 차단한다 (기본값: 100)                                    |
| slowCallDurationThreshold             | 호출에 소요되는 시간이 설정한 임계치보다 길면 느린 호출로 계산.  <br>응답시간이 느린 것으로 판단할 기준 시간 (60초, 1000 ms = 1 sec) (기본값: 60000[ms])                                                                                         |
| permittedNumberOfCallsInHalfOpenState | HALF_OPEN 상태일 때, OPEN/CLOSE 여부를 판단하기 위해 허용할 호출 횟수를 설정 수 (기본값: 10)                                                                                                                                |
| maxWaitDurationInHalfOpenState        | HALF_OPEN 상태로 있을 수 있는 최대 시간이다. 0일 때 허용 횟수만큼 호출을 모두 완료할 때까지 HALF_OEPN 상태로 무한정 기다린다. (기본값: 0)                                                                                                      |
| slidingWindowType                     | sliding window 타입을 결정한다. COUNT_BASED인 경우 slidingWindowSize 만큼의 마지막 call들이 기록되고 집계된다.  <br>TIME_BASED인 경우 마지막 slidingWindowSize초 동안의 call들이 기록되고 집계됩니다. (기본값: COUNT_BASED)                        |
| slidingWindowSize                     | CLOSED 상태에서 집계되는 슬라이딩 윈도우 크기를 설정한다. (기본값: 100)                                                                                                                                                   |
| minimumNumberOfCalls                  | minimumNumberOfCalls 이상의 요청이 있을 때부터 faiure/slowCall rate를 계산.  <br>예를 들어, 해당 값이 10이라면 최소한 호출을 10번을 기록해야 실패 비율을 계산할 수 있다.  <br>기록한 호출 횟수가 9번뿐이라면 9번 모두 실패했더라도 circuitbreaker는 열리지 않는다. (기본값: 100) |
| waitDurationInOpenState               | OPEN에서 HALF_OPEN 상태로 전환하기 전 기다리는 시간 (60초, 1000 ms = 1 sec) (기본값: 60000[ms])                                                                                                                      |
| recordExceptions                      | 실패로 기록할 Exception 리스트 (기본값: empty)                                                                                                                                                               |
| ignoreExceptions                      | 실패나 성공으로 기록하지 않을 Exception 리스트 (기본값: empty)                                                                                                                                                      |
| ignoreException                       | 기록하지 않을 Exception을 판단하는 Predicate을 설정 (커스터마이징, 기본값: throwable -> true)                                                                                                                           |
| recordFailure                         | 어떠한 경우에 Failure Count를 증가시킬지 Predicate를 정의해 CircuitBreaker에 대한 Exception Handler를 재정의.  <br>true를 return할 경우, failure count를 증가시키게 된다 (기본값: false)                                               |


### Retry property

|property|description|
|---|---|
|maxRetryAttempts|최대 재시도 수(최초 호출도 포함, 기본값 3)|
|waitDuration|재시도 할 때마다 기다리는 고정시간 (1초[1000ms], 기본값: 0.5초[500ms])|
|retryOnResultPredicate|반환되는 결과에 따라서 retry를 할지 말지 결정하는 filter  <br>true로 반환하면 retry하고 false로 반환하면 retry 하지 않는다. (기본값: (numOfAttempts,Either waitDuration)|
|retryExceptionPredicate|예외(Exception)에 따라 재시도 여부를 결정하기 위한 filter  <br>만약 예외에 따라 재시도해야 한다면 true를, 그 외엔 false를 리턴해야 한다. (기본값: result -> false)|
|retryExceptions|실패로 기록되는 블랙리스트 예외. empty일 경우 모든 에러 클래스를 재시도 (기본값: empty)|
|ignoreExceptions|무시되어야 하는 예외(화이트리스트) 즉, 재시도 되지 않아야 할 에러 클래스 리스트 (기본값: empty)|
|failAfterMaxRetries|설정한 maxAttempts 만큼 재시도하고 나서도 결과가 여전히 retryOnResultPredicate를 통과하지 못했을 때  <br>MaxRetriesExceededException 발생을 활성화/비활성화하는 boolean (기본값: false)|


## 출처 및 참고자료

```cardlink
url: https://oliveyoung.tech/2023-08-31/circuitbreaker-inventory-squad/
title: "Circuitbreaker를 사용한 장애 전파 방지 | 올리브영 테크블로그"
description: "Circuitbreaker와 Resilience4j A to Z"
host: oliveyoung.tech
favicon: https://oliveyoung.tech/favicon.png
image: https://oliveyoung.tech/blog-images/2023-08-31/banner.png
```
