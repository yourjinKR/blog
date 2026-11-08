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

## JobLauncher

`JobLauncher`는 Spring Batch 6.0부터 `Deprecated`되었기에 대신 `JobOperator`를 사용하면 된다.  

```java
// 전
jobLauncher.run(jobRegistry.getJob("firstJob"), jobParameters);
// 후
jobOperator.start(jobRegistry.getJob("firstJob"), jobParameters);
```

> [!INFO] 왜 `JobLauncher`가 없어졌을까?
> 기존에 `JobLauncher`는 단순히 `Job`을 실행하는 역할에 그쳤다. 반면 `JobOperator`는 `Job` 실행/중지/재시작 등을 운영할 수 있었다. 인프라 간소화를 위해 `JobLauncher`의 기능을 포함한 `JobOperator`만을 남긴 것이다.  
> 
> https://docs.spring.io/spring-batch/reference/whatsnew.html#_batch_infrastructure_configuration_simplification

%%%%
## JobRegistry

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

## Step

- Chunk 방식 (Read → Process → Write)
- Tasklet 방식: Tasklet 방식은 아주 간단한 동작만 수행, 데이터 조건을 걸어야 하는 경우 거의 사용하지 않음
	- 사용 예시: 단순한 파일 삭제, 값 초기화 등등

### Chunk 단위 처리 과정

청크값을 10으로 설정했다면 아래와 같이 작업을 수행한다.  

> (Read) x 10 → (Write) x 10 → Write

#### Skip

> [!CAUTION] `noSkip()` 메서드 미지원
> Spring Batch 6 부터는 책임 단순화를 위해 `noSkip()`을 지원하지 않는다.  
> 그렇기에 `SkipPolicy`를 중심으로 Skip 동작의 세부 동작을 제어하도록 한다.  
> 
> `FaultTolerantStepBuilder` → `ChunkOrientedStepBuilder`

SKip은 과정 중 예외가 발생하게 되면 예외를 특정 수 까지 건너 뛸 수 있도록 설정하는 방식이다.  

```java
@Bean
public Step sixthStep() {
    return new StepBuilder("sixthStep", jobRepository)
            .<BeforeEntity, AfterEntity> chunk(10, platformTransactionManager)
            .reader(beforeSixthReader())
            .processor(middleSixthProcessor())
            .writer(afterSixthWriter())
            .faultTolerant()
            .skip(Exception.class) // EXception을 Skip
            .noSkip(FileNotFoundException.class) // 그러나 해당 Exception은 Skip하지 않음
            .noSkip(IOException.class) // 그러나 해당 Exception은 Skip하지 않음
            .skipLimit(10) // 스킵할 구간
            .build();
}
```

`SkipPolicy`를 구현하여 스킵 정책을 커스텀할 수 있다.  

```java
@Configuration  
public class CustomSkipPolicy implements SkipPolicy {  
    @Override  
    public boolean shouldSkip(@NonNull Throwable t, long skipCount) throws SkipLimitExceededException {  
        if (t instanceof FileNotFoundException) return false;  
        if (t instanceof IOException) return false;  
        return true;  
    }  
}
```

```java
@Bean  
public SkipPolicy fourthSkipPolicy() {  
    return (t, skipCount) ->  {  
        if (t instanceof FileNotFoundException) return false;  
        if (t instanceof IOException) return skipCount < 10;  
        return true;  
    };  
}
```

#### Retry

> [!CAUTION] `noRetry()` 메서드 미지원
> Spring Batch 6부터는 `noRetry()` 메서드 또한 기본 구현체에서 지원하지 않기에 `RetryPolicy` Bean을 등록하여 `retryPolicy()`에 추가하자. 의존성은 `org.springframework.core.retry.RetryPolicy` 이다.  
> 
> `FaultTolerantStepBuilder` → `ChunkOrientedStepBuilder`

Retry는 Step의 과정 중 예외가 발생했을 때 특정 수까지 반복 시도할 수 있도록 설정하는 방법이다.  

```java
@Bean  
public Step fourthStep() {  
    System.out.println("fourth step");  
    return new StepBuilder("fourthStep", jobRepository)  
            .<Row, AfterEntity>chunk(10)  
            .transactionManager(transactionManager)  
            .reader(excelReader())  
            .processor(fourthProcessor())  
            .writer(fourthAfterWriter())  
            .skipPolicy(fourthSkipPolicy())  
            .retryLimit(3) // 몇번 재시도
            .retry(BatchCustomException.class) // 재시도할 예외  
            .noRetry(FileNotFoundException.class)
            .build();  
}
```

`RetryPolicy`를 통해서도 재시도 정책을 구현할 수 있다.  

```java
@Bean  
public RetryPolicy fourthRetryPolicy() {  
    return RetryPolicy.builder()  
            .maxRetries(3)  
            .includes(IOException.class, SQLException.class) // 포함
            .excludes(FileNotFoundException.class) // 제외
            .build();  
}
```

%%### Writer 롤백 제어%%
%% 더 알아보기  %%

#### Step Listener

stepListener는 Step의 실행 전후에 특정 작업을 수행 시킬 수 있는 방법이다.  
로그를 남기거나 다음 Step이 준비가 되었는지, 이번 Step과 다음 Step이 의존되는 경우 변수 정리를 진행힐 수 있다.  

```java
@Bean  
public StepExecutionListener stepExecutionListener() {  
    return new StepExecutionListener() {  
        @Override  
        public void beforeStep(StepExecution stepExecution) {  
            System.out.println("before step");  
            StepExecutionListener.super.beforeStep(stepExecution);  
        }  
  
        @Override  
        public @Nullable ExitStatus afterStep(StepExecution stepExecution) {  
            System.out.println("after step");  
            return StepExecutionListener.super.afterStep(stepExecution);  
        }  
    };  
}
```

## Job




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
