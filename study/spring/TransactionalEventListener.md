---
tags:
  - Spring
aliases:
  - "@TransactionalEventListener"
---
`ApplicationEventPublisher`르 사용

```java
import org.springframework.context.ApplicationEventPublisher;

public class ServiceExample { 
	private final ApplicationEventPublisher publisher;
}
```

`@TransactionalEventListener`로 특정 트랜잭션을 기준으로 로직 실행

```java
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)  
public void notifyAlarm(AlarmCreateEvent event) {  
    alarmChannelService.notify(event.receiverId(), event.alarm());  
}
```

트랜잭션 내부 로직에서 이벤트 발행

```java
publisher.publishEvent(new AlarmCreateEvent(Long receiverId, Alarm alarm));
```

### phase 옵션

- `TransactionPhase.AFTER_COMMIT`: 트랜잭션이 commit 되었을 때 이벤트를 실행합니다.
- `TransactionPhase.ROLLBACK`: 트랜잭션이 rollback 되었을 때 이벤트를 실행합니다.
- `TransactionPhase.AFTER_COMPLETION`: 트랜잭션이 commit 또는 rollback 되었을 때 이벤트 실행합니다.
- `TransactionPhase.BEFORE_COMMIT`: 트랜잭션이 commit 되기 전에 이벤트를 실행합니다.

### fallbackExecution 옵션

이벤트 발행 시 활성 트랜잭션이 없어도 `@TransactionalEventListener`를 실행할 것인지 결정하는 옵션

| 상황      | `false` (기본)    | `true`          |
| ------- | --------------- | --------------- |
| 트랜잭션 있음 | 지정한 `phase`에 실행 | 지정한 `phase`에 실행 |
| 트랜잭션 없음 | **실행 안 함**      | **리스너 실행**      |

## 출처 및 참고자료

```cardlink
url: https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/event/TransactionalEventListener.html
title: "TransactionalEventListener (Spring Framework 7.0.9 API)"
description: "declaration: package: org.springframework.transaction.event, annotation type: TransactionalEventListener"
host: docs.spring.io
```
