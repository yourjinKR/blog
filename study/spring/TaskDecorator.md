---
date: 2026-11-16
tags:
  - Spring
---
비동기 작업 실행 전후에 공통 로직을 추가할 수 있는 인터페이스이다.  
JDK의 Runnable를 감싸는 [[Decorator|데코레이터 패턴]]을 추상화한 것이다.  

## 로깅 예제

```java
@FunctionalInterface
public interface TaskDecorator {
    Runnable decorate(Runnable runnable);
}
```

```java
public class LoggingTaskDecorator implements TaskDecorator {

    private static final Logger log =
            LoggerFactory.getLogger(LoggingTaskDecorator.class);

    @Override
    public Runnable decorate(Runnable runnable) {
        return () -> {
            long start = System.nanoTime();

            try {
                runnable.run();
            } finally {
                long elapsed = System.nanoTime() - start;

                log.info("비동기 작업 실행시간: {}ms",
                        elapsed / 1_000_000);
            }
        };
    }
}
```

```java
@Bean
public ThreadPoolTaskExecutor taskExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

    executor.setCorePoolSize(2);
    executor.setMaxPoolSize(5);
    executor.setQueueCapacity(100);

    executor.setTaskDecorator(new LoggingTaskDecorator());

    return executor;
}
```


## 출처 및 참고자료

```cardlink
url: https://blog.gangnamunni.com/post/mdc-context-task-decorator
title: "Spring 의 동기, 비동기, 배치 처리시 항상 context 를 유지하고 로깅하기"
description: "async 처리시 로깅을 위해 ThreadLocal, MDC, 그리고 TaskDecorator 를 활용해보자"
host: blog.gangnamunni.com
favicon: https://blog.gangnamunni.com/favicon.ico
image: https://blog.gangnamunni.com/contents/posts/238d9338-d3d4-8069-9382-d7bf45a89927/cover/image_(8).png
```


