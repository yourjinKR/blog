---
tags:
  - Spring
aliases:
  - Async Annotation
  - Async 어노테이션
---
`@Async`는 [[Spring AOP]] Proxy가 메서드 실행을 Executor의 다른 Thread로 넘겨 호출 Thread와 작업 Thread를 분리하는 기능이다.

- `@EnableAsync`로 기능 활성화
- `@Async` 메서드 호출 시 **Spring Proxy가 호출을 가로채 `TaskExecutor`에 작업을 제출**
- 실제 메서드는 **별도 Worker Thread**에서 실행
- 호출한 Thread는 작업 완료를 기다리지 않고 계속 진행
- **비동기 ≠ Non-Blocking**: 내부에서 JDBC/JPA를 쓰면 Worker Thread는 여전히 Blocking
- 같은 객체 내부에서 `this.asyncMethod()`처럼 호출하면 **Self Invocation 때문에 `@Async` 미적용**
- 반환형은 주로 `void`, `Future`, `CompletableFuture`
- `void`에서 발생한 예외는 호출자의 `try-catch`로 잡을 수 없음
- 호출 Thread의 `@Transactional` 컨텍스트가 Async Thread로 그대로 전파되지 않음
- 실무에서는 [[ThreadPoolTaskExecutor]]의 **Pool Size / Queue / Reject 정책** 설정이 중요

