---
date: 2026-11-02
tags:
  - Spring
aliases:
  - 스프링 배치
---
## 개요

Spring Batch는 대량 데이터를 안정적으로 처리하는 Batch Application을 만들기 위한 Spring 기반 프레임워크이다.  

> 연말 정산, 은행 이자 시스템, 주기별 회원 권한 조정, 데이터 일괄 삭제 등등… 

> [!INFO]
> Batch란 “일정 시간 동안 대량의 데이터를 한 번에 처리하는 방식”을 의마한다. (실시간 처리와 반대 개념)

대용량 데이터를 처리하는 중간에 프로그램이 멈출 수 있는 장치를 마련해야 하기 때문에 프레임워크를 사용하는 것이다.  
Spring Batch에서는 아래와 같은 기능들을 제공한다.  

- Transaction 관리
- Logging / Tracing
- 실행 상태 관리
- 실패 후 재시작
- Skip
- 통계
- Resource 관리
- 병렬/분산 처리

> [!caution] Spring Batch와 Scheduler의 차이점 
> Batch는 일정 Scheduler와 같이 사용할 수 있도록 설계되었다.  
> 그렇다고 해서 시간 특정 작업을 수행하는 Scheduler와 같은 개념이 아니다.  
> Batch는 단순히 **데이터를 그룹화하여 일괄 처리하는 방법**을 말한다.  

그 중에서도 배치에서 가장 중요하게 생각되는 핵심은 다음과 같다.  

1. 어떤 작업까지 수행했는지 파악할 수 있어야 한다.  
2. 이미 수행한 작업에 대해서는 중복 수행하지 않도록 주의한다.  

## 동작 방식

> [!caution] 
> 해당 방식은 Spring Batch 6.0을 기반으로 작성됐습니다.  

![[IMG-20261102203959355.png]]

- **JobLauncher**: 하나의 배치 작업을 실행시키는 시작점
- **Job**: `읽기 → 처리 → 쓰기` 과정을 정의한 배치 작업
- **Step**: 실제 하나의 `읽기 → 처리 → 쓰기` 작업을 정의한 부분 
- **ItemReader**: 읽어오는 부분
- **ItemProcessor**: 처리하는 부분
- **ItemWriter**: 쓰는 부분
- **JobRepository**: 얼만큼 했는지, 특정 일자 배치를 이미 했는지 메타 데이터에 기록하는 부분

### JobLauncher

`JobLauncher`는 Spring Batch 6.0부터 `Deprecated`되었다.  

```java
jobLauncher.run(jobRegistry.getJob("firstJob"), jobParameters);
```

![[IMG-20261102223014902.png|389]]

대신 `JobOperator`를 사용하면 된다.  

```java
jobOperator.start(jobRegistry.getJob("firstJob"), jobParameters);
```

> [!INFO] 왜 `JobLauncher`가 없어졌을까?
> 기존에 `JobLauncher`는 단순히 `Job`을 실행하는 역할에 그쳤다. 반면 `JobOperator`는 `Job` 실행/중지/재시작 등을 운영할 수 있었다. 인프라 간소화를 위해 `JobLauncher`의 기능을 포함한 `JobOperator`만을 남긴 것이다.  
> 
> https://docs.spring.io/spring-batch/reference/whatsnew.html#_batch_infrastructure_configuration_simplification

### JobRegistry

Spring Batch 6.0부터는 `JobRegistry`가 선택적으로 사용하도록 변경되었다.  
ApplicationContext에 있는 `Job` Bean들을 스스로 찾아 등록한다.  

> [!quote]
> The `JobRegistry` is now optional, and smart enough to register jobs automatically, so there is no need to define a separate `JobRegistrySmartInitializingSingleton` bean.
> 
> https://docs.spring.io/spring-batch/reference/whatsnew.html#_batch_infrastructure_configuration_simplification

그렇기에 자동으로 Bean등록을 하지 않으므로 기존 코드를 유지하고 싶다면 별도의 Bean을 생성하자.  

```java
@Configuration  
public class BatchConfig {  
  
    @Bean  
    public JobRegistry jobRegistry() {  
        return new MapJobRegistry();  
    }  
}
```


%%%%
## 출처 및 참고자료

```cardlink
url: https://docs.spring.io/spring-batch/reference/index.html
title: "Overview :: Spring Batch Reference"
host: docs.spring.io
favicon: ./_/img/favicon.ico
```

```cardlink
url: https://dkswnkk.tistory.com/707
title: "Spring Batch란? 간단한 개념과 코드 살펴보기"
description: "서론 스프링 배치(Spring Batch)는 대용량 데이터를 처리하기 위한 프레임워크로, 스프링 프레임워크 기반에서 작동합니다. 일반적으로 배치 작업은 대량의 데이터를 처리하거나, 주기적이고 반복적인 작업을 실행하는 데 사용되며, 스프링 배치는 이러한 작업을 효율적이고 안정적으로 처리할 수 있는 대표적으로 아래와 같은 기능들을 제공합니다. 로깅 및 추적 트랜잭션 관리 작업 처리 통계 작업 재시작 건너뛰기 리소스 관리 Batch와 Scheduler의 차이 배치(Batch)는 논리적 또는 물리적으로 관련된 일련의 데이터를 그룹화하여 일괄 처리하는 방법을 의미합니다. 반면에 스케줄러(Scheduler)는 주어진 작업을 미리 정의된 시간에 실행할 수 있게 해주는 도구나 소프트웨어를 의미합니다. 여기서 주의할 점.."
host: dkswnkk.tistory.com
image: https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F2wLvU%2FbtsplQMxDED%2FAAAAAAAAAAAAAAAAAAAAAG64AnqdOrS0msgyFD1VUY8EBuUiWx5Fpd6b5PfU1JdV%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1796050799%26allow_ip%3D%26allow_referer%3D%26signature%3DmwCDDqvZE%252BLuvJ1MSCDIcHPn%252FbU%253D
```

```cardlink
url: https://www.youtube.com/playlist?list=PLJkjrxxiBSFCaxkvfuZaK5FzqQWJwmTfR
title: "스프링 배치 5"
description: "스프링 배치 5 프레임워크 기반 배치 처리 구현 : Spring Batch 5"
host: www.youtube.com
favicon: https://www.youtube.com/s/desktop/e358493a/img/favicon_32x32.png
image: https://i.ytimg.com/vi/MNzPsOQ3NJk/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDFeEloYBlAXzoMX3AUsxzEd3sTnA&days_since_epoch=20759
```
